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

import { useState, type JSX } from 'react';
import { ActionModal, PartiesDisplay, SmartDetail, SmartTable, type ActionDefinition, type Party, type ResourceDefinition } from '@npl/frontend';
import { ParticipantResource, BreakfastResource } from '@resources';
import { useAuth } from 'react-oidc-context';
import { useGetParticipantList, useCreateParticipant } from '@gen/api/breakfast/default/default';
import type { GetParticipantListParams , ParticipantCreate, _Party, Participant } from '@gen/api/breakfast/breakfast.schemas';
import { useQueryClient } from '@tanstack/react-query';
import './HomePage.css';

export function HomePage() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const { data: participantsData, isLoading, error, refetch } = useGetParticipantList();
  const createParticipant = useCreateParticipant();
  const [newlyCreatedParticipant, setNewlyCreatedParticipant] = useState<Participant | null>(null);

  const [selectedAction, setSelectedAction] = useState<ActionDefinition | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<ResourceDefinition<
  Participant,
  GetParticipantListParams,
  ParticipantCreate
> | null>(null);

  // Get authenticated user's preferred_username
  const userPreferredUsername = auth.user?.profile?.preferred_username;

  if (isLoading) {
    return (
      <div className="home-page">
        <div className="home-page__loading">
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="home-page__error-container">
          <p>Error loading participants: {error.message}</p>
        </div>
      </div>
    );
  }

  // Check if we have a newly created participant first, otherwise find from list
  let matchedParticipant = newlyCreatedParticipant;
  
  if (!matchedParticipant) {
    // Find participant whose participant party preferred_username matches the authenticated user
    matchedParticipant = participantsData?.items?.find((participant: Participant) => {
      const participantParty = participant['@parties']?.participant as _Party | undefined;
      const participantClaims = participantParty?.claims?.preferred_username;
      return participantClaims && userPreferredUsername && participantClaims.includes(userPreferredUsername);
    }) || null;
  }

  // Handle case: no participant found
  if (!matchedParticipant) {
    const handleCreateParticipant = async () => {
      try {
        const response = await createParticipant.mutateAsync({
          data: {
            name: auth.user?.profile?.name ||
              auth.user?.profile?.preferred_username ||
              (auth.user?.profile?.first_name as string | undefined) ||
              auth.user?.profile?.email ||
              'User',
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
      <div className="home-page">
        <div className="home-page__create-profile">
          <h2>Welcome, {auth.user?.profile?.name || 'User'}!</h2>
          <p>
            You don't have a participant profile yet. Create one to start organizing and joining breakfast events!
          </p>
          <button
            onClick={handleCreateParticipant}
            disabled={createParticipant.isPending}
            className="home-page__create-button"
          >
            {createParticipant.isPending ? 'Creating Profile...' : 'Create My Profile'}
          </button>
          {createParticipant.isError && (
            <p className="home-page__error">
              Failed to create profile. Please try again.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Handle case: participant found - show detail + all events
  const participantId = matchedParticipant['@id'];

  const handleActionClick = (action: ActionDefinition, entity: ResourceDefinition<
  Participant,
  GetParticipantListParams,
  ParticipantCreate
>) => {
    setSelectedAction(action);
    setSelectedEntity(entity);
  };

  const handleModalClose = () => {
    setSelectedAction(null);
    setSelectedEntity(null);
  };

  const handleActionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [ParticipantResource.name, participantId] });
  };

  return (
    <div className="home-page">
      <div className="home-page__welcome">
        <h1>Welcome, {auth.user?.profile?.name || 'User'}!</h1>
        <p>Manage your breakfast events and connect with other participants</p>
      </div>
      
      {/* Participant Detail View */}
      <section className="home-page__profile">
        <h2 className="home-page__section-title">Your Profile</h2>
        <SmartDetail
          resource={ParticipantResource}
          entityId={participantId}
          fieldRenderers={{
            // Use PartiesDisplay component for parties field
            '@parties': (value: Record<string, Party>) => <PartiesDisplay parties={value} mode="inline" />,
          } as Record<string, (value: unknown, entity: ResourceDefinition<Participant, GetParticipantListParams, ParticipantCreate>) => JSX.Element>}
          onActionClick={handleActionClick as (action: ActionDefinition, entity: ResourceDefinition<
  Participant,
  GetParticipantListParams,
  ParticipantCreate
>) => void}
        />
      </section>

      {/* All Breakfast Events List */}
      <section className="home-page__events">
        <h2 className="home-page__section-title">All Breakfast Events</h2>
        <SmartTable
          resource={BreakfastResource}
          pageSize={10}
        />
      </section>
      
      {/* Action Modal - only renders when an action is selected */}
      {selectedAction && selectedEntity && (
        <ActionModal
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action={selectedAction as ActionDefinition<any, any>}
          entity={selectedEntity}
          isOpen={true}
          onClose={handleModalClose}
          onSuccess={handleActionSuccess}
          queryClient={queryClient}
          resource={ParticipantResource}
        />
      )}
    </div>
  );
}