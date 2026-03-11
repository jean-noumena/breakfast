/**
 * BreakfastEvent Resource Definition
 * 
 * Auto-generated from OpenAPI spec: breakfast
 * Generated on: 2026-03-10T15:59:58.049Z
 * 
 * This file is generated. To customize, copy to breakfastEvents.tsx
 * and modify as needed.
 */

import type { ResourceDefinition, ActionDefinition } from '@npl/frontend';
import type {
  BreakfastEvent,
  BreakfastEventCreate,
  GetBreakfastEventListParams,
} from '@gen/api/breakfast';
import {
  useGetBreakfastEventList,
  useGetBreakfastEventByID,
  useCreateBreakfastEvent,
  useBreakfastEventOrganizerCreationEmailCallback,
  useBreakfastEventUpdateEventDetails,
  useBreakfastEventRegister,
  useBreakfastEventParticipantEmailCallback,
  useBreakfastEventOrganizerEmailCallback,
  useBreakfastEventUnregister,
  useBreakfastEventComplete,
  useBreakfastEventCancel,
  useBreakfastEventGetRegistrations,
  useBreakfastEventUpdateOrganizerEmail,
  useBreakfastEventHideEvent,
  useBreakfastEventInviteParticipants,
} from '@gen/api/breakfast';
import { schemas } from '@gen/zod/breakfast';
// TODO: Optionally import icon from lucide-react
// import { FileText } from 'lucide-react';

// Action definitions
const organizerCreationEmailCallbackAction: ActionDefinition = {
  name: 'organizerCreationEmailCallback',
  label: 'Organizer Creation Email Callback',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useBreakfastEventOrganizerCreationEmailCallback,
  payloadSchema: schemas.BreakfastEvent_OrganizerCreationEmailCallback_Command,
  showPayloadForm: true,
  requiresConfirmation: false,
};

const updateEventDetailsAction: ActionDefinition = {
  name: 'updateEventDetails',
  label: 'Update Event Details',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useBreakfastEventUpdateEventDetails,
  payloadSchema: schemas.BreakfastEvent_UpdateEventDetails_Command,
  showPayloadForm: true,
  requiresConfirmation: false,
};

const registerAction: ActionDefinition = {
  name: 'register',
  label: 'Register',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useBreakfastEventRegister,
  payloadSchema: schemas.BreakfastEvent_Register_Command,
  showPayloadForm: true,
  requiresConfirmation: false,
};

const participantEmailCallbackAction: ActionDefinition = {
  name: 'participantEmailCallback',
  label: 'Participant Email Callback',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useBreakfastEventParticipantEmailCallback,
  payloadSchema: schemas.BreakfastEvent_ParticipantEmailCallback_Command,
  showPayloadForm: true,
  requiresConfirmation: false,
};

const organizerEmailCallbackAction: ActionDefinition = {
  name: 'organizerEmailCallback',
  label: 'Organizer Email Callback',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useBreakfastEventOrganizerEmailCallback,
  payloadSchema: schemas.BreakfastEvent_OrganizerEmailCallback_Command,
  showPayloadForm: true,
  requiresConfirmation: false,
};

const unregisterAction: ActionDefinition = {
  name: 'unregister',
  label: 'Unregister',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useBreakfastEventUnregister,
  payloadSchema: schemas.BreakfastEvent_Unregister_Command,
  showPayloadForm: true,
  requiresConfirmation: false,
};

const completeAction: ActionDefinition = {
  name: 'complete',
  label: 'Complete',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useBreakfastEventComplete,
  showPayloadForm: false,
  requiresConfirmation: false,
};

const cancelAction: ActionDefinition = {
  name: 'cancel',
  label: 'Cancel',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useBreakfastEventCancel,
  showPayloadForm: false,
  requiresConfirmation: false,
};

const getRegistrationsAction: ActionDefinition = {
  name: 'getRegistrations',
  label: 'Get Registrations',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useBreakfastEventGetRegistrations,
  showPayloadForm: false,
  requiresConfirmation: false,
};

const updateOrganizerEmailAction: ActionDefinition = {
  name: 'updateOrganizerEmail',
  label: 'Update Organizer Email',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useBreakfastEventUpdateOrganizerEmail,
  payloadSchema: schemas.BreakfastEvent_UpdateOrganizerEmail_Command,
  showPayloadForm: true,
  requiresConfirmation: false,
};

const hideEventAction: ActionDefinition = {
  name: 'hideEvent',
  label: 'Hide Event',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useBreakfastEventHideEvent,
  showPayloadForm: false,
  requiresConfirmation: false,
};

const inviteParticipantsAction: ActionDefinition = {
  name: 'inviteParticipants',
  label: 'Invite Participants',
  variant: 'primary',
  icon: 'file-text', // TODO: Select appropriate icon
  mutationHook: useBreakfastEventInviteParticipants,
  payloadSchema: schemas.BreakfastEvent_InviteParticipants_Command,
  showPayloadForm: true,
  requiresConfirmation: false,
};


// Resource definition
export const BreakfastEventResource: ResourceDefinition<BreakfastEvent, GetBreakfastEventListParams, BreakfastEventCreate> = {
  name: 'breakfastEvents',
  displayName: 'BreakfastEvent',
  displayNamePlural: 'BreakfastEvents',
  
  // Reference configuration
  referenceKey: 'BreakfastEvent',
  formatLabel: (entity) => entity.name || entity['@id'],
  
  // Hooks
  listHook: useGetBreakfastEventList,
  detailHook: useGetBreakfastEventByID,
  createHook: useCreateBreakfastEvent,
  createSchema: schemas.BreakfastEvent_Create,
  
  // Actions
  actions: [organizerCreationEmailCallbackAction, updateEventDetailsAction, registerAction, participantEmailCallbackAction, organizerEmailCallbackAction, unregisterAction, completeAction, cancelAction, getRegistrationsAction, updateOrganizerEmailAction, hideEventAction, inviteParticipantsAction],
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
      key: '@state',
      label: 'State',
      accessor: (row) => row['@state'],
      // render: (value) => <StateBadge state={value} />,
    },
    {
      key: 'participantCount',
      label: 'ParticipantCount',
      accessor: (row) => row['participantCount'],
    },
    {
      key: 'name',
      label: 'Name',
      accessor: (row) => row['name'],
    },
    {
      key: 'whatYouBring',
      label: 'WhatYouBring',
      accessor: (row) => row['whatYouBring'],
    },
    {
      key: 'eventDate',
      label: 'EventDate',
      accessor: (row) => row['eventDate'],
    },
  ],
  
  // Pagination
  defaultPageSize: 25,
  
  // Menu
  menu: {
    // icon: FileText, // TODO: Import and add icon from lucide-react if desired
    order: 100, // TODO: Set appropriate order
    path: '/breakfastEvents',
  },
};
