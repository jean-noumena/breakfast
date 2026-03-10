/**
 * Resources Module
 * 
 * Central export point for all resource definitions.
 * Import from '@resources' for cleaner imports.
 * 
 * This module also auto-registers all resources with the resource registry
 * to enable reference field resolution.
 */

import type { ResourceDefinition } from '@npl/frontend';
import { registerResource } from '@npl/frontend';

export { BreakfastEventResource as BreakfastResource } from './breakfastEvents';
export { ParticipantResource } from './participant';

// Add more resources here as you build them:
// export { UserResource } from './users';
// export { ProjectResource } from './projects';

/**
 * All Resources Array
 * Aggregates all resource definitions for dynamic menu generation
 */
import { BreakfastEventResource } from './breakfastEvents';
import { ParticipantResource } from './participant';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export { BreakfastEventResource } from './breakfastEvents.generated';

export const ALL_RESOURCES: ResourceDefinition<any, any, any>[] = [
  BreakfastEventResource,
  ParticipantResource,
] as const;

// Auto-register all resources for reference field resolution
ALL_RESOURCES.forEach(resource => {
  registerResource(resource);
});
