/**
 * User Menu Component
 * 
 * Displays current user info and logout button
 */

import React from 'react';
import { usePasswordAuth } from '../auth/PasswordAuthContext';
import './UserMenu.css';

export const UserMenu: React.FC = () => {
  const { logout, isAuthenticated } = usePasswordAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="user-menu">
      <button 
        onClick={logout}
        className="logout-button"
        title="Logout"
      >
        Logout
      </button>
    </div>
  );
};
