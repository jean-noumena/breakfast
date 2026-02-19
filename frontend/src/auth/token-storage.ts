/**
 * Token Storage Utility
 * 
 * Manages access and refresh tokens in localStorage
 */

const ACCESS_TOKEN_KEY = 'npl_access_token';
const REFRESH_TOKEN_KEY = 'npl_refresh_token';
const TOKEN_EXPIRY_KEY = 'npl_token_expiry';

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export const tokenStorage = {
  /**
   * Store tokens in localStorage
   */
  setTokens(data: TokenData): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    
    if (data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }
    
    if (data.expiresIn) {
      const expiryTime = Date.now() + data.expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
  },

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;
    
    const expiry = parseInt(expiryTime, 10);
    // Consider token expired 30 seconds before actual expiry
    return Date.now() >= expiry - 30000;
  },

  /**
   * Clear all tokens from localStorage
   */
  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  /**
   * Check if user has valid tokens
   */
  hasValidToken(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired();
  },
};
