import { ImmutableObject } from 'seamless-immutable';
// @ts-ignore
import { React, FeatureLayerQueryParams } from 'jimu-core';
import { CardType } from './components/Card/config';

export interface State {
  query: FeatureLayerQueryParams;
  wrapperFilterStatusRef: React.RefObject<HTMLDivElement>;
  refresh: boolean;
  loading: boolean;
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

export interface Query {
  name: string;
  visual: CardType;
  query: any;
}

export interface QueryData {
  name: string;
  visual: CardType;
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
  // {
  //   filterType: FilterType.Instrument,
  //   label: 'SUBTIPO',
  //   value: [
  //     'CIF CONTRATOS',
  //     'CRED COLOCACIONES',
  //     'CRED SALDOS',
  //     'FAG EXPEDIDAS',
  //     'FAG PAGADAS',
  //     'FAG VIGENTES',
  //     'ICR PROYECTOS',
  //     'ISA POLIZAS',
  //     'LEC COLOCACIONES',
  //     'MFR OPERACIONES'
  //   ],
  // },
  {
    filterType: FilterType.Instrument,
    label: 'SUBTIPO',
    value: [
      'CIF CONTRATOS',
      'CRED COLOCACIONES',
      'CRED SALDOS',
      'FAG EXPEDIDAS',
      'FAG PAGADAS'
    ],
  },
  {
    filterType: FilterType.Instrument,
    label: 'SUBTIPO',
    value: [
      'FAG VIGENTES',
      'ICR PROYECTOS',
      'ISA POLIZAS',
      'LEC COLOCACIONES',
      'MFR OPERACIONES'
    ],
  },
  {
    filterType: FilterType.Period,
    label: 'AÑO',
    value: '2020',
  },
  {
    filterType: FilterType.Period,
    label: 'SEMESTRE',
    value: ['SEMESTRE 1'],
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
  {
    name: 'instrumentos',
    visual: CardType.Amount,
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
    // Periódo de Tiempo: Grafica de barras del número de Operaciones distibuidas
    // por Fuente de Financiamiento para el año seleccionado o periodo vigente.
    name: 'periodo de tiempo',
    visual: CardType.Bar,
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
      orderByFields: ['total_opif_sum DESC']
    }
  },
  {
    // Grafica de Barras del Top 5 Departamentos por número de operaciones 
    // (cuando aplique: si el usuario no selecciona un depto o un municipio.
    name: 'territorio',
    visual: CardType.Bar,
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
    // Gráfico de torta de total de operaciones por Tipo Productor.
    name: 'caracteristicas productor',
    visual: CardType.Pie,
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
  },
  {
    // Gáfico de barras de total de operaciones por Tipo Intermediario.
    name: 'tipo intermediario',
    visual: CardType.Bar,
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
      orderByFields: ['total_opif_sum DESC']
    }
  }
];
