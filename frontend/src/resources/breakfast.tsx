/**
 * Breakfast Resource Definition
 * 
 * This file demonstrates the "Glue Layer" - connecting generated code
 * to the core type system.
 * 
 * It defines:
 * - Actions available for breakfasts (edit, approve)
 * - Resource configuration (hooks, schemas, display metadata)
 * - Table column definitions
 * 
 * This is consumed by SmartTable and other smart components.
 */

import type { ResourceDefinition, ActionDefinition } from '@npl/frontend';
import type {
  BreakfastEvent,
  BreakfastEventCreate,
  BreakfastEventRegisterCommand,
  GetBreakfastEventListParams,
} from '@gen/api/breakfast/breakfast.schemas';
import { StateBadge, PartiesDisplay } from '@npl/frontend';
import { FileText } from 'lucide-react';
import { BreakfastsPage } from '@pages';

// Import generated React Query hooks
import {
  useGetBreakfastEventList,
  useGetBreakfastEventByID,
  useCreateBreakfastEvent,
  useBreakfastEventRegister,
  useBreakfastEventGetRegistrations,
} from '@gen/api/breakfast/default/default';

// Import generated Zod schemas
import { schemas } from '@gen/zod/breakfast';

/**
 * Action: Register Breakfast
 * 
 * Allows registering for a breakfast event via the /register endpoint.
 * Server determines visibility via @actions.register
 */
const registerAction: ActionDefinition<BreakfastEventRegisterCommand, BreakfastEvent> = {
  name: 'register',
  label: 'Register Breakfast',
  description: 'Register for this breakfast event',
  variant: 'primary',
  icon: 'pencil',

  // Generated mutation hook from Orval
  mutationHook: useBreakfastEventRegister,

  // Generated Zod schemas for runtime validation
  payloadSchema: schemas.BreakfastEvent_Register_Command,
  returnSchema: schemas.BreakfastEvent,

  // Form configuration
  showPayloadForm: true,
  requiresConfirmation: false,
};

/**
 * Action: Get Registrations
 * 
 * Retrieves the list of registrations for a breakfast event.
 * No payload required - simple GET endpoint.
 * Server determines visibility via @actions.getRegistrations
 */
const getRegistrationsAction: ActionDefinition<void, BreakfastEvent> = {
  name: 'getRegistrations',
  label: 'Get Registrations',
  description: 'Get registrations for this breakfast',
  variant: 'secondary',
  icon: 'users',

  // Generated mutation hook from Orval
  mutationHook: useBreakfastEventGetRegistrations,

  // Return schema for response validation
  returnSchema: schemas.Registration.array(),

  // No form needed - direct action
  showPayloadForm: false,
  requiresConfirmation: true,
  confirmationMessage: 'Are you sure you want to get registrations for this breakfast?',
};

/**
 * Breakfast Resource Definition
 * 
 * This is the complete resource configuration consumed by SmartTable
 * and other components in Phase 4.
 */
export const BreakfastResource: ResourceDefinition<
  BreakfastEvent,
  GetBreakfastEventListParams,
  BreakfastEventCreate
> = {
  // Resource metadata
  name: 'breakfasts',
  displayName: 'Breakfast Event',
  displayNamePlural: 'Breakfast Events',
  listViewSubtitle: 'Manage all your breakfast events in one place',

  // Reference configuration
  referenceKey: 'BreakfastEvent',
  formatLabel: (doc) => doc.eventDate.substring(0, 50) + (doc.content.length > 50 ? '...' : ''),

  // Generated React Query hooks
  listHook: useGetBreakfastEventList,
  detailHook: useGetBreakfastEventByID,
  createHook: useCreateBreakfastEvent,

  // Zod schema for create payload validation
  createSchema: schemas.BreakfastEvent_Create,

  // Available actions
  // SmartTable will filter these based on entity['@actions']
  actions: [registerAction, getRegistrationsAction],

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
    path: '/breakfasts',
  },

  // Page component to render for this resource
  pageComponent: BreakfastsPage,
};

/**
 * How it works:
 * 
 * 1. API returns breakfast:
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
 * 2. SmartTable uses BreakfastResource.listHook() to fetch data
 * 
 * 3. For each row, SmartTable calls:
 *    getAvailableActions(row, BreakfastResource.actions)
 *    Returns: [editAction, approveAction]
 * 
 * 4. Renders table with two action buttons per row
 * 
 * 5. When user clicks "Edit":
 *    - ActionModal opens
 *    - Renders form with field for 'newContent' (from Breakfast_Edit_Command schema)
 *    - On submit, calls editAction.mutationHook.mutate({ id, newContent })
 * 
 * 6. Server-side permission control:
 *    - If user lacks edit permission, @actions.edit won't exist
 *    - Edit button automatically hidden
 *    - Zero client-side permission code!
 */
