/**
 * Document Resource Definition
 * 
 * This file demonstrates the "Glue Layer" - connecting generated code
 * to the core type system.
 * 
 * It defines:
 * - Actions available for documents (edit, approve)
 * - Resource configuration (hooks, schemas, display metadata)
 * - Table column definitions
 * 
 * This is consumed by SmartTable and other smart components.
 */

import type { ResourceDefinition, ActionDefinition } from '@npl/frontend';
import type {
  Document,
  DocumentEditCommand,
  DocumentCreate,
  GetDocumentListParams,
} from '@gen/api/document/document.schemas';
import { StateBadge, PartiesDisplay } from '@npl/frontend';
import { FileText } from 'lucide-react';
import { DocumentsPage } from '@pages';

// Import generated React Query hooks
import {
  useGetDocumentList,
  useGetDocumentByID,
  useCreateDocument,
  useDocumentEdit,
  useDocumentApprove,
} from '@gen/api/document/default/default';

// Import generated Zod schemas
import { schemas } from '@gen/zod/document';

/**
 * Action: Edit Document
 * 
 * Allows editing document content via the /edit endpoint.
 * Server determines visibility via @actions.edit
 */
const editAction: ActionDefinition<DocumentEditCommand, Document> = {
  name: 'edit',
  label: 'Edit Document',
  description: 'Modify the document content',
  variant: 'primary',
  icon: 'pencil',

  // Generated mutation hook from Orval
  mutationHook: useDocumentEdit,

  // Generated Zod schemas for runtime validation
  payloadSchema: schemas.Document_Edit_Command,
  returnSchema: schemas.Document,

  // Form configuration
  showPayloadForm: true,
  requiresConfirmation: false,
};

/**
 * Action: Approve Document
 * 
 * Approves a document (transitions state from drafted -> approved).
 * No payload required - simple POST endpoint.
 * Server determines visibility via @actions.approve
 */
const approveAction: ActionDefinition<void, Document> = {
  name: 'approve',
  label: 'Approve',
  description: 'Approve this document',
  variant: 'success',
  icon: 'check-circle',

  // Generated mutation hook from Orval
  mutationHook: useDocumentApprove,

  // Return schema for response validation
  returnSchema: schemas.Document,

  // No form needed - direct action
  showPayloadForm: false,
  requiresConfirmation: true,
  confirmationMessage: 'Are you sure you want to approve this document?',
};

/**
 * Document Resource Definition
 * 
 * This is the complete resource configuration consumed by SmartTable
 * and other components in Phase 4.
 */
export const DocumentResource: ResourceDefinition<
  Document,
  GetDocumentListParams,
  DocumentCreate
> = {
  // Resource metadata
  name: 'documents',
  displayName: 'Document',
  displayNamePlural: 'Documents',
  listViewSubtitle: 'Manage all your documents in one place',

  // Reference configuration
  referenceKey: 'Document',
  formatLabel: (doc) => doc.content.substring(0, 50) + (doc.content.length > 50 ? '...' : ''),

  // Generated React Query hooks
  listHook: useGetDocumentList,
  detailHook: useGetDocumentByID,
  createHook: useCreateDocument,

  // Zod schema for create payload validation
  createSchema: schemas.Document_Create,

  // Available actions
  // SmartTable will filter these based on entity['@actions']
  actions: [editAction, approveAction],

  // Table column configuration
  // Note: Render functions will be implemented in Phase 4 with actual components
  columns: [
    {
      key: 'id',
      label: 'ID',
      accessor: (row) => row['@id'],
      width: '280px',
    },
    {
      key: 'content',
      label: 'Content',
      accessor: (row) => row.content,
      // No width - will expand to fill available space
    },
    {
      key: 'state',
      label: 'State',
      accessor: (row) => row['@state'],
      render: (value) => <StateBadge state={value as string} />,
      width: '120px',
      align: 'center',
    },
    {
      key: 'editor',
      label: 'Editor',
      accessor: (row) => row['@parties']?.editor,
      render: (value) => (
        <PartiesDisplay 
          parties={value ? { editor: value } : null} 
          mode="compact" 
        />
      ),
      width: '150px',
    },
    {
      key: 'approver',
      label: 'Approver',
      accessor: (row) => row['@parties']?.approver,
      render: (value) => (
        <PartiesDisplay 
          parties={value ? { approver: value } : null} 
          mode="compact" 
        />
      ),
      width: '150px',
    },
  ],

  // Pagination configuration
  defaultPageSize: 25,

  // Navigation menu configuration
  menu: {
    icon: FileText,
    order: 1,
    path: '/documents',
  },

  // Page component to render for this resource
  pageComponent: DocumentsPage,
};

/**
 * How it works:
 * 
 * 1. API returns document:
 *    {
 *      "@id": "uuid-123",
 *      "content": "Draft content",
 *      "@state": "drafted",
 *      "@actions": {
 *        "edit": "http://localhost:12000/.../edit",
 *        "approve": "http://localhost:12000/.../approve"
 *      }
 *    }
 * 
 * 2. SmartTable uses DocumentResource.listHook() to fetch data
 * 
 * 3. For each row, SmartTable calls:
 *    getAvailableActions(row, DocumentResource.actions)
 *    Returns: [editAction, approveAction]
 * 
 * 4. Renders table with two action buttons per row
 * 
 * 5. When user clicks "Edit":
 *    - ActionModal opens
 *    - Renders form with field for 'newContent' (from Document_Edit_Command schema)
 *    - On submit, calls editAction.mutationHook.mutate({ id, newContent })
 * 
 * 6. Server-side permission control:
 *    - If user lacks edit permission, @actions.edit won't exist
 *    - Edit button automatically hidden
 *    - Zero client-side permission code!
 */
