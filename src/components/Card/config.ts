import { ImmutableObject } from 'seamless-immutable';
import { Instrument } from '../../config';

const COMMON_GRAPH_OPTIONS = {
    backgroundColor: 'transparent',
    colors: [
        '#b9b611',
        '#008a7a',
        '#67ba58',
        '#acde87',
        '#4c9929',
        '#76b91a',
        '#a3de00',
        '#1d5630'
    ],
    chartArea: {
        top: 10,
        bottom: 20,
        right: 10,
        left: 10,
        width: "100%",
        height: "100%"
    },
    legend: {
        position: 'bottom',
        alignment: 'center'
    },
    vAxis: {
        textPosition: 'none',
        gridlines: {
            color: 'transparent',
            count: 0
        },
        baselineColor: '#CCCCCC'
    },
    hAxis: {
        textPosition: 'none',
        gridlines: {
            color: 'transparent',
            count: 0
        },
        baselineColor: '#CCCCCC'
    },
}

export const SPLINE_OPTIONS = {
    ...COMMON_GRAPH_OPTIONS,
    series: {
        1: { curveType: 'function' },
    }
};

export const PIE_OPTIONS = {
    ...COMMON_GRAPH_OPTIONS,
    legend: {
        ...COMMON_GRAPH_OPTIONS.legend,
        position: 'left'
    },
    chartArea: {
        ...COMMON_GRAPH_OPTIONS.chartArea,
        bottom: 10
    },
}

export const BAR_OPTIONS = {
    ...COMMON_GRAPH_OPTIONS,
    legend: {
        position: 'none'
    },
    chartArea: {
        ...COMMON_GRAPH_OPTIONS.chartArea,
        bottom: 10
    },
}

export enum CardType {
    Amount = 'AMOUNT',
    Spline = 'SPLINE',
    Pie = 'PIE',
    Bar = 'BAR',
    Multiserie = 'MULTISERIE',
}

export interface TitleCard {
    normal: string;
    bold: string;
    key?: Instrument;
}

export interface Card {
    type: CardType;
    data: any;
    loading?: boolean;
    options?: {
        title: TitleCard;
        subtitle?: TitleCard;
        viewMore?: boolean;
        fullWidth?: boolean;
    };
}

export type IMCard = ImmutableObject<Card>;