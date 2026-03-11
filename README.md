# Breakfast show

Register the breakfast you want to bring for the team

## Install

### Frontend

npm install /path/to/npl-frontend-0.1.0.tgz --force

or, when it will be published

npm install @npl/frontend

### Keycloak SPI

The app uses keycloak SPI events to trigger the creation of the participant protocol once for each account.

In the keycloak admin panel, in the realm settings, in the events tab, add the npl event listener to the list of listeners.

## Development

npl openapi --rules api/src/main/rules/rules.yml
cd frontend
npm run discover
npm run generate
npm run dev
