/**
 * ParticipantsPage
 * 
 * Demonstrates the Composable Frontend Platform using Smart components.
 * This page shows how SmartListView and SmartDetailView eliminate boilerplate.
 * 
 * Routing:
 * - /participants - Table view (list of participants)
 * - /participants/:id - Detail view (single participant)
 */

import { Routes, Route, useParams } from 'react-router-dom';
import { SmartListView, SmartDetailView, PartiesDisplay } from '@npl/frontend';
import { ParticipantResource } from '@resources';

/**
 * ParticipantListView - Table view using SmartListView
 */
function ParticipantListView() {
  return (
    <SmartListView
      resource={ParticipantResource}
      pageSize={10}
      className="participants-page"
    />
  );
}

/**
 * ParticipantDetailView - Detail view using SmartDetailView
 */
function ParticipantDetailView() {
  const params = useParams<{ id: string }>();

  return (
    <SmartDetailView
      resource={ParticipantResource}
      entityId={params.id!}
      fieldRenderers={{
        // Use PartiesDisplay component for parties field
        '@parties': (value) => <PartiesDisplay parties={value} mode="full" />,
      }}
      className="participants-page"
    />
  );
}

/**
 * ParticipantsPage - Main page component with routing
 */
export function ParticipantsPage() {
  return (
    <Routes>
      <Route index element={<ParticipantListView />} />
      <Route path=":id" element={<ParticipantDetailView />} />
    </Routes>
  );
}
