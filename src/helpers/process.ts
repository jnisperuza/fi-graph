import Highcharts from 'highcharts';
import { CardOptions } from "../components/Card/config";
import { DatasourceResponse, DB_FIELDS, Filter, FilterList, FilterType } from "../config";
import { groupBy, SHORT_MONTH_NAMES } from "./utils";

const getDBField = (identifiers: Filter[], value: string) => {
    const found = identifiers.find(
        item => String(value).includes(String(item.value)) || String(item.value).includes(String(value))
    );
    if (found) {
        return DB_FIELDS[found.label];
    }
}

const formatFilterList = (identifiers: Filter[], flatted: string[]) => {
    const identified = flatted.map(item => ({ ...getDBField(identifiers, item), value: item }))
    // Grouped for 'field' property can use 'OR' sentence
    return groupBy(identified, 'field');
}

// Unify filters by type
export const unifyFilters = (filters: Filter[]) => {
    // Contains the unification of filters by type 
    const listFlatted: FilterList[] = [];
    const identifiers: Filter[] = [];
    // Flat the filter list
    filters.forEach(filter => {
        const found = listFlatted.find(flatted => flatted.filterType === filter.filterType);
        // Prevent duplicates
        if (!found) {
            // Search for each filterType and build a single array
            const flatted: string[] = filters.filter((_filter: Filter) => _filter.filterType === filter.filterType)
                .reduce((accumulator, currentValue) => {
                    identifiers.push(currentValue);
                    return accumulator.concat(currentValue.value);
                }, []);
            // Add item
            listFlatted.push({
                filterType: filter.filterType,
                // Add database properties
                filterList: formatFilterList(identifiers, flatted)
            });
        }
    });
    return listFlatted;
}

export const where = (filterList: Filter[]) => {
    let where = '';
    Object.keys(filterList).forEach((key: string, index: number) => {
        // All items should are arrays
        if (filterList[key] instanceof Array) {
            filterList[key].forEach((filter: Filter, _index: number) => {
                const value = filter.type === 'number' ? filter.value : `'${filter.value}'`;
                where += `${filter.field} = ${value} ${_index + 1 !== filterList[key].length ? 'or' :
                    (index + 1 !== Object.keys(filterList).length ? 'and' : '')} `;
            });
        } else {
            // fallback action
            where = '1=1';
        }
    });
    return where.trim();
}

export const getData = (response: DatasourceResponse) => {
    if (!response) return [];
    return response.records.map((r: any) => r.getData());
}

// Only works for 'Columns' Bar chart
export const formatDataBar = (options: CardOptions, data: any) => {
    const { fieldCategory, serieConfig, tooltipConfig } = options;
    const response = { categories: [], series: [], tooltip: {} };

    if (fieldCategory && serieConfig && data) {
        const categories = data.map((item: any) => item[fieldCategory]);
        const series = serieConfig.map(serie => ({
            name: serie.name, data: data.map((item: any) => ({ y: item[serie.yField], custom: item }))
        }));
        const tooltip = {
            formatter: function () {
                return `<b>${this.x}</b> <br>
                ${tooltipConfig.xFieldLabel} ${Highcharts.numberFormat(this.y, 0)} <br>
                ${tooltipConfig.customFieldLabel} ${Highcharts.numberFormat(this.point.custom[tooltipConfig.customField], 0)}`;
            }
        }

        response.categories = categories;
        response.series = series;
        response.tooltip = tooltip;
        return response;
    } else {
        return response;
    }
}

export const formatDataMultiserie = (data: any) => {
    return data;
}

export const formatDataPie = (options: CardOptions, data: any) => {
    const { fieldCategory, serieConfig, tooltipConfig } = options;
    const response = { series: [], tooltip: {} };

    if (fieldCategory && serieConfig && data) {
        const series = serieConfig.map(serie => ({
            name: serie.name, data: data.map((item: any) => ({ y: item[serie.yField], name: item[fieldCategory], custom: item }))
        }));
        const tooltip = {
            formatter: function () {
                return `<b>${this.point.name}</b> <br>
                ${tooltipConfig.xFieldLabel} ${Highcharts.numberFormat(this.point.y, 0)} <br>
                ${tooltipConfig.customFieldLabel} ${Highcharts.numberFormat(this.point.custom[tooltipConfig.customField], 0)}`;
            }
        }

        response.series = series;
        response.tooltip = tooltip;
        return response;
    } else {
        return response;
    }
}

export const getPeriodLabels = (filter: Filter[]) => {
    const periodFilter = filter.filter(filter => filter.filterType === FilterType.Period);
    if (periodFilter.length) {
        const last = periodFilter[periodFilter.length - 1];

        if (last.label === 'MES') {
            return Array.from(last.value).map(month => SHORT_MONTH_NAMES[month]).toString();
        }
        return last.value.toString();
    }
}

export const getTerritoryLabels = (filter: Filter[]): string[] => {
    const territoryFilter = filter.filter(filter => filter.filterType === FilterType.Territory);
    const labels = ['Colombia'];
    // Get the last two territory filters
    if (territoryFilter.length) {
        const lastTerritoryValues = territoryFilter[territoryFilter.length - 1].value;
        if (lastTerritoryValues.length) {
            const last = lastTerritoryValues[lastTerritoryValues.length - 1];
            labels.push(last);
        }
    }
    if (territoryFilter.length > 1) {
        const penultimateTerritoryValues = territoryFilter[territoryFilter.length - 2].value;
        if (penultimateTerritoryValues.length) {
            const penultimate = penultimateTerritoryValues[penultimateTerritoryValues.length - 1];
            labels.push(penultimate);
            // Remove the first item, this array allow two items
            labels.shift();
        }
    }
    return labels;
}