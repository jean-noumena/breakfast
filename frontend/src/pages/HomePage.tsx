/**
 * HomePage Component
 * 
 * Entry point / landing page shown at root (/).
 * Now uses the generic SmartHomePage component which automatically:
 * - Displays welcome message with user name
 * - Shows quick access cards to available resources
 * 
 * This page is shown when no menu item is selected.
 */

import { SmartHomePage } from '@npl/frontend';
import { ALL_RESOURCES } from '@resources';
import { UserMenu } from '@components';
import './HomePage.css';

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
      <SmartHomePage resources={ALL_RESOURCES} />
    </>
  );
}
