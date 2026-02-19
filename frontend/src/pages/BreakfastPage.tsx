/**
 * BreakfastsPage
 * 
 * Demonstrates the Composable Frontend Platform using Smart components.
 * This page shows how SmartListView and SmartDetailView eliminate boilerplate.
 * 
 * Routing:
 * - /breakfasts - Table view (list of breakfasts)
 * - /breakfasts/:id - Detail view (single breakfast)
 */

import { Routes, Route, useParams } from 'react-router-dom';
import { SmartListView, SmartDetailView, StateBadge, PartiesDisplay } from '@npl/frontend';
import { BreakfastResource } from '@resources';

/**
 * BreakfastListView - Table view using SmartListView
 */
function BreakfastListView() {
  return (
    <SmartListView
      resource={BreakfastResource}
      pageSize={10}
      className="breakfasts-page"
    />
  );
}

/**
 * BreakfastDetailView - Detail view using SmartDetailView
 */
function BreakfastDetailView() {
  const params = useParams<{ id: string }>();

  return (
    <SmartDetailView
      resource={BreakfastResource}
      entityId={params.id!}
      fieldRenderers={{
        // Use StateBadge component for state field
        '@state': (value) => <StateBadge state={value as string} />,
        // Use PartiesDisplay component for parties field
        '@parties': (value) => <PartiesDisplay parties={value} mode="full" />,
      }}
      className="breakfasts-page"
    />
  );
}

/**
 * BreakfastsPage - Main page component with routing
 */
export function BreakfastsPage() {
  return (
    <Routes>
      <Route index element={<BreakfastListView />} />
      <Route path=":id" element={<BreakfastDetailView />} />
    </Routes>
  );
}
