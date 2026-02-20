import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout, getMenuItems, DEFAULT_PATH, AuthGuard } from '@npl/frontend';
import { HomePage } from '@pages';
import { ALL_RESOURCES } from '@resources';

function App() {
  const menuItems = getMenuItems(ALL_RESOURCES);

  return (
    <BrowserRouter>
      <AuthGuard>
        <Routes>
          <Route element={<AppLayout resources={ALL_RESOURCES} />}>
            {/* Home/Entry point route */}
            <Route path={DEFAULT_PATH} element={<HomePage />} /> 
            
            {/* Resource routes - dynamically generated from resource definitions */}
            {menuItems.map((resource) => {
              const PageComponent = resource.pageComponent;
              
              if (!PageComponent) {
                console.warn(`Resource ${resource.name} has menu config but no pageComponent`);
                return null;
              }
              
              return (
                <Route
                  key={resource.name}
                  path={`${resource.menu.path}/*`}
                  element={<PageComponent />}
                />
              );
            })}
            
            {/* 404 - Redirect to home */}
            <Route path="*" element={<Navigate to={DEFAULT_PATH} replace />} />
          </Route>
        </Routes>
      </AuthGuard>
    </BrowserRouter>  
  );
}

export default App;
