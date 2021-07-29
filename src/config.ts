import { ImmutableObject } from 'seamless-immutable';
// @ts-ignore
import { React, FeatureLayerQueryParams } from 'jimu-core';
import { Card, CardOptions, CardType } from './components/Card/config';

export interface State {
  query: FeatureLayerQueryParams;
  wrapperFilterStatusRef: React.RefObject<HTMLDivElement>;
  refresh: boolean;
  preloader: boolean;
  filters: Filter[];
  filterStatus: string[];
  queries: Query[];
  queryData: QueryData[];
  selectedCard: Card;
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
  Chain = 'CADENA',
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

export interface CardConfig {
  type: CardType;
  id?: number; // to control level dependencies
  hide?: Hide[];
  options?: CardOptions;
}

export interface Query {
  name: string;
  cardConfig: CardConfig;
  query: any;
}

export interface QueryData {
  name: string;
  cardConfig: CardConfig;
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

export const QUERY_SCHEMA = [
  /**
   * WHERE: Will be updated by dynamic filters '1 = 1' works as fallback
   */
  {
    name: 'Instrumentos',
    cardConfig: {
      type: CardType.Amount,
      id: 1,
    },
    query: {
      where: '1=1',
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
    name: 'Periodo de tiempo',
    cardConfig: {
      type: CardType.Bar,
      id: 2,
      options: {
        fieldCategory: 'interm',
        serieConfig: [{
          name: 'intermediario',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xField: 'interm',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      where: '1=1',
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
    name: 'Territorio',
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
        fieldCategory: 'dpto_cnmbr',
        serieConfig: [{
          name: 'departamento',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xField: 'dpto_cnmbr',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      where: '1=1',
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
    name: 'Tipo intermediario',
    cardConfig: {
      type: CardType.Bar,
      id: 4,
      options: {
        fieldCategory: 'tipo_interm',
        serieConfig: [{
          name: 'tipo intermediario',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xField: 'tipo_interm',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      where: '1=1',
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
    name: 'Producto (Sector)',
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
        fieldCategory: 'sector',
        serieConfig: [{
          name: 'sector',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xField: 'sector',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      where: '1=1',
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
      orderByFields: ['total_opif_sum DESC'],
      pageSize: 5
    }
  },
  {
    name: 'Producto (Cadena)',
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
        fieldCategory: 'cadena',
        serieConfig: [{
          name: 'cadena',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xField: 'cadena',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      where: '1=1',
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
    name: 'Producto (Eslabon)',
    cardConfig: {
      type: CardType.Bar,
      id: 7,
      hide: [{
        field: 'field',
        value: 'eslabon'
      }],
      options: {
        fieldCategory: 'eslabon',
        serieConfig: [{
          name: 'eslabon',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xField: 'eslabon',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      where: '1=1',
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
    name: 'Característica productor',
    cardConfig: {
      type: CardType.Pie,
      id: 8,
      options: {
        fieldCategory: 'tipo_productor',
        serieConfig: [{
          name: 'tipo productor',
          yField: 'total_opif_sum'
        }],
        tooltipConfig: {
          xField: 'tipo_productor',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opif_sum',
          customFieldLabel: 'Valor: $'
        }
      }
    },
    query: {
      where: '1=1',
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
