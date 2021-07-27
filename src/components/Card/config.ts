import { ImmutableObject } from 'seamless-immutable';
import Highcharts from 'highcharts';

Highcharts.setOptions({
    lang: {
        resetZoom: '⟲',
        decimalPoint: ',',
        thousandsSep: '.'
    }
});

const COMMON_GRAPH_OPTIONS = {
    chart: {
        height: '170px',
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
        type: 'column',
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        },
    },
    xAxis: {
        crosshair: true,
        visible: false
    },
    yAxis: {
        min: 0,
        title: false
    },
}

export enum CardType {
    Amount = 'AMOUNT',
    Pie = 'PIE',
    Bar = 'BAR',
    Multiserie = 'MULTISERIE',
}

export interface SerieConfig {
    name?: string;
    yField?: string;
}

export interface TooltipConfig {
    xField?: string;
    xFieldLabel?: string;
    customField?: string;
    customFieldLabel?: string;
}

export interface CardOptions {
    title?: string;
    subtitle?: string;
    viewMore?: boolean;
    fullWidth?: boolean;
    fieldCategory?: string; // Bar
    serieConfig?: SerieConfig[]; // Bar
    tooltipConfig?: TooltipConfig; // Bar
}

export interface Card {
    type: CardType;
    data: any;
    options?: CardOptions;
}

export type IMCard = ImmutableObject<Card>;