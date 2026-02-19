/**
 * Password Auth Guard
 * 
 * Protects routes by requiring authentication via password login
 */

import React from 'react';
import { usePasswordAuth } from './PasswordAuthContext';
import { LoginPage } from '../pages/LoginPage';

interface PasswordAuthGuardProps {
  children: React.ReactNode;
}

export const PasswordAuthGuard: React.FC<PasswordAuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = usePasswordAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666',
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
};
