import { ImmutableObject } from 'seamless-immutable';
import Highcharts from 'highcharts';
import { FilterType, Query } from '../../config';

Highcharts.setOptions({
    lang: {
        resetZoom: '⟲',
        decimalPoint: ',',
        thousandsSep: '.'
    },
    plotOptions: {
        series: {
            animation: false
        }
    }
});

const COMMON_GRAPH_OPTIONS = {
    containerProps: {
        style: {
            width: '100%',
            height: '100%'
        }
    },
    chart: {
        zoomType: 'xy',
        borderRadius: 4,
        backgroundColor: 'rgba(250, 250, 250, 0.5)',
        resetZoomButton: {
            theme: {
                style: {
                    fontSize: 14,
                    fontWeight: 900,
                    width: 22,
                    height: 22,
                },
                padding: 4,
            }
        }
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    title: false,
    subtitle: false
};

export const PIE_OPTIONS = {
    ...COMMON_GRAPH_OPTIONS,
    chart: {
        ...COMMON_GRAPH_OPTIONS.chart,
        type: 'pie',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            },
        }
    }
}

export const BAR_OPTIONS = {
    ...COMMON_GRAPH_OPTIONS,
    chart: {
        ...COMMON_GRAPH_OPTIONS.chart,
        type: 'bar',
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        },
    },
    xAxis: {
        crosshair: true,
        visible: true,
        labels: {
            style: {
                fontSize: '10px'
            }
        }
    },
    yAxis: {
        min: 0,
        title: false
    },
}

export const MULTISERIE_OPTIONS = {
    ...BAR_OPTIONS,
}

export enum CardType {
    Amount = 'AMOUNT',
    Pie = 'PIE',
    Bar = 'BAR',
    Multiserie = 'MULTISERIE'
}

export interface SerieConfig {
    name?: string;
    yField?: string;
}

export interface TooltipConfig {
    xFieldLabel?: string;
    customField?: string;
    customFieldLabel?: string;
}

export interface FormatConfig {
    groupByField: string;
}

export interface CardOptions {
    title?: string;
    subtitle?: string;
    viewMore?: boolean;
    viewMoreWhen?: {
        field: string;
        value: string;
    };
    fullWidth?: boolean;
    eachRowIsACard?: boolean;
    fieldCategory?: string;
    query?: Query;
    serieConfig?: SerieConfig[];
    tooltipConfig?: TooltipConfig;
    formatConfig?: FormatConfig;
}

export interface CardFilter {
    cardId: number;
    type: FilterType;
    query: Query;
}

export interface Card {
    type: CardType;
    data: any;
    filter?: CardFilter;
    options?: CardOptions;
    handleViewMore?: (card: Card) => void;
}

export type IMCard = ImmutableObject<Card>;