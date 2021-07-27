import { ImmutableObject } from 'seamless-immutable';
// @ts-ignore
import { React, FeatureLayerQueryParams } from 'jimu-core';
import { CardOptions, CardType } from './components/Card/config';

export interface State {
  query: FeatureLayerQueryParams;
  wrapperFilterStatusRef: React.RefObject<HTMLDivElement>;
  refresh: boolean;
  preloader: boolean;
  filters: Filter[];
  filterStatus: string[];
  queries: Query[];
  queryData: QueryData[];
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
  SUBTIPO: {
    field: 'subtipo_inst',
    type: 'string'
  },
  'AÑO': {
    field: 'anio',
    type: 'number'
  },
  SEMESTRE: {
    field: 'semestre',
    type: 'string'
  },
  TRIMESTRE: {
    field: 'trimestre',
    type: 'string'
  },
  MES: {
    field: 'mes',
    type: 'number'
  },
  DEPARTAMENTO: {
    field: 'dpto_cnmbr',
    type: 'string'
  },
  MUNICIPIO: {
    field: 'mpio_cnmbr',
    type: 'string'
  },
  'CATEGORIA MUNICIPALES': {
    field: 'categ_rur',
    type: 'string'
  },
  'CADENA PRODUCTIVA': {
    field: 'cadena',
    type: 'string'
  },
  ESLABON: {
    field: 'cadena',
    type: 'string'
  },
  'TIPO INTERMEDIARIO': {
    field: 'tipo_interm',
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
          onStatisticField: 'total_opmfr',
          outStatisticFieldName: 'total_opmfr_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opmfr',
          outStatisticFieldName: 'valor_opmfr_sum'
        }
      ],
      orderByFields: ['total_opmfr_sum DESC']
    }
  },
  {
    name: 'Fuente de Financiamiento',
    cardConfig: {
      type: CardType.Bar,
      id: 2,
      options: {
        fieldCategory: 'interm',
        serieConfig: [{
          name: 'Fuente de Financiamiento',
          yField: 'total_opmfr_sum'
        }],
        tooltipConfig: {
          xField: 'interm',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opmfr_sum',
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
          onStatisticField: 'total_opmfr',
          outStatisticFieldName: 'total_opmfr_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opmfr',
          outStatisticFieldName: 'valor_opmfr_sum'
        }
      ],
      orderByFields: ['total_opmfr_sum DESC'],
      pageSize: 10
    }
  },
  {
    name: 'Territorio',
    cardConfig: {
      type: CardType.Bar,
      id: 3,
      hide: [{
        field: 'label',
        value: 'MUNICIPIO'
      }, {
        field: 'label',
        value: 'DEPARTAMENTO'
      }],
      options: {
        fieldCategory: 'dpto_cnmbr',
        serieConfig: [{
          name: 'territorio',
          yField: 'total_opmfr_sum'
        }],
        tooltipConfig: {
          xField: 'dpto_cnmbr',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opmfr_sum',
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
          onStatisticField: 'total_opmfr',
          outStatisticFieldName: 'total_opmfr_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opmfr',
          outStatisticFieldName: 'valor_opmfr_sum'
        }
      ],
      orderByFields: ['total_opmfr_sum DESC'],
      pageSize: 10
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
          yField: 'total_opmfr_sum'
        }],
        tooltipConfig: {
          xField: 'tipo_interm',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opmfr_sum',
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
          onStatisticField: 'total_opmfr',
          outStatisticFieldName: 'total_opmfr_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opmfr',
          outStatisticFieldName: 'valor_opmfr_sum'
        }
      ],
      orderByFields: ['total_opmfr_sum DESC']
    }
  },
  {
    name: 'Distribución de Cadena',
    cardConfig: {
      type: CardType.Bar,
      id: 5,
      hide: [{
        field: 'label',
        value: 'CADENA PRODUCTIVA'
      }, {
        field: 'label',
        value: 'ESLABON'
      }],
      options: {
        fieldCategory: 'cadena',
        serieConfig: [{
          name: 'distribucion de cadena',
          yField: 'total_opmfr_sum'
        }],
        tooltipConfig: {
          xField: 'cadena',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opmfr_sum',
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
          onStatisticField: 'total_opmfr',
          outStatisticFieldName: 'total_opmfr_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opmfr',
          outStatisticFieldName: 'valor_opmfr_sum'
        }
      ],
      orderByFields: ['total_opmfr_sum DESC']
    }
  },
  {
    name: 'Distribución de Cadena',
    cardConfig: {
      type: CardType.Bar,
      id: 5,
      hide: [{
        field: 'label',
        value: 'ESLABON'
      }],
      options: {
        fieldCategory: 'eslabon',
        serieConfig: [{
          name: 'distribucion de cadena',
          yField: 'total_opmfr_sum'
        }],
        tooltipConfig: {
          xField: 'eslabon',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opmfr_sum',
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
          onStatisticField: 'total_opmfr',
          outStatisticFieldName: 'total_opmfr_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opmfr',
          outStatisticFieldName: 'valor_opmfr_sum'
        }
      ],
      orderByFields: ['total_opmfr_sum DESC']
    }
  },
  {
    // Gráfico de torta de total de operaciones por Tipo Productor.
    name: 'Tipo productor',
    cardConfig: {
      type: CardType.Pie,
      id: 6,
      options: {
        fieldCategory: 'tipo_productor',
        serieConfig: [{
          name: 'tipo productor',
          yField: 'total_opmfr_sum'
        }],
        tooltipConfig: {
          xField: 'tipo_productor',
          xFieldLabel: 'Nro. operaciones:',
          customField: 'valor_opmfr_sum',
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
          onStatisticField: 'total_opmfr',
          outStatisticFieldName: 'total_opmfr_sum'
        },
        {
          statisticType: 'sum',
          onStatisticField: 'valor_opmfr',
          outStatisticFieldName: 'valor_opmfr_sum'
        }
      ],
      orderByFields: ['total_opmfr_sum DESC']
    }
  }
];
