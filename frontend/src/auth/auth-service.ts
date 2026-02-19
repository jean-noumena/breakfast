/**
 * Authentication Service
 * 
 * Handles communication with the OIDC token endpoint for password-based authentication
 */

import axios from 'axios';
import { tokenStorage, type TokenData } from './token-storage';

const OIDC_AUTHORITY = import.meta.env.VITE_OIDC_AUTHORITY;
const CLIENT_ID = import.meta.env.VITE_OIDC_CLIENT_ID || 'breakfast-app';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export class AuthService {
  private tokenEndpoint: string;

  constructor() {
    if (!OIDC_AUTHORITY) {
      throw new Error('VITE_OIDC_AUTHORITY is not configured');
    }
    this.tokenEndpoint = `${OIDC_AUTHORITY}/token`;
  }

  /**
   * Login with username and password using Resource Owner Password Credentials grant
   */
  async login(credentials: LoginCredentials): Promise<TokenData> {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('username', credentials.username);
      params.append('password', credentials.password);
      params.append('client_id', CLIENT_ID);

      const response = await axios.post<TokenResponse>(
        this.tokenEndpoint,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const tokenData: TokenData = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      };

      tokenStorage.setTokens(tokenData);
      return tokenData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error_description ||
          error.response?.data?.error ||
          'Login failed'
        );
      }
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<TokenData> {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', refreshToken);
      params.append('client_id', CLIENT_ID);

      const response = await axios.post<TokenResponse>(
        this.tokenEndpoint,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const tokenData: TokenData = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || refreshToken,
        expiresIn: response.data.expires_in,
      };

      tokenStorage.setTokens(tokenData);
      return tokenData;
    } catch (error) {
      // If refresh fails, clear tokens and force re-login
      tokenStorage.clearTokens();
      throw new Error('Session expired. Please login again.');
    }
  }

  /**
   * Logout - clear tokens
   */
  logout(): void {
    tokenStorage.clearTokens();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenStorage.hasValidToken();
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return tokenStorage.getAccessToken();
  }
}

export const authService = new AuthService();
