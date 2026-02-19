/**
 * DocumentsPage
 * 
 * Demonstrates the Composable Frontend Platform using Smart components.
 * This page shows how SmartListView and SmartDetailView eliminate boilerplate.
 * 
 * Routing:
 * - /documents - Table view (list of documents)
 * - /documents/:id - Detail view (single document)
 */

import { Routes, Route, useParams } from 'react-router-dom';
import { SmartListView, SmartDetailView, StateBadge, PartiesDisplay } from '@npl/frontend';
import { DocumentResource } from '@resources';

/**
 * DocumentListView - Table view using SmartListView
 */
function DocumentListView() {
  return (
    <SmartListView
      resource={DocumentResource}
      pageSize={10}
      className="documents-page"
    />
  );
}

/**
 * DocumentDetailView - Detail view using SmartDetailView
 */
function DocumentDetailView() {
  const params = useParams<{ id: string }>();

  return (
    <SmartDetailView
      resource={DocumentResource}
      entityId={params.id!}
      fieldRenderers={{
        // Use StateBadge component for state field
        '@state': (value) => <StateBadge state={value as string} />,
        // Use PartiesDisplay component for parties field
        '@parties': (value) => <PartiesDisplay parties={value} mode="full" />,
      }}
      className="documents-page"
    />
  );
}

/**
 * DocumentsPage - Main page component with routing
 */
export function DocumentsPage() {
  return (
    <Routes>
      <Route index element={<DocumentListView />} />
      <Route path=":id" element={<DocumentDetailView />} />
    </Routes>
  );
}
