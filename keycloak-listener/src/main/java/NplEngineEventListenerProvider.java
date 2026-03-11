import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Arrays;
import java.util.Map;
import java.util.Set;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.events.admin.OperationType;
import org.keycloak.events.admin.ResourceType;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

public class NplEngineEventListenerProvider implements EventListenerProvider {

    private final KeycloakSession session;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String nplUrl;
    private final String clientId;
    private final String clientSecret;
    private final String tokenUrl;

    public NplEngineEventListenerProvider(KeycloakSession session, HttpClient httpClient,
                                          ObjectMapper objectMapper, String nplUrl,
                                          String clientId, String clientSecret, String tokenUrl) {
        this.session = session;
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
        this.nplUrl = nplUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.tokenUrl = tokenUrl;
    }

    @Override
    public void onEvent(Event event) {
        // Only listen for user registration events
        if (EventType.REGISTER.equals(event.getType())) {
            String userId = event.getUserId();
            System.out.println("UserEvent detected: Register - " + userId);
            RealmModel realm = session.getContext().getRealm();
            UserModel user = session.users().getUserById(realm, userId);

            if (user != null) {
                // Extract necessary details (email, username, custom attributes)
                String email = user.getEmail();
                String username = user.getUsername();

                notifyNplEngine(userId, username, email);
            }
        }
    }

    @Override
    public void onEvent(AdminEvent adminEvent, boolean includeRepresentation) {
        // 1. Check if the event is a USER creation
        if (ResourceType.USER.equals(adminEvent.getResourceType()) &&
                OperationType.CREATE.equals(adminEvent.getOperationType())) {

            System.out.println("AdminEvent detected: USER creation - " + adminEvent.getResourcePath());

            // Resource path is usually "users/{user-id}"
            String resourcePath = adminEvent.getResourcePath();
            String userId = resourcePath.startsWith("users/") ? resourcePath.substring(6) : resourcePath;

            RealmModel realm = session.getContext().getRealm();
            UserModel user = session.users().getUserById(realm, userId);

            if (user != null) {
                notifyNplEngine(user.getId(), user.getUsername(), user.getEmail());
            }
        }
    }

    private void notifyNplEngine(String userId, String username, String email) {
        try {
            // 1. Get Bearer Token via Client Credentials
            String accessToken = getServiceAccountToken();

            // 2. Prepare NPL Payload
            Map<String, Set<String>> participantClaims = Map.of(
                    "email", Set.of(email),
                    "preferred_username", Set.of(username)
            );
            Map<String, Map<String, Map<String, Set<String>>>> parties = Map.of(
                    "participant",
                    Map.of(
                            "claims",
                            participantClaims
                    )
            );
            String jsonPayload = objectMapper.writeValueAsString(
                    Map.of(
                            "name", username,
                            "@parties", parties
                    )
            );

            String participantCreateUrl = nplUrl + "/npl/breakfast/Participant/";
            System.out.println("Sending request to NPL Engine: " + participantCreateUrl);

            // 3. Make the API Call to NPL Engine
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(participantCreateUrl))
                    .timeout(Duration.ofSeconds(10))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            // Fire and forget, or handle response synchronously
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 300) {
                System.err.println("Failed to notify NPL Engine (HTTP " + response.statusCode() + "): " + response.body());
            } else {
                System.out.println("Successfully notified NPL Engine for user: " + userId);
            }

        } catch (java.net.http.HttpTimeoutException e) {
            System.err.println("Timeout communicating with NPL Engine: " + e.getMessage());
            System.err.println("Check if NPL Engine is running and accessible at: " + nplUrl);
        } catch (java.net.ConnectException e) {
            System.err.println("Failed to connect to NPL Engine: " + e.getMessage());
            System.err.println("URL: " + nplUrl);
            System.err.println("Verify the URL is correct and the server is running");
        } catch (javax.net.ssl.SSLHandshakeException e) {
            System.err.println("SSL certificate validation failed: " + e.getMessage());
            System.err.println("URL: " + nplUrl);
            System.err.println("Consider enabling disable-ssl-verification for development (NOT recommended for production)");
        } catch (javax.net.ssl.SSLException e) {
            System.err.println("SSL/TLS error: " + e.getMessage());
            System.err.println("This typically means: plaintext HTTP on HTTPS URL, or SSL certificate issues");
            System.err.println("URL: " + nplUrl);
            System.err.println("Verify the protocol (http vs https) matches your server configuration");
        } catch (Exception e) {
            // Log properly using JBoss Logging in production
            System.err.println("Error communicating with NPL Engine: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            System.err.println(Arrays.toString(e.getStackTrace()));
        }
    }

    private String getServiceAccountToken() throws Exception {
        // Standard OAuth2 Client Credentials Grant
        String formData = "grant_type=client_credentials" +
                "&client_id=" + clientId +
                "&client_secret=" + clientSecret;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(tokenUrl))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(formData))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        // Parse the JWT token from the JSON response
        JsonNode jsonResponse = objectMapper.readTree(response.body());
        return jsonResponse.get("access_token").asText();
    }

    @Override
    public void close() {
        // Since we injected the HttpClient from the Factory to reuse connection pools, 
        // we DO NOT close the HttpClient here. 
        // We only clear out per-transaction resources if we had any.
    }
}
