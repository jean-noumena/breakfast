/**
 * Login Page
 * 
 * Provides a form for username/password authentication
 */

import React, { useState } from 'react';
import { usePasswordAuth } from '../auth/PasswordAuthContext';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const { login, error, clearError, isLoading } = usePasswordAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!username || !password) {
      setLocalError('Please enter both username and password');
      return;
    }

    try {
      await login(username, password);
    } catch (err) {
      // Error is handled by context
      console.error('Login error:', err);
    }
  };

  const displayError = error || localError;

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome</h1>
          <p>Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {displayError && (
            <div className="login-error">
              {displayError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
