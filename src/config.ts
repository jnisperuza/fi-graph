import { ImmutableObject } from 'seamless-immutable';
// @ts-ignore
import { React } from 'jimu-core';
import { Card, CardOptions, CardType, FormatType } from './components/Card/config';

export interface State {
  wrapperFilterStatusRef: React.RefObject<HTMLDivElement>;
  firstLoad: boolean;
  refresh: boolean;
  preloader: boolean;
  filters: Filter[];
  filterStatus: string[];
  queries: Query[];
  queryData: QueryData[];
  queryDataDashboard: QueryData[];
  selectedCard: Card;
  periodData: PeriodData[];
  previousYear: PeriodData;
}

export type IMWidgetState = ImmutableObject<State>;

export enum InstrumentSubtype {
  CifContratos = 'CIF CONTRATOS',
  CredColocaciones = 'CRED COLOCACIONES',
  CredSaldos = 'CRED SALDOS',
  FagExpedidas = 'FAG EXPEDIDAS',
  FagPagadas = 'FAG PAGADAS',
  FagVigentes = 'FAG VIGENTES',
  IcrProyectos = 'ICR PROYECTOS',
  IsaPolizas = 'ISA POLIZAS',
  LecColocaciones = 'LEC COLOCACIONES',
  MfrOperaciones = 'MFR OPERACIONES',
}

export enum FilterType {
  Instrument = 'INSTRUMENTO',
  Period = 'PERIODO',
  Territory = 'TERRITORIO',
  Product = 'PRODUCTO',
  Producer = 'PRODUCTOR',
  Intermediary = 'INTERMEDIARIO',
}

export interface Filter {
  filterType: FilterType;
  label?: string;
  field?: string;
  type?: string;
  value: string | string[] | InstrumentSubtype[];
}

// This is used to paint all cards dynamically 
export interface FilterList {
  filterType: FilterType;
  filterList: Filter[];
}

export interface Hide {
  field: string;
  value: string;
}

export interface UnionCard {
  id: number;
  field: string;
  value: string | number;
}

export interface CardConfig {
  type: CardType;
  id?: number; // to control level dependencies
  unionCard?: UnionCard; // to dashboard
  excludeRow?: Hide[]; // to dashboard
  hide?: Hide[];
  options?: CardOptions;
}

export interface Query {
  parentCard?: number;
  type: FilterType;
  name: string;
  cardConfig: CardConfig;
  queryVars?: string[];
  whereFields?: string[];
  query: any;
}

export interface PeriodData {
  // Names from database
  anio: number;
  mes?: number;
}

export interface QueryData {
  name: string;
  cardConfig: CardConfig;
  query: Query;
  data: any;
}

export interface DatasourceRecord {
  getData: Function;
}

export interface DatasourceResponse {
  records: DatasourceRecord[];
}

export interface WidgetState {
  filters?: Filter[];
}

export interface CardData {
  value: number;
  amount: number;
  name: string;
}

export interface HistoricalEvolutionData {
  year: number;
  instruments: CardData[];
}

export interface Data {
  instrumentSubtypes?: CardData[];
  historicalEvolution?: HistoricalEvolutionData[];
  territorialDistribution?: CardData[];
  distributionChain?: CardData[];
  producerType?: CardData[];
  intermediaryType?: CardData[];
}

export const PAGE_SIZE = 10000;
export const INTL = {
  code: 'es-CO',
  currency: 'COP'
};
export const LOGICAL_OPERATORS = ['or', 'and', '>=', '<=', '>', '<'];
// Single Year
export const DEFAULT_FILTER_YEAR: Filter = {
  filterType: FilterType.Period,
  field: 'anio',
  label: 'Año',
  value: null // From state
}

export const DEFAULT_FILTER = [
  {
    filterType: FilterType.Instrument,
    label: 'SUBTIPO',
    field: 'subtipo_inst',
    value: [
      'CIF CONTRATOS',
      'CRE COLOCACIONES',
      'CRE SALDOS',
      'FAG EXPEDIDAS',
      'FAG PAGADAS',
      'FAG VIGENTES',
      'ICR PROYECTOS',
      'ISA POLIZAS',
      'LEC COLOCACIONES',
      'MFR OPERACIONES'
    ],
  },
];

export const DB_FIELDS = {
  instrumento: {
    field: 'instrumento',
    type: 'string'
  },
  subtipo_inst: {
    field: 'subtipo_inst',
    type: 'string'
  },
  anio: {
    field: 'anio',
    type: 'number'
  },
  semestre: {
    field: 'semestre',
    type: 'string'
  },
  trimestre: {
    field: 'trimestre',
    type: 'string'
  },
  per_gob: {
    field: 'per_gob',
    type: 'string'
  },
  mes: {
    field: 'mes',
    type: 'number'
  },
  reg_colombia: {
    field: 'reg_colombia',
    type: 'string'
  },
  dpto_cnmbr: {
    field: 'dpto_cnmbr',
    type: 'string'
  },
  mpio_cnmbr: {
    field: 'mpio_cnmbr',
    type: 'string'
  },
  mpio_ccnct: {
    field: 'mpio_ccnct',
    type: 'string'
  },
  pdet: {
    field: 'pdet',
    type: 'string'
  },
  categ_rur: {
    field: 'categ_rur',
    type: 'string'
  },
  zomac: {
    field: 'zomac',
    type: 'string'
  },
  mzeii: {
    field: 'mzeii',
    type: 'string'
  },
  zrc: {
    field: 'zrc',
    type: 'string'
  },
  mfront: {
    field: 'mfront',
    type: 'string'
  },
  cadena: {
    field: 'cadena',
    type: 'string'
  },
  sector: {
    field: 'sector',
    type: 'string'
  },
  reg_finagr: {
    field: 'reg_finagr',
    type: 'string'
  },
  eslabon: {
    field: 'eslabon',
    type: 'string'
  },
  destino: {
    field: 'destino',
    type: 'string'
  },
  sexo: {
    field: 'sexo',
    type: 'string'
  },
  tipo_accion: {
    field: 'tipo_accion',
    type: 'string'
  },
  tipo_cartera: {
    field: 'tipo_cartera',
    type: 'string'
  },
  interm: {
    field: 'interm',
    type: 'string'
  },
  tipo_interm: {
    field: 'tipo_interm',
    type: 'string'
  },
  nat_juridica: {
    field: 'nat_juridica',
    type: 'string'
  },
  tipo_productor: {
    field: 'tipo_productor',
    type: 'string'
  },
  coloc_oficinas: {
    field: 'coloc_oficinas',
    type: 'string'
  },
  oficina: {
    field: 'oficina',
    type: 'string'
  },
};

export const QUERY_SCHEMA_DASHBOARD: Query[] = [
  {
    parentCard: 3,
    type: FilterType.Territory,
    name: 'Nivel ruralidad',
    cardConfig: {
      type: CardType.Bar,
      id: 1,
      options: {
        fieldCategory: 'categ_rur',
        viewMore: false,
        serieConfig: [{
          name: 'categ_rur',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['categ_rur'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    parentCard: 3,
    type: FilterType.Territory,
    name: 'PDET',
    cardConfig: {
      type: CardType.AmountRow,
      id: 2,
      unionCard: {
        id: 100,
        field: 'pdet',
        value: 'Si'
      },
      options: {
        fieldCategory: 'pdet',
        viewMore: false,
        serieConfig: [{
          name: 'pdet',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['pdet'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    parentCard: 3,
    type: FilterType.Territory,
    name: 'ZOMAC',
    cardConfig: {
      type: CardType.AmountRow,
      id: 3,
      unionCard: {
        id: 100,
        field: 'zomac',
        value: 'Si'
      },
      options: {
        fieldCategory: 'zomac',
        viewMore: false,
        serieConfig: [{
          name: 'zomac',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['zomac'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    parentCard: 3,
    type: FilterType.Territory,
    name: 'ZEII',
    cardConfig: {
      type: CardType.Bar,
      id: 4,
      // rule for dashboard
      excludeRow: [{
        field: 'mzeii',
        value: 'No'
      }],
      options: {
        fieldCategory: 'mzeii',
        viewMore: false,
        serieConfig: [{
          name: 'mzeii',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['mzeii'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    parentCard: 3,
    type: FilterType.Territory,
    name: 'Zona de reserva campesina',
    cardConfig: {
      type: CardType.Bar,
      id: 5,
      // Rule for dashboard
      excludeRow: [{
        field: 'zrc',
        value: 'No'
      }],
      options: {
        fieldCategory: 'zrc',
        viewMore: false,
        serieConfig: [{
          name: 'zrc',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['zrc'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    parentCard: 3,
    type: FilterType.Territory,
    name: 'Municipios frontera',
    cardConfig: {
      type: CardType.AmountRow,
      id: 6,
      // Defining the same code that at the time of rendering
      // shows the data in the same AmountRow type card.
      unionCard: {
        id: 100,
        field: 'mfront',
        value: 'Si'
      },
      options: {
        fieldCategory: 'mfront',
        viewMore: false,
        serieConfig: [{
          name: 'mfront',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['mfront'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    parentCard: 4,
    type: FilterType.Intermediary,
    name: 'Intermediario',
    cardConfig: {
      type: CardType.Bar,
      id: 7,
      options: {
        fieldCategory: 'interm',
        viewMore: false,
        fullWidth: true,
        serieConfig: [{
          name: 'interm',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['interm'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC'],
      pageSize: 5
    }
  },
  {
    parentCard: 8,
    type: FilterType.Producer,
    name: 'Tipo persona',
    cardConfig: {
      type: CardType.Bar,
      id: 8,
      options: {
        fieldCategory: 'nat_juridica',
        viewMore: false,
        serieConfig: [{
          name: 'nat_juridica',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['nat_juridica'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    parentCard: 8,
    type: FilterType.Producer,
    name: 'Tipo productor',
    cardConfig: {
      type: CardType.Bar,
      id: 9,
      options: {
        fieldCategory: 'tipo_productor',
        viewMore: false,
        serieConfig: [{
          name: 'tipo_productor',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['tipo_productor'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    parentCard: 8,
    type: FilterType.Producer,
    name: 'Sexo',
    cardConfig: {
      type: CardType.Bar,
      id: 10,
      options: {
        fieldCategory: 'sexo',
        viewMore: false,
        serieConfig: [{
          name: 'sexo',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['sexo'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    parentCard: 5,
    type: FilterType.Product,
    name: 'Cadenas por sector', // Not visible because of 'eachRowIsACard' property
    cardConfig: {
      type: CardType.Bar,
      id: 11,
      options: {
        fieldCategory: 'cadena',
        viewMore: false,
        eachRowIsACard: true,
        serieConfig: [{
          yField: 'total_opif_sum'
        }],
        formatConfig: {// Format data
          groupByField: 'sector',
        },
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['sector', 'cadena'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    parentCard: 6,
    type: FilterType.Product,
    name: 'Cadena',
    cardConfig: {
      type: CardType.Multiserie,
      id: 12,
      options: {
        fieldCategory: 'cadena',
        fieldSerie: 'eslabon',
        viewMore: false,
        fullWidth: true,
        serieConfig: [{
          name: 'eslabon',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          titleField: 'eslabon',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['cadena', 'eslabon'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    parentCard: 7,
    type: FilterType.Product,
    name: 'Destino de crédito por cadena',
    cardConfig: {
      type: CardType.Bar,
      id: 13,
      options: {
        fieldCategory: 'destino',
        viewMore: false,
        eachRowIsACard: true,
        serieConfig: [{
          yField: 'total_opif_sum'
        }],
        formatConfig: {// Format data
          groupByField: 'cadena',
        },
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['cadena', 'destino'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    parentCard: 1,
    type: FilterType.Instrument,
    name: 'Mes',
    cardConfig: {
      type: CardType.Bar,
      id: 14,
      options: {
        fieldCategory: 'mes',
        viewMore: false,
        fullWidth: true,
        serieConfig: [{
          yField: 'total_opif_sum'
        }],
        formatConfig: {// Format data
          fields: [{
            name: 'mes', // Field name from db schema
            format: FormatType.Month
          }],
        },
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    whereFields: ['anio'], // For predefined fields
    queryVars: ['periodData.0'], // From state
    query: {
      where: `anio={anio}`, // Predefined where
      returnGeometry: false,
      groupByFieldsForStatistics: ['subtipo_inst', 'mes'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['mes DESC']
    }
  },
]

export const QUERY_SCHEMA: Query[] = [
  /**
   * WHERE: Will be updated by dynamic filters '1=1' works as fallback
   */
  {
    type: FilterType.Instrument,
    name: 'Instrumentos',
    cardConfig: {
      type: CardType.Amount,
      id: 1,
      options: {
        viewMoreWhen: {
          field: 'title', // Title card
          value: 'CRE COLOCACIONES'
        },
        dashboardConfig: {
          subtitle: 'Nro. operaciones'
        },
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['subtipo_inst'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    type: FilterType.Period,
    name: 'Periodo de tiempo',
    cardConfig: {
      type: CardType.Multiserie,
      id: 2,
      options: {
        subtitle: 'Nro. operaciones',
        viewMore: false,
        fieldCategory: 'tipo_cartera',
        fieldSerie: 'anio',
        serieConfig: [{
          name: 'anio',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          titleField: 'anio',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    whereFields: ['subtipo_inst', 'anio'], // For predefined fields
    queryVars: ['periodData.0', 'previousYear'], // From state
    query: {
      where: `subtipo_inst='CRE COLOCACIONES' and anio={anio} or anio={year}`, // Predefined where
      returnGeometry: false,
      groupByFieldsForStatistics: ['anio', 'tipo_cartera'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    type: FilterType.Territory,
    name: 'Top 5 Territorio',
    cardConfig: {
      type: CardType.Bar,
      id: 3,
      hide: [{
        field: 'field',
        value: 'mpio_cnmbr'
      }, {
        field: 'field',
        value: 'dpto_cnmbr'
      }],
      options: {
        subtitle: 'Nro. operaciones',
        fieldCategory: 'dpto_cnmbr',
        dashboardConfig: {
          title: 'Territorio',
          subtitle: 'Nro. operaciones'
        },
        serieConfig: [{
          name: 'dpto_cnmbr',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['dpto_cnmbr'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC'],
      pageSize: 5
    }
  },
  {
    type: FilterType.Intermediary,
    name: 'Top 5 Tipo intermediario',
    cardConfig: {
      type: CardType.Bar,
      id: 4,
      options: {
        subtitle: 'Nro. operaciones',
        fieldCategory: 'tipo_interm',
        dashboardConfig: {
          title: 'Top 5 Tipo intermediario',
          subtitle: 'Nro. operaciones'
        },
        serieConfig: [{
          name: 'tipo_interm',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['tipo_interm'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC'],
      pageSize: 5
    }
  },
  {
    type: FilterType.Product,
    name: 'Sector',
    cardConfig: {
      type: CardType.Bar,
      id: 5,
      hide: [{
        field: 'field',
        value: 'cadena'
      }, {
        field: 'field',
        value: 'eslabon'
      }],
      options: {
        subtitle: 'Nro. operaciones',
        fieldCategory: 'sector',
        dashboardConfig: {
          title: 'Cadenas por sector',
          subtitle: 'Nro. operaciones'
        },
        serieConfig: [{
          name: 'sector',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['sector'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    type: FilterType.Product,
    name: 'Top 5 Cadenas',
    cardConfig: {
      type: CardType.Bar,
      id: 6,
      hide: [{
        field: 'field',
        value: 'sector'
      }, {
        field: 'field',
        value: 'cadena'
      }, {
        field: 'field',
        value: 'eslabon'
      }],
      options: {
        subtitle: 'Nro. operaciones',
        fieldCategory: 'cadena',
        dashboardConfig: {
          title: 'Eslabones por cadena',
          subtitle: 'Nro. operaciones'
        },
        serieConfig: [{
          name: 'cadena',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['cadena'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC'],
      pageSize: 5
    }
  },
  {
    type: FilterType.Product,
    name: 'Top 5 Eslabones',
    cardConfig: {
      type: CardType.Bar,
      id: 7,
      hide: [{
        field: 'field',
        value: 'eslabon'
      }],
      options: {
        subtitle: 'Nro. operaciones',
        fieldCategory: 'eslabon',
        dashboardConfig: {
          title: 'Destinos por cadena',
          subtitle: 'Nro. operaciones'
        },
        serieConfig: [{
          name: 'eslabon',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['eslabon'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC'],
      pageSize: 5
    }
  },
  {
    type: FilterType.Producer,
    name: 'Características productor',
    cardConfig: {
      type: CardType.Pie,
      id: 8,
      options: {
        subtitle: 'Nro. operaciones',
        fieldCategory: 'tipo_productor',
        dashboardConfig: {
          title: 'Características productor',
          subtitle: 'Nro. operaciones'
        },
        serieConfig: [{
          name: 'tipo_productor',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      returnGeometry: false,
      groupByFieldsForStatistics: ['tipo_productor'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'total_opif',
          outStatisticFieldName: 'total_opif_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opif',
          outStatisticFieldName: 'valor_opif_sum'
        }
      ],
      orderByFields: ['total_opif_sum DESC']
    }
  }
];
