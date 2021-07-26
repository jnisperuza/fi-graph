import { ImmutableObject } from 'seamless-immutable';

/**
 * @name DEFAULT_HEIGHT
 * @description Initial component height, without to expand
 */
export const DEFAULT_HEIGHT = 72;

export interface FilterStatus {
    filters?: string[];
    removeFilter?: (filter: string) => void;
}

export type IMFilterStatus = ImmutableObject<FilterStatus>;