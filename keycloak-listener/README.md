# Keycloak Event Listener for NPL Engine

This module provides a custom Keycloak event listener that notifies the NPL Engine when users are registered or created.

## Building

Build the JAR file using Maven:

```bash
cd keycloak-listener
mvn clean package
```

This will create `npl-event-listener.jar` in the project's `target/` directory (one level up from this folder).

## Configuration

The event listener is configured via environment variables in `docker-compose.yml`. There is **no keycloak.conf file** - all configuration is done through environment variables, which is the recommended approach for containerized deployments.

Keycloak automatically translates `KC_SPI_EVENTS_LISTENER_NPL_ENGINE_LISTENER_*` environment variables into configuration properties for the `npl-engine-listener` SPI:

```yaml
KC_SPI_EVENTS_LISTENER_NPL_ENGINE_LISTENER_NPL_URL: https://engine:12000/api/participant/onboard
KC_SPI_EVENTS_LISTENER_NPL_ENGINE_LISTENER_CLIENT_ID: npl-service-client
KC_SPI_EVENTS_LISTENER_NPL_ENGINE_LISTENER_CLIENT_SECRET: your-copied-client-secret
KC_SPI_EVENTS_LISTENER_NPL_ENGINE_LISTENER_TOKEN_URL: http://keycloak:11000/realms/breakfast/protocol/openid-connect/token
```

## Project Structure

```
keycloak-listener/
├── pom.xml                                           # Maven configuration
├── src/
│   └── main/
│       ├── java/
│       │   ├── NplEngineEventListenerProvider.java  # Event listener implementation
│       │   └── NplEngineEventListenerProviderFactory.java  # SPI factory
│       └── resources/
│           └── META-INF/
│               └── services/
│                   └── org.keycloak.events.EventListenerProviderFactory  # SPI registration
```

## Deployment

The JAR is automatically mounted into Keycloak via docker-compose:

```yaml
volumes:
  - ./target/npl-event-listener.jar:/opt/keycloak/providers/npl-event-listener.jar
```

After building, restart Keycloak:

```bash
docker compose restart keycloak
```

## Features

- Listens for user REGISTER events
- Listens for admin-initiated user CREATE operations
- Obtains service account tokens via OAuth2 client credentials
- Sends user data to NPL Engine API
- Configurable via Keycloak SPI properties
