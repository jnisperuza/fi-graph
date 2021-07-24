import { ImmutableObject } from 'seamless-immutable';
// @ts-ignore
import { React, FeatureLayerQueryParams } from 'jimu-core';
import { LocalDate } from '@js-joda/core';

export interface State {
  query: FeatureLayerQueryParams;
  wrapperFilterStatusRef: React.RefObject<HTMLDivElement>;
  refresh: boolean;
  filters: Filter[];
  filterStatus: string[];
}

export type IMWidgetState = ImmutableObject<State>;

export enum Instrument {
  Credit = 'CREDITO',
  Fag = 'FAG',
  Lec = 'LEC',
  Isa = 'ISA',
  Icr = 'ICR',
  Mfr = 'MFR',
  Cif = 'CIF',
}

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
  InstrumentSubtype = 'SUBTIPO',
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
  value: string | string[] | Instrument[];
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
  instruments?: CardData[];
  instrumentSubtypes?: CardData[];
  historicalEvolution?: HistoricalEvolutionData[];
  territorialDistribution?: CardData[];
  distributionChain?: CardData[];
  producerType?: CardData[];
  intermediaryType?: CardData[];
}

export const PAGE_SIZE = 10000;

export const SHORT_MONTH_NAMES = {
  1: 'Ene',
  2: 'Feb',
  3: 'Mar',
  4: 'Abr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Ago',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dic'
}

export const DEFAULT_FILTER = [
  {
    filterType: FilterType.Instrument,
    value: [
      'CREDITO',
      'FAG',
      'LEC',
      'ISA',
      'ICR',
      'MFR',
      'CIF'
    ],
  },
  {
    filterType: FilterType.Instrument,
    label: 'SUBTIPO',
    value: [
      'CIF CONTRATOS',
      'CRED COLOCACIONES',
      'CRED SALDOS',
      'FAG EXPEDIDAS',
      'FAG PAGADAS',
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
    value: String(LocalDate.now().minusYears(1).year()),
  },
  // {
  //   filterType: FilterType.Period,
  //   label: 'SEMESTRE',
  //   value: [
  //     'SEMESTRE 1'
  //   ],
  // },
  // {
  //   filterType: FilterType.Period,
  //   label: 'TRIMESTRE',
  //   value: [
  //     'TRIMESTRE 1'
  //   ],
  // },
  {
    filterType: FilterType.Period,
    label: 'MES',
    value: [
      '2'
    ],
  },
  // {
  //   filterType: FilterType.Territory,
  //   label: 'DEPARTAMENTO',
  //   value: [
  //     'CUNDINAMARCA'
  //   ],
  // },
  // {
  //   filterType: FilterType.Territory,
  //   label: 'MUNICIPIO',
  //   value: [
  //     'FUSAGASUGA'
  //   ],
  // }
];

export const STANDARDIZATION_FILTER_FIELDS = {
  /**
   * INSTRUMENT
   * The field for instrument is 'string' by default, but the filter has no label
   */
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

export const STANDARDIZATION_TEXT_INSTRUMENTS = {
  CREDITO: {
    normal: 'Colocaciones',
    bold: 'Crédito',
    key: Instrument.Credit
  },
  FAG: {
    normal: 'Certificados',
    bold: 'FAG',
    key: Instrument.Fag
  },
  LEC: {
    normal: 'Colocaciones',
    bold: 'LEC',
    key: Instrument.Lec,
  },
  ISA: {
    normal: 'Pólizas',
    bold: 'ISA',
    key: Instrument.Isa,
  },
  ICR: {
    normal: 'Cuentas',
    bold: 'ICR',
    key: Instrument.Icr,
  },
  MFR: {
    normal: 'Créditos',
    bold: 'MFR',
    key: Instrument.Mfr,
  },
  CIF: {
    normal: 'Contratos',
    bold: 'CIF',
    key: Instrument.Cif,
  },
}

export const STANDARDIZATION_TEXT_INSTRUMENT_SUBTYPES = {
  'CIF CONTRATOS': {
    normal: 'Subtipo',
    bold: 'CIF Contratos',
    key: InstrumentSubtype.CifContratos
  },
  'CRED COLOCACIONES': {
    normal: 'Subtipo',
    bold: 'CRED Colocaciones',
    key: InstrumentSubtype.CredColocaciones
  },
  'CRED SALDOS': {
    normal: 'Subtipo',
    bold: 'CRED Saldos',
    key: InstrumentSubtype.CredSaldos
  },
  'FAG EXPEDIDAS': {
    normal: 'Subtipo',
    bold: 'FAG Expedidas',
    key: InstrumentSubtype.FagExpedidas
  },
  'FAG PAGADAS': {
    normal: 'Subtipo',
    bold: 'FAG Pagadas',
    key: InstrumentSubtype.FagPagadas
  },
  'FAG VIGENTES': {
    normal: 'Subtipo',
    bold: 'FAG Vigentes',
    key: InstrumentSubtype.FagVigentes
  },
  'ICR PROYECTOS': {
    normal: 'Subtipo',
    bold: 'ICR Proyectos',
    key: InstrumentSubtype.IcrProyectos
  },
  'ISA POLIZAS': {
    normal: 'Subtipo',
    bold: 'ISA Polizas',
    key: InstrumentSubtype.IsaPolizas
  },
  'LEC COLOCACIONES': {
    normal: 'Subtipo',
    bold: 'LEC Colocaciones',
    key: InstrumentSubtype.LecColocaciones
  },
  'MFR OPERACIONES': {
    normal: 'Subtipo',
    bold: 'MFR Operaciones',
    key: InstrumentSubtype.MfrOperaciones
  },
}

export const DEFAULT_INSTRUMENTS = [
  ...Object.keys(Instrument).map(key =>
    STANDARDIZATION_TEXT_INSTRUMENTS[Instrument[key]]
  ),
  ...Object.keys(InstrumentSubtype).map(key =>
    STANDARDIZATION_TEXT_INSTRUMENT_SUBTYPES[InstrumentSubtype[key]]
  )
]
