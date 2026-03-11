import java.net.http.HttpClient;
import java.time.Duration;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.keycloak.Config;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventListenerProviderFactory;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;

public class NplEngineEventListenerProviderFactory implements EventListenerProviderFactory {

    private HttpClient httpClient;
    private ObjectMapper objectMapper;
    private String nplUrl;
    private String clientId;
    private String clientSecret;
    private String tokenUrl;

    @Override
    public EventListenerProvider create(KeycloakSession session) {
        return new NplEngineEventListenerProvider(session, httpClient, objectMapper, 
                                                  nplUrl, clientId, clientSecret, tokenUrl);
    }

    @Override
    public void init(Config.Scope config) {
        // Read SSL verification setting (useful for development)
        boolean disableSslVerification = "true".equalsIgnoreCase(config.get("disable-ssl-verification", "false"));

        // Initialize HTTP client (reuse connection pool)
        HttpClient.Builder builder = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofSeconds(10));

        if (disableSslVerification) {
            try {
                builder.sslContext(createInsecureSSLContext());
            } catch (Exception e) {
                System.err.println("Failed to configure insecure SSL context: " + e.getMessage());
            }
        }

        this.httpClient = builder.build();

        // Initialize ObjectMapper
        this.objectMapper = new ObjectMapper();
        
        // Read configuration from SPI (Keycloak converts KC_SPI_EVENTS_LISTENER_NPL_ENGINE_LISTENER_* to kebab-case)
        this.nplUrl = config.get("npl-url", "https://engine:12000/api/participant/onboard");
        this.clientId = config.get("client-id", "npl-service-client");
        this.clientSecret = config.get("client-secret");
        this.tokenUrl = config.get("token-url", "http://keycloak:11000/realms/breakfast/protocol/openid-connect/token");
        
        // Log configuration for debugging (mask sensitive data)
        System.out.println("NPL Engine Listener initialized:");
        System.out.println("  NPL URL: " + this.nplUrl);
        System.out.println("  Client ID: " + this.clientId);
        System.out.println("  Client Secret: " + (this.clientSecret != null ? "***configured***" : "NOT SET"));
        System.out.println("  Token URL: " + this.tokenUrl);
        System.out.println("  SSL Verification Disabled: " + disableSslVerification);
    }

    /**
     * Creates an insecure SSL context that accepts all certificates.
     * WARNING: Only use this for development/testing. Never in production.
     */
    private SSLContext createInsecureSSLContext() throws Exception {
        TrustManager[] trustAllCerts = new TrustManager[]{
                new X509TrustManager() {
                    @Override
                    public X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }

                    @Override
                    public void checkClientTrusted(X509Certificate[] certs, String authType) {
                    }

                    @Override
                    public void checkServerTrusted(X509Certificate[] certs, String authType) {
                    }
                }
        };

        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(null, trustAllCerts, new java.security.SecureRandom());
        return sslContext;
    }

    @Override
    public void postInit(KeycloakSessionFactory factory) {}

    @Override
    public void close() {}

    @Override
    public String getId() {
        // This is the ID you will select in the Keycloak Admin Console
        return "npl-engine-listener";
    }
}
