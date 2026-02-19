# frontend

A composable frontend application built with [@npl/frontend](https://github.com/your-org/npl-frontend) - a resource-driven React platform that dynamically generates UI components from OpenAPI specifications.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

Update the following environment variables:
- `VITE_API_BASE_URL`: Your API server URL
- `VITE_OIDC_AUTHORITY`: Your OIDC provider URL
- `VITE_OIDC_CLIENT_ID`: Your OIDC client ID
- `VITE_OIDC_REDIRECT_URI`: Redirect URI after login (usually http://localhost:5173)
- `VITE_OIDC_POST_LOGOUT_REDIRECT_URI`: Redirect URI after logout

### 3. Generate API Client from OpenAPI Specs

The project uses OpenAPI specifications to generate type-safe API clients:

```bash
npm run generate:dynamic
```

This command:
1. Discovers all `*-openapi.yml` files in `openapi-specs/`
2. Generates React Query hooks and TypeScript types
3. Creates Zod schemas for runtime validation
4. Enhances reference types with protocol-aware types

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
.
├── src/
│   ├── resources/          # Resource definitions (connect OpenAPI to UI)
│   │   ├── documents.tsx   # Document resource
│   │   ├── cars.tsx        # Car resource (example)
│   │   ├── ious.tsx        # IOU resource (example)
│   │   └── index.ts        # Resource registry
│   ├── pages/              # Page components for each resource
│   ├── gen/                # Generated code (DO NOT EDIT)
│   │   ├── api/            # React Query hooks
│   │   └── zod/            # Zod schemas
│   ├── App.tsx             # Main app component with routing
│   └── main.tsx            # App entry point
├── openapi-specs/          # OpenAPI specification files
│   ├── document-openapi.yml
│   ├── objects.car-openapi.yml
│   └── ...
└── package.json
```

## Adding New Resources

### 1. Add OpenAPI Spec

Create a new OpenAPI specification file in `openapi-specs/`:

```yaml
# openapi-specs/widget-openapi.yml
openapi: 3.0.0
info:
  title: Widget API
  version: 1.0.0
paths:
  /widgets:
    get:
      # ... your API definition
components:
  schemas:
    Widget:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
```

### 2. Regenerate API Client

```bash
npm run generate:dynamic
```

### 3. Create Resource Definition

Create `src/resources/widgets.tsx`:

```tsx
import { ResourceDefinition } from '@npl/frontend';
import { PackageIcon } from 'lucide-react';
import { WidgetsPage } from '@pages';
import { useGetWidgets, useCreateWidget, useUpdateWidget, useDeleteWidget } from '@gen/api/widget/default';
import { widgetSchema } from '@gen/zod';

export const widgetsResource: ResourceDefinition = {
  name: 'widget',
  displayName: 'Widget',
  displayNamePlural: 'Widgets',
  
  menu: {
    path: '/widgets',
    icon: PackageIcon,
    order: 4,
  },
  
  pageComponent: WidgetsPage,
  
  schema: widgetSchema,
  
  api: {
    list: useGetWidgets,
    create: useCreateWidget,
    update: useUpdateWidget,
    delete: useDeleteWidget,
  },
  
  listColumns: ['name', 'description', 'createdAt'],
};
```

### 4. Register Resource

Add to `src/resources/index.ts`:

```tsx
export { widgetsResource } from './widgets';

export const ALL_RESOURCES = [
  documentsResource,
  carsResource,
  iousResource,
  widgetsResource, // Add your new resource
];
```

The new resource will automatically appear in the navigation menu and be fully functional!

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate:dynamic` - Generate API client from OpenAPI specs
- `npm run discover` - Discover OpenAPI specs (runs automatically in generate:dynamic)
- `npm run lint` - Run ESLint

## Learn More

- [NPL Frontend Documentation](https://github.com/your-org/npl-frontend)
- [OpenAPI Specification](https://swagger.io/specification/)
- [React Query](https://tanstack.com/query/latest)
- [Zod](https://zod.dev/)

## License

[Your License]
