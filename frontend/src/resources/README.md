# Resource Definitions

This directory contains resource definitions that connect generated code to the core type system.

## 📋 Overview

Each resource file (e.g., `documents.tsx`, `users.tsx`) defines:

1. **Actions** - Operations available on the resource (edit, approve, delete, etc.)
2. **Resource Configuration** - Hooks, schemas, and metadata
3. **Table Columns** - How to display data in SmartTable
4. **Validation** - Zod schemas for forms and responses
5. **Navigation** - Menu icon, order, and routing path (optional)
6. **Page Component** - Component to render when navigating to the resource (optional)

## 🎯 Current Resources

### DocumentResource ([documents.tsx](documents.tsx))

Manages document entities with:
- **Actions**: Edit, Approve
- **Hooks**: `useGetDocumentList`, `useGetDocumentByID`, `useCreateDocument`
- **Schemas**: `Document_Create`, `Document_Edit_Command`
- **Columns**: ID, Content, State, Editor, Approver
- **Navigation**: FileText icon, order 1, path `/documents`
- **Page**: DocumentsPage component

## 📝 How to Create a New Resource

### Step 1: Ensure OpenAPI Spec Exists

Your endpoint should be defined in `document-openapi.yml`:

```yaml
/api/widgets:
  get:
    operationId: listWidgets
    # ...
  post:
    operationId: createWidget
    # ...

/api/widgets/{id}:
  get:
    operationId: getWidget
    # ...
  post:
    operationId: activateWidget
    # ...
```

### Step 2: Generate Code

```bash
# First time: Discover specs (if new file)
npm run discover

# Generate from discovered specs
npm run generate:dynamic
```

This creates:
- React Query hooks → `src/gen/api/`
- Zod schemas → `src/gen/zod/schemas.ts`

### Step 3: Create Resource File

Create `src/resources/widgets.tsx`:

```typescript
import type { ResourceDefinition, ActionDefinition } from '@core';
import type { Widget, WidgetCreate, GetWidgetListParams } from '@gen/api/...';
import { useGetWidgetList, useGetWidget, useActivateWidget } from '@gen/api/...';
import { schemas } from '@gen/zod/schemas';
import { Cog } from 'lucide-react';  // Import icon
import { WidgetsPage } from '@pages';  // Import page component

// Define actions
const activateAction: ActionDefinition<void, Widget> = {
  name: 'activate',
  label: 'Activate',
  variant: 'success',
  mutationHook: useActivateWidget,
  returnSchema: schemas.Widget,
  showPayloadForm: false,
  requiresConfirmation: true,
  confirmationMessage: 'Activate this widget?',
};

// Define resource
export const WidgetResource: ResourceDefinition<Widget, GetWidgetListParams, WidgetCreate> = {
  name: 'widgets',
  displayName: 'Widget',
  displayNamePlural: 'Widgets',
  listHook: useGetWidgetList,
  detailHook: useGetWidget,
  actions: [activateAction],
  columns: [
    {
      key: 'id',
      label: 'ID',
      accessor: (row) => row['@id'],
    },
    {
      key: 'name',
      label: 'Name',
      accessor: (row) => row.name,
    },
  ],
  defaultPageSize: 25,
  
  // Navigation configuration (optional)
  menu: {
    icon: Cog,           // Lucide icon component
    order: 2,            // Menu order (lower = higher in menu)
    path: '/widgets',    // Route path
  },
  pageComponent: WidgetsPage,  // Component to render
};
```

### Step 4: Export from Index

Add to `src/resources/index.ts`:

```typescript
export { WidgetResource } from './widgets';

// Update ALL_RESOURCES array
import { DocumentResource } from './documents';
import { WidgetResource } from './widgets';

export const ALL_RESOURCES = [
  DocumentResource,
  WidgetResource,  // ← Automatically appears in menu!
] as const;
```

### Step 5: Create Page Component

Create `src/pages/WidgetsPage.tsx`:

```typescript
import { Routes, Route, useParams } from 'react-router-dom';
import { SmartListView, SmartDetailView } from '@components';
import { WidgetResource } from '@resources';

export function WidgetsPage() {
  return (
    <Routes>
      <Route index element={
        <SmartListView resource={WidgetResource} />
      } />
      <Route path=":id" element={
        <WidgetDetailView />
      } />
    </Routes>
  );
}

function WidgetDetailView() {
  const params = useParams<{ id: string }>();
  return (
    <SmartDetailView
      resource={WidgetResource}
      entityId={params.id!}
    />
  );
}
```

That's it! The widget resource will now:
- ✅ Appear in the sidebar menu (with Cog icon)
- ✅ Have routes at `/widgets` and `/widgets/:id`
- ✅ Show up on the home page with a card
- ✅ Render with SmartListView and SmartDetailView
- ✅ Support all defined actions automatically

## 🎨 Action Patterns

### Simple Action (No Payload)

```typescript
const deleteAction: ActionDefinition<void, void> = {
  name: 'delete',
  label: 'Delete',
  variant: 'danger',
  mutationHook: useDeleteWidget,
  showPayloadForm: false,
  requiresConfirmation: true,
  confirmationMessage: 'Are you sure? This cannot be undone.',
};
```

### Complex Action (With Form)

```typescript
const updateAction: ActionDefinition<WidgetUpdateCommand, Widget> = {
  name: 'update',
  label: 'Update Widget',
  variant: 'primary',
  mutationHook: useUpdateWidget,
  payloadSchema: schemas.Widget_Update_Command,
  returnSchema: schemas.Widget,
  showPayloadForm: true,
  requiresConfirmation: false,
};
```

### Custom Confirmation Message

```typescript
const archiveAction: ActionDefinition<{ reason: string }, Widget> = {
  name: 'archive',
  label: 'Archive',
  variant: 'warning',
  mutationHook: useArchiveWidget,
  payloadSchema: schemas.Archive_Command,
  confirmationMessage: (data) => 
    `Archive this widget? Reason: ${data.reason}`,
  requiresConfirmation: true,
};
```

## 📊 Column Patterns

### Basic Column

```typescript
{
  key: 'name',
  label: 'Name',
  accessor: (row) => row.name,
}
```

### Custom Render

```typescript
{
  key: 'status',
  label: 'Status',
  accessor: (row) => row.status,
  render: (value) => (
    <span className={`badge badge-${value}`}>
      {value}
    </span>
  ),
}
```

### Nested Data Access

```typescript
{
  key: 'owner',
  label: 'Owner',
  accessor: (row) => row['@parties']?.owner?.claims?.email?.[0] || 'Unknown',
}
```

### Formatted Values

```typescript
{
  key: 'createdAt',
  label: 'Created',
  accessor: (row) => row.createdAt,
  render: (value) => new Date(value as string).toLocaleDateString(),
}
```

## 🔑 Server-Driven Permissions

The magic of this architecture is **zero client-side permission logic**.

### How It Works

1. **API returns entity with @actions**:
   ```json
   {
     "@id": "uuid-123",
     "@actions": {
       "edit": "http://...",
       "approve": "http://..."
     }
   }
   ```

2. **Resource defines all possible actions**:
   ```typescript
   actions: [editAction, approveAction, deleteAction]
   ```

3. **SmartTable filters automatically**:
   ```typescript
   const availableActions = getAvailableActions(row, resource.actions);
   // Only shows edit and approve buttons (not delete)
   ```

4. **If user permissions change**, server adjusts `@actions` field:
   ```json
   {
     "@id": "uuid-123",
     "@actions": {
       "approve": "http://..."
     }
   }
   ```
   Edit button disappears automatically!

## ✅ Best Practices

1. **One action per server endpoint** - Don't combine multiple endpoints into one action
2. **Match action names to @actions keys** - Use exact same strings
3. **Always use generated schemas** - Never write Zod schemas manually
4. **Keep columns simple** - Complex logic belongs in utility functions
5. **Descriptive action labels** - "Edit Document" not just "Edit"
6. **Choose appropriate variants** - Helps users understand action severity

## 🎯 Next Steps

Once resources are defined:
1. Build SmartTable component (Phase 4)
2. Build ActionModal component (Phase 4)
3. Create page components that use them (Phase 5)

---

**Phase 3 Status**: ✅ Complete
