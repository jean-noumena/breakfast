/**
 * User Menu Component
 * 
 * Displays current user info and logout button
 */

import React from 'react';
import { useAuth } from 'react-oidc-context';
import './UserMenu.css';

export const UserMenu: React.FC = () => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="user-menu">
      {auth.user?.profile?.name && (
        <span className="user-name">{auth.user.profile.name}</span>
      )}
      <button 
        onClick={() => auth.signoutRedirect()}
        className="logout-button"
        title="Logout"
      >
        Logout
      </button>
    </div>
  );
};
