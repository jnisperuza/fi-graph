
// @ts-ignore
import { DataSource } from 'jimu-core';
import { LocalDate } from '@js-joda/core';
import _ from 'lodash';
import { Filter, FilterType, Instrument, Data, CardData, HistoricalEvolutionData, InstrumentSubtype } from '../config';
import { capitalize, groupBy, hexColor } from './utils';

/**
 * @name getInstruments
 * @param {any[]} data 
 * @param {Filter[]} filter 
 * @returns {CardData[]}
 * @description Obtain information for Financial instruments.
 */
const getInstruments = (data: any[], filter: Filter[]): CardData[] => {
    const instrumentList = [];
    // Get year from filter | default previous year
    const year = filter.find((filter: Filter) => filter.label === 'AÑO')?.value || LocalDate.now().minusYears(1).year();
    const flatted = filter.filter((filter: Filter) => filter.filterType === FilterType.Instrument)
        .reduce((accumulator, currentValue) => accumulator.concat(currentValue.value), []);
    // Shared function
    const reduce = (key: string) => {
        const mapped = data.filter(item => item.instrumento === key && item.anio == year)
            .map(item => ({
                value: item.valor_opif,
                amount: item.total_opif,
                name: item.instrumento,
            }));
        if (mapped.length) {
            return mapped.reduce((accumulator, currentValue) => ({
                value: accumulator.value + currentValue.value,
                amount: accumulator.amount + currentValue.amount,
                name: currentValue.name,
            }))
        }
    }

    // If there are no financial instruments in the filters object
    if (!flatted.length) {
        Object.keys(Instrument).forEach((key) => {
            const reduced = reduce(Instrument[key]);
            if (reduced) {
                instrumentList.push(reduced);
            }
        });
    } else {
        // If there are financial instruments in the filters object
        flatted.map(key => {
            const reduced = reduce(key);
            if (reduced) {
                instrumentList.push(reduced);
            }
        });
    }
    return instrumentList;
}

/**
 * @name getInstrumentSubtypes
 * @param {any[]} data 
 * @param {Filter[]} filter 
 * @returns {CardData[]}
 * @description Obtain information for Financial instruments.
 */
const getInstrumentSubtypes = (data: any[], filter: Filter[]): CardData[] => {
    const instrumentSubtypeList = [];
    // Get year from filter | default previous year
    const year = filter.find((filter: Filter) => filter.label === 'AÑO')?.value || LocalDate.now().minusYears(1).year();
    const flatted = filter.filter((filter: Filter) => filter.filterType === FilterType.InstrumentSubtype)
        .reduce((accumulator, currentValue) => accumulator.concat(currentValue.value), []);
    // Shared function
    const reduce = (key: string) => {
        const mapped = data.filter(item => item.subtipo_inst === key && item.anio == year)
            .map(item => ({
                value: item.valor_opif,
                amount: item.total_opif,
                name: item.subtipo_inst,
            }));
        if (mapped.length) {
            return mapped.reduce((accumulator, currentValue) => ({
                value: accumulator.value + currentValue.value,
                amount: accumulator.amount + currentValue.amount,
                name: currentValue.name,
            }))
        }
    }

    // If there are no financial instrument subtypes in the filters object
    if (!flatted.length) {
        Object.keys(InstrumentSubtype).forEach((key) => {
            const reduced = reduce(InstrumentSubtype[key]);
            if (reduced) {
                instrumentSubtypeList.push(reduced);
            }
        });
    } else {
        // If there are financial instruments in the filters object
        flatted.map(key => {
            const reduced = reduce(key);
            if (reduced) {
                instrumentSubtypeList.push(reduced);
            }
        });
    }
    return instrumentSubtypeList;
}

/**
 * @name getHistoricalEvolution
 * @param {any[]} data 
 * @param {Filter[]} filter 
 * @returns {HistoricalEvolutionData[]}
 * @description Obtain historical evolution of financial instruments of the last two years.
 */
const getHistoricalEvolution = (data: any[], filter: Filter[]): HistoricalEvolutionData[] => {
    const historicalEvolutionList = [];
    // Get yesteryear
    const year = filter.find((filter: Filter) => filter.label === 'AÑO')?.value || LocalDate.now().minusYears(1).year();
    const yesteryear = Number(year) - 1;
    const flatted = filter.filter((filter: Filter) => filter.filterType === FilterType.Instrument)
        .reduce((accumulator, currentValue) => accumulator.concat(currentValue.value), []);
    // Shared function
    const reduce = (key: string) => {
        const mapped = data.filter(item => item.instrumento === key && item.anio == yesteryear)
            .map(item => ({
                value: item.valor_opif,
                amount: item.total_opif,
                name: item.instrumento,
            }));
        if (mapped.length) {
            return mapped.reduce((accumulator, currentValue) => ({
                value: accumulator.value + currentValue.value,
                amount: accumulator.amount + currentValue.amount,
                name: currentValue.name,
            }))
        }
    }

    // If there are no financial instruments in the filters object
    if (!flatted.length) {
        Object.keys(Instrument).forEach((key) => {
            const reduced = reduce(Instrument[key]);
            if (reduced) {
                historicalEvolutionList.push({ year: yesteryear, historicalEvolutionData: reduced });
            }
        });
    } else {
        // If there are financial instruments in the filters object
        flatted.map(key => {
            const reduced = reduce(key);
            if (reduced) {
                historicalEvolutionList.push({ year: yesteryear, historicalEvolutionData: reduced });
            }
        });
    }
    return historicalEvolutionList;
}

// Reuse the data obtained by the 'getInstruments' method as the most recent year
const mergeHistoricalEvolution = (filter: Filter[], current: CardData[], previous: HistoricalEvolutionData[]): HistoricalEvolutionData[] => {
    // Get year from filter | default previous year
    const year = filter.find((filter: Filter) => filter.label === 'AÑO')?.value || LocalDate.now().minusYears(1).year();
    const mapped = current.map(item => ({ year, historicalEvolutionData: item }));
    if (previous.length) {
        return [...previous, ...mapped] as HistoricalEvolutionData[];
    } else {
        return [];
    }
}

/**
 * @name getTerritorialDistribution
 * @param {any[]} data 
 * @param {Filter[]} filter 
 * @returns {CardData[]}
 * @description Obtener categorías y totales en grupos para distribución territorial.
 */
const getTerritorialDistribution = (data: any[], filter: Filter[]): CardData[] => {
    const territorialList = [];
    // Get year from filter | default previous year
    const year = filter.find((filter: Filter) => filter.label === 'AÑO')?.value || LocalDate.now().minusYears(1).year();
    // Shared function
    const reduce = (group: any[]) => {
        return group.reduce((accumulator, currentValue) => ({
            value: accumulator.value + currentValue.value,
            amount: accumulator.amount + currentValue.amount,
            name: currentValue.name,
        }))
    };
    const mapped = data.filter(item => item.anio == year)
        .map(item => ({
            value: item.valor_opif,
            amount: item.total_opif,
            name: capitalize(item.dpto_cnmbr),
        }));

    if (mapped.length) {
        const grouped = groupBy(mapped, 'name');
        Object.keys(grouped).map(key => {
            const reduced = reduce(grouped[key]);
            if (reduced) {
                territorialList.push(reduced);
            }
        });
    }
    const sorted = territorialList.sort((a, b) => (b.amount > a.amount) ? 1 : -1);
    // top 5
    return sorted.slice(0, 5);
}

/**
 * @name getDataByField
 * @param {any[]} data 
 * @param {Filter[]} filter 
 * @returns {CardData[]}
 */
const getDataByField = (data: any[], filter: Filter[], field: string): CardData[] => {
    const dataList = [];
    // Get year from filter | default previous year
    const year = filter.find((filter: Filter) => filter.label === 'AÑO')?.value || LocalDate.now().minusYears(1).year();
    // Shared function
    const reduce = (group: any[]) => {
        return group.reduce((accumulator, currentValue) => ({
            value: accumulator.value + currentValue.value,
            amount: accumulator.amount + currentValue.amount,
            name: currentValue.name,
        }))
    };
    const mapped = data.filter(item => item.anio == year)
        .map(item => ({
            value: item.valor_opif,
            amount: item.total_opif,
            name: item[field],
        }));

    if (mapped.length) {
        const grouped = groupBy(mapped, 'name');
        Object.keys(grouped).map(key => {
            const reduced = reduce(grouped[key]);
            if (reduced) {
                dataList.push(reduced);
            }
        });
    }
    return dataList.sort((a, b) => (b.amount > a.amount) ? 1 : -1);
}

// Principal function
export const getData = (ds: DataSource, filter: Filter[]): Data => {
    const data = ds.getRecords().map((r: any) => r.getData());
    const instruments = getInstruments(data, filter);
    const instrumentSubtypes = getInstrumentSubtypes(data, filter);
    const historicalEvolution = mergeHistoricalEvolution(filter, instruments, getHistoricalEvolution(data, filter));
    const territorialDistribution = getTerritorialDistribution(data, filter);
    const distributionChain = getDataByField(data, filter, 'cadena');
    const producerType = getDataByField(data, filter, 'tipo_productor');
    const intermediaryType = getDataByField(data, filter, 'tipo_interm');

    return {
        instruments,
        instrumentSubtypes,
        historicalEvolution,
        territorialDistribution,
        distributionChain,
        producerType,
        intermediaryType
    };
}

// Used from Card component
export const formatDataSpline = (data: HistoricalEvolutionData[]) => {
    const splineData = [];
    const groupByYear = groupBy(data, 'year');
    const years = Object.keys(groupByYear);
    const yearsData = years.map(year => groupByYear[year]);
    const majorVector = (yearsData[0]?.length > yearsData[1]?.length) ? yearsData[0] : yearsData[1];

    // Add axis
    years.unshift('x');
    if (majorVector?.length) {
        majorVector.forEach((item: any) => {
            const instrument = item.historicalEvolutionData.name;
            const instrumentYear1 = yearsData[0].find((year: any) => year.historicalEvolutionData.name === instrument);
            const instrumentYear2 = yearsData[1].find((year: any) => year.historicalEvolutionData.name === instrument);

            splineData.unshift([
                instrument,
                instrumentYear1?.historicalEvolutionData?.value || 0,
                instrumentYear2?.historicalEvolutionData?.value || 0
            ]);
        });
        // Add years
        splineData.unshift(years);
        return splineData;
    } else {
        return [];
    }
}

// Used from Card component
export const formatDataMultiserie = (data: HistoricalEvolutionData[]) => {
    const splineData = [];
    const groupByYear = groupBy(data, 'year');
    const years = Object.keys(groupByYear);
    const yearsData = years.map(year => groupByYear[year]);
    const majorVector = (yearsData[0]?.length > yearsData[1]?.length) ? yearsData[0] : yearsData[1];

    // Add axis
    years.unshift('Years');
    if (majorVector?.length) {
        majorVector.forEach((item: any) => {
            const instrument = item.historicalEvolutionData.name;
            // Current year vs previous year
            const instrumentYear1 = yearsData[0].find((year: any) => year.historicalEvolutionData.name === instrument);
            const instrumentYear2 = yearsData[1].find((year: any) => year.historicalEvolutionData.name === instrument);

            splineData.unshift([
                instrument,
                instrumentYear1?.historicalEvolutionData?.value || 0,
                instrumentYear2?.historicalEvolutionData?.value || 0
            ]);
        });
        // Add years
        splineData.unshift(years);
        return splineData;
    } else {
        return [];
    }
}

// Used from Card component
export const formatDataPie = (data: CardData[]) => {
    if (data?.length) {
        const header = ['Departamento', 'Total operaciones'];
        const mapped = data.map(item => ([item.name, item.amount]));
        mapped.unshift(header);
        return mapped;
    } else {
        return [];
    }
}

// Used from Card component
export const formatDataBar = (data: CardData[]) => {
    if (data?.length) {
        const header = ['Cadena', 'Total operaciones', { role: 'style' }];
        const mapped = data.map(item => ([item.name, item.amount, hexColor()]));
        mapped.unshift(header as any);
        return mapped;
    } else {
        return [];
    }
}