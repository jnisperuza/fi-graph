import { ImmutableObject } from 'seamless-immutable';
import Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { FilterType, Query } from '../../config';

// init the module
HC_exporting(Highcharts)

Highcharts.setOptions({
    lang: {
        resetZoom: 'Restablecer zoom',
        resetZoomTitle: 'Zoom normal',
        decimalPoint: ',',
        thousandsSep: '.',
        viewFullscreen: 'Ver pantalla completa',
        exitFullscreen: 'Salir pantalla completa',
        printChart: 'Imprimir gráfica',
        downloadCSV: 'Descargar CSV',
        downloadJPEG: 'Descargar JPEG',
        downloadPDF: 'Descargar PDF',
        downloadPNG: 'Descargar PNG',
        downloadSVG: 'Descargar SVG',
        downloadXLS: 'Descargar XLS',
        months: [
            'Enero', 'Febrero', 'Marzo', 'Abril',
            'Mayo', 'Junio', 'Julio', 'Agosto',
            'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        shortMonths: [
            'Ene', 'Feb', 'Mar', 'Abr',
            'May', 'Jun', 'Jul', 'Ago',
            'Sep', 'Oct', 'Nov', 'Dic'
        ],
        weekdays: [
            'Domingo', 'Lunes', 'Martes', 'Miércoles',
            'Jueves', 'Viernes', 'Sábado'
        ],
        shortWeekdays: [
            'Dom', 'Lun', 'Mar', 'Mié',
            'Jue', 'Vie', 'Sáb'
        ],
    },
    colors: [
        '#b9b611',
        '#008a7a',
        '#38dae5',
        '#76b91a',
        '#4c9929',
        '#a3de00',
        '#1d5630',
        '#67ba58'
    ],
    exporting: {
        buttons: {
            contextButton: {
                menuItems: [
                    'viewFullscreen',
                    'printChart',
                    'downloadPNG',
                ]
            }
        }
    },
    plotOptions: {
        series: {
            animation: false
        }
    },
});

const COMMON_GRAPH_OPTIONS = {
    containerProps: {
        style: {
            width: '100%',
            height: '100%',
            boxSizing: 'border-box'
        }
    },
    chart: {
        zoomType: 'xy',
        borderRadius: 0,
        backgroundColor: 'white',
        resetZoomButton: {
            position: {
                align: 'right',
                verticalAlign: 'middle',
                x: 0,
                y: -15
            },
            theme: {
                style: {
                    fontSize: 12
                },
                padding: 4,
            }
        }
    },
    navigation: {
        menuItemHoverStyle: {
            background: '#008a7a',
            color: '#ffffff'
        }
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
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
                formatter: function () {
                    return `${this.point.name}: ${Highcharts.numberFormat(this.percentage, 2)}%`;
                }
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
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: 0,
        y: 90,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
    },
}

export enum CardType {
    Amount = 'AMOUNT',
    Pie = 'PIE',
    Bar = 'BAR',
    Multiserie = 'MULTISERIE',
    AmountRow = 'AMOUNT_ROW',
}

export enum FormatType {
    Month = 'MONTH',
}

export interface SerieConfig {
    name?: string;
    yField?: string;
}

export interface TooltipConfig {
    titleField?: string;
    xFieldLabel?: string;
    customField?: string;
    customFieldLabel?: string;
}

export interface FormatConfigField {
    name: string;
    format: FormatType;
}

export interface FormatConfig {
    groupByField?: string;
    fields?: FormatConfigField[];
}

export interface DashboardConfig {
    title?: string;
    subtitle?: string;
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
    fieldSerie?: string;
    query?: Query;
    serieConfig?: SerieConfig[];
    tooltipConfig?: TooltipConfig;
    formatConfig?: FormatConfig;
    dashboardConfig?: DashboardConfig;
}

export interface CardFilter {
    cardId: number;
    type?: FilterType;
    query?: Query;
}

export interface Card {
    type: CardType;
    data: any;
    filter?: CardFilter;
    options?: CardOptions;
    handleViewMore?: (card: Card) => void;
}

export type IMCard = ImmutableObject<Card>;