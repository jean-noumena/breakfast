/**
 * Generated Routes
 * 
 * Auto-generated route configuration for all resources.
 * Generated on: 2026-03-11T11:16:24.138Z
 * 
 * Usage in App.tsx:
 * 
 * import { GeneratedRoutes } from './GeneratedRoutes';
 * 
 * function App() {
 *   return (
 *     <Routes>
 *       {GeneratedRoutes}
 *       ... your custom routes here ...
 *     </Routes>
 *   );
 * }
 */

import { Route } from 'react-router-dom';
import { BreakfastEventPage } from './pages/BreakfastEventPage.generated';
import { ParticipantPage } from './pages/ParticipantPage.generated';

export const GeneratedRoutes = (
  <>
    <Route path="breakfastEvents/*" element={<BreakfastEventPage />} />
    <Route path="participants/*" element={<ParticipantPage />} />
  </>
);
