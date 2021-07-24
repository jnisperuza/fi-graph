import { ImmutableObject } from 'seamless-immutable';

/**
 * @name DEFAULT_HEIGHT
 * @description Initial component height, without to expand
 */
export const DEFAULT_HEIGHT = 72;

export enum CardType {
    Amount = 'AMOUNT',
    Spline = 'SPLINE',
    Pie = 'PIE',
    Bar = 'BAR'
}

export interface FilterStatus {
    filters?: string[];
    removeFilter?: (filter: string) => void;
}

export type IMFilterStatus = ImmutableObject<FilterStatus>;