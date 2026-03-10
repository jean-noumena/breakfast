/**
 * Participant Resource Definition
 * 
 * Auto-generated from OpenAPI spec: breakfast
 * Generated on: 2026-03-10T12:35:46.531Z
 * 
 * This file is generated. To customize, copy to participants.tsx
 * and modify as needed.
 */

import type { ResourceDefinition, ActionDefinition } from '@npl/frontend';
import type {
  Participant,
  ParticipantCreate,
  GetParticipantListParams,
} from '@gen/api/breakfast';
import {
  useGetParticipantList,
  useGetParticipantByID,
  useCreateParticipant,
  useParticipantParticipantEmailCallback,
  useParticipantUpdateName,
  useParticipantRegisterForEvent,
  useParticipantUpdateParticipantEmail,
} from '@gen/api/breakfast';
import { schemas } from '@gen/zod/breakfast';
// TODO: Optionally import icon from lucide-react
// import { FileText } from 'lucide-react';

// Action definitions
const participantEmailCallbackAction: ActionDefinition = {
  name: 'participantEmailCallback',
  label: 'Participant Email Callback',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useParticipantParticipantEmailCallback,
  payloadSchema: schemas.Participant_ParticipantEmailCallback_Command,
  showPayloadForm: true,
  requiresConfirmation: false,
};

const updateNameAction: ActionDefinition = {
  name: 'updateName',
  label: 'Update Name',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useParticipantUpdateName,
  payloadSchema: schemas.Participant_UpdateName_Command,
  showPayloadForm: true,
  requiresConfirmation: false,
};

const registerForEventAction: ActionDefinition = {
  name: 'registerForEvent',
  label: 'Register For Event',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useParticipantRegisterForEvent,
  payloadSchema: schemas.Participant_RegisterForEvent_Command,
  showPayloadForm: true,
  requiresConfirmation: false,
};

const updateParticipantEmailAction: ActionDefinition = {
  name: 'updateParticipantEmail',
  label: 'Update Participant Email',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useParticipantUpdateParticipantEmail,
  payloadSchema: schemas.Participant_UpdateParticipantEmail_Command,
  showPayloadForm: true,
  requiresConfirmation: false,
};


// Resource definition
export const ParticipantResource: ResourceDefinition<Participant, GetParticipantListParams, ParticipantCreate> = {
  name: 'participants',
  displayName: 'Participant',
  displayNamePlural: 'Participants',
  
  // Reference configuration
  referenceKey: 'Participant',
  formatLabel: (entity) => entity.name || entity['@id'],
  
  // Hooks
  listHook: useGetParticipantList,
  detailHook: useGetParticipantByID,
  createHook: useCreateParticipant,
  createSchema: schemas.Participant_Create,
  
  // Actions
  actions: [participantEmailCallbackAction, updateNameAction, registerForEventAction, updateParticipantEmailAction],
  showActionsInListView: true,
  
  // Table columns
  columns: [
    {
      key: '@id',
      label: 'Id',
      accessor: (row) => row['@id'],
    },
    {
      key: '@parties',
      label: 'Parties',
      accessor: (row) => row['@parties'],
      // render: (value) => <PartiesDisplay parties={value} />,
    },
    {
      key: '@actions',
      label: 'Actions',
      accessor: (row) => row['@actions'],
    },
    {
      key: 'name',
      label: 'Name',
      accessor: (row) => row['name'],
    },
  ],
  
  // Pagination
  defaultPageSize: 25,
  
  // Menu
  menu: {
    // icon: FileText, // TODO: Import and add icon from lucide-react if desired
    order: 100, // TODO: Set appropriate order
    path: '/participants',
  },
};
