/**
 * HomePage Component
 * 
 * Entry point / landing page shown at root (/).
 * Displays the current user's participant profile and all breakfast events.
 * - Fetches participants and matches by authenticated user's preferred_username
 * - If no participant found, offers to create one
 * - If participant found, shows detail view + all breakfast events
 * 
 * This page is shown when no menu item is selected.
 */

import { useState } from 'react';
import { PartiesDisplay, SmartDetailView, SmartListView, StateBadge } from '@npl/frontend';
import { ParticipantResource, BreakfastResource } from '@resources';
import { UserMenu } from '@components';
import { useAuth } from 'react-oidc-context';
import { useGetParticipantList, useCreateParticipant } from '@gen/api/breakfast/default/default';
import type { Participant } from '@gen/api/breakfast/breakfast.schemas';
import { useQueryClient } from '@tanstack/react-query';
import './HomePage.css';

function HomePageContent() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const { data: participantsData, isLoading, error, refetch } = useGetParticipantList();
  const createParticipant = useCreateParticipant();
  const [newlyCreatedParticipant, setNewlyCreatedParticipant] = useState<Participant | null>(null);

  // Get authenticated user's preferred_username
  const userPreferredUsername = auth.user?.profile?.preferred_username;

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <p>Error loading participants: {error.message}</p>
      </div>
    );
  }

  // Check if we have a newly created participant first, otherwise find from list
  let matchedParticipant = newlyCreatedParticipant;
  
  if (!matchedParticipant) {
    // Find participant whose participant party preferred_username matches the authenticated user
    matchedParticipant = participantsData?.items?.find((participant: Participant) => {
      const participantClaims = participant['@parties']?.participant?.claims?.preferred_username;
      return participantClaims && userPreferredUsername && participantClaims.includes(userPreferredUsername);
    }) || null;
  }

  // Handle case: no participant found
  if (!matchedParticipant) {
    const handleCreateParticipant = async () => {
      try {
        const response = await createParticipant.mutateAsync({
          data: {
            name: auth.user?.profile?.name || 'User',
            "@parties": {}
          }
        });
        // Store the newly created participant to immediately display it
        setNewlyCreatedParticipant(response as Participant);
        // Invalidate and refetch the participants list
        queryClient.invalidateQueries({ queryKey: ['getParticipantList'] });
        refetch();
      } catch (err) {
        console.error('Failed to create participant:', err);
      }
    };

    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Welcome, {auth.user?.profile?.name || 'User'}!</h2>
        <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          You don't have a participant profile yet.
        </p>
        <button
          onClick={handleCreateParticipant}
          disabled={createParticipant.isPending}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: createParticipant.isPending ? 'not-allowed' : 'pointer',
            opacity: createParticipant.isPending ? 0.6 : 1
          }}
        >
          {createParticipant.isPending ? 'Creating Profile...' : 'Create My Profile'}
        </button>
        {createParticipant.isError && (
          <p style={{ marginTop: '1rem', color: 'red' }}>
            Failed to create profile. Please try again.
          </p>
        )}
      </div>
    );
  }

  // Handle case: participant found - show detail + all events
  const participantId = matchedParticipant['@id'];

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Welcome, {auth.user?.profile?.name || 'User'}!</h1>
      
      {/* Participant Detail View */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Your Profile</h2>
        <SmartDetailView
          resource={ParticipantResource}
          entityId={participantId}
          fieldRenderers={{
            // Use StateBadge component for state field
            '@state': (value) => <StateBadge state={value as string} />,
            // Use PartiesDisplay component for parties field
            '@parties': (value) => <PartiesDisplay parties={value} mode="inline" />,
          }}
        />
      </section>

      {/* All Breakfast Events List */}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>All Breakfast Events</h2>
        <SmartListView
          resource={BreakfastResource}
          pageSize={10}
        />
      </section>
    </div>
  );
}

export function HomePage() {
  return (
    <>
      <div style={{ 
        position: 'fixed', 
        top: '16px', 
        right: '16px', 
        zIndex: 1000 
      }}>
        <UserMenu />
      </div>
      <HomePageContent />
    </>
  );
}
