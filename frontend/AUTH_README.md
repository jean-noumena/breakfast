# Password-Based Authentication

This application uses password-based authentication via the OIDC token endpoint.

## Configuration

Set the following environment variables in your `.env` file:

```env
VITE_OIDC_AUTHORITY=http://localhost:11000
VITE_OIDC_CLIENT_ID=your-client-id
```

## Architecture

### Components

- **PasswordAuthProvider** (`src/auth/PasswordAuthContext.tsx`): React context provider that manages authentication state
- **PasswordAuthGuard** (`src/auth/PasswordAuthGuard.tsx`): Route guard that protects authenticated routes
- **LoginPage** (`src/pages/LoginPage.tsx`): Login form for username/password authentication
- **UserMenu** (`src/components/UserMenu.tsx`): Logout button component

### Services

- **authService** (`src/auth/auth-service.ts`): Handles communication with the token endpoint
  - `login(username, password)`: Authenticate user and get tokens
  - `refreshToken()`: Refresh expired access token
  - `logout()`: Clear tokens
  - `isAuthenticated()`: Check if user is logged in
  - `getAccessToken()`: Get current access token

- **tokenStorage** (`src/auth/token-storage.ts`): Manages token persistence in localStorage
  - Stores access token, refresh token, and expiry time
  - Handles token expiration checks

### API Integration

The API client (`src/lib/api-client.ts`) automatically:
- Injects Bearer tokens into all API requests
- Handles 401 responses by attempting to refresh the token
- Logs out the user if token refresh fails

## Usage

### Login Flow

1. User enters username and password on LoginPage
2. App sends credentials to `${VITE_OIDC_AUTHORITY}/token` using Resource Owner Password Credentials grant
3. Access token and refresh token are stored in localStorage
4. User is redirected to the main application

### Token Refresh

- Tokens are automatically refreshed when they expire (30 seconds before actual expiry)
- If an API call returns 401, the interceptor attempts to refresh the token
- If refresh fails, user is logged out and redirected to login

### Logout

Users can logout by:
- Clicking the logout button in UserMenu component
- Tokens are cleared from localStorage
- User is redirected to login page

## Security Considerations

- Tokens are stored in localStorage (consider using httpOnly cookies for production)
- HTTPS should be used in production
- Token expiry is checked before each request
- Failed refresh attempts automatically log out the user
