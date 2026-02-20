# OIDC Authentication

This application uses OIDC (OpenID Connect) standard authorization code flow for authentication.

## Configuration

Set the following environment variables in your `.env` file:

```env
VITE_OIDC_AUTHORITY=https://keycloak-your-tenant-your-app.noumena.cloud/realms/your-app/protocol/openid-connect
VITE_OIDC_CLIENT_ID=your-client-id
VITE_OIDC_REDIRECT_URI=http://localhost:5173
VITE_OIDC_POST_LOGOUT_REDIRECT_URI=http://localhost:5173
```

## Architecture

### Components

- **OidcAuthProvider** (`@npl/frontend`): React context provider that manages OIDC authentication state using `react-oidc-context`
- **OidcAuthGuard** (`@npl/frontend`): Route guard that protects authenticated routes and handles redirect flows
- **UserMenu** (`src/components/UserMenu.tsx`): Displays user info and logout button

### Authentication Flow

The authentication uses OIDC Authorization Code Flow with PKCE:
- Redirect-based authentication (no password handling in the app)
- Automatic token refresh using refresh tokens
- Secure token storage managed by `oidc-client-ts`

### API Integration

The API client (`src/lib/api-client.ts`) automatically:
- Injects Bearer tokens from OIDC into all API requests
- Handles 401 responses by redirecting to login
- Uses access tokens from the OIDC user session

## Usage

### Login Flow

1. User navigates to the app or protected route
2. `OidcAuthGuard` detects unauthenticated user
3. User is redirected to OIDC provider (Keycloak) login page
4. User authenticates with the OIDC provider
5. OIDC provider redirects back to app with authorization code
6. App exchanges code for tokens
7. User is redirected to originally requested route

### Token Management

- Tokens are automatically refreshed before expiration using refresh tokens
- Token refresh is handled by `oidc-client-ts` library
- If an API call returns 401, user is redirected to login
- Silent token renewal happens in the background

### Logout

Users can logout by:
- Clicking the logout button in UserMenu component
- User is redirected to OIDC provider for logout
- After logout, user is redirected back to the app
- All tokens and session data are cleared

## Security Considerations

- Uses OIDC Authorization Code Flow with PKCE (industry standard)
- No passwords are handled directly by the application
- Tokens are managed securely by `oidc-client-ts`
- HTTPS should be used in production
- Automatic token refresh prevents expired token issues
