/**
 * Participant Resource Definition
 * 
 * This file demonstrates the "Glue Layer" - connecting generated code
 * to the core type system.
 * 
 * It defines:
 * - Actions available for participants (updateName, registerForEvent)
 * - Resource configuration (hooks, schemas, display metadata)
 * - Table column definitions
 * 
 * This is consumed by SmartTable and other smart components.
 */

import type { ResourceDefinition, ActionDefinition } from '@npl/frontend';
import type {
  Participant,
  ParticipantCreate,
  ParticipantUpdateNameCommand,
  ParticipantRegisterForEventCommand,
  GetParticipantListParams,
} from '@gen/api/breakfast/breakfast.schemas';
import { Users } from 'lucide-react';
import { ParticipantsPage } from '@pages';

// Import generated React Query hooks
import {
  useGetParticipantList,
  useGetParticipantByID,
  useCreateParticipant,
  useParticipantUpdateName,
  useParticipantRegisterForEvent,
} from '@gen/api/breakfast/default/default';

// Import generated Zod schemas
import { schemas } from '@gen/zod/breakfast';

/**
 * Action: Update Name
 * 
 * Allows a participant to update their name.
 * Server determines visibility via @actions.updateName
 */
const updateNameAction: ActionDefinition<ParticipantUpdateNameCommand, void> = {
  name: 'updateName',
  label: 'Update Name',
  description: 'Update your name',
  variant: 'primary',
  icon: 'pencil',

  // Generated mutation hook from Orval
  mutationHook: useParticipantUpdateName,

  // Generated Zod schemas for runtime validation
  payloadSchema: schemas.Participant_UpdateName_Command,

  // Form configuration
  showPayloadForm: true,
  requiresConfirmation: false,
};

/**
 * Action: Register for Event
 * 
 * Allows a participant to register for a breakfast event.
 * Server determines visibility via @actions.registerForEvent
 */
const registerForEventAction: ActionDefinition<ParticipantRegisterForEventCommand, void> = {
  name: 'registerForEvent',
  label: 'Register for Event',
  description: 'Register for a breakfast event',
  variant: 'primary',
  icon: 'calendar',

  // Generated mutation hook from Orval
  mutationHook: useParticipantRegisterForEvent,

  // Generated Zod schemas for runtime validation
  payloadSchema: schemas.Participant_RegisterForEvent_Command,

  // Form configuration
  showPayloadForm: true,
  requiresConfirmation: false,
};

/**
 * Participant Resource Definition
 * 
 * This is the complete resource configuration consumed by SmartTable
 * and other components.
 */
export const ParticipantResource: ResourceDefinition<
  Participant,
  GetParticipantListParams,
  ParticipantCreate
> = {
  // Resource metadata
  name: 'participants',
  displayName: 'Participant',
  displayNamePlural: 'Participants',
  listViewSubtitle: 'Manage all participants',

  // Reference configuration
  referenceKey: 'Participant',
  formatLabel: (participant) => participant.name,

  // Generated React Query hooks
  listHook: useGetParticipantList,
  detailHook: useGetParticipantByID,
  createHook: useCreateParticipant,

  // Zod schema for create payload validation
  createSchema: schemas.Participant_Create,

  // Available actions
  // SmartTable will filter these based on entity['@actions']
  actions: [updateNameAction, registerForEventAction],

  // Table column configuration
  columns: [
    {
      key: 'id',
      label: 'ID',
      accessor: (row) => row['@id'],
      width: '280px',
    },
    'name'
  ],

  // Pagination configuration
  defaultPageSize: 25,

  // Navigation menu configuration
  menu: {
    icon: Users,
    order: 2,
    path: '/participants',
  },

  // Page component to render for this resource
  pageComponent: ParticipantsPage,
};
