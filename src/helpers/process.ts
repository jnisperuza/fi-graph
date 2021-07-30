import Highcharts from 'highcharts';
import { CardOptions } from "../components/Card/config";
import { DatasourceResponse, DB_FIELDS, Filter, FilterList, FilterType, Hide, InitialData, Query } from "../config";
import { groupBy, SHORT_MONTH_NAMES } from "./utils";

const getDBField = (identifiers: Filter[], value: string) => {
    const found = identifiers.find(
        item => String(value).includes(String(item.value)) || String(item.value).includes(String(value))
    );
    if (found) {
        return DB_FIELDS[found.field];
    }
}

const formatFilterList = (identifiers: Filter[], flatted: string[]) => {
    const identified = flatted.map(item => ({ ...getDBField(identifiers, item), value: item }));
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
                    const isArray = currentValue.value instanceof Array;
                    // validate that the filters are not empty
                    if (
                        (isArray && currentValue.value.length) ||
                        (!isArray && currentValue.value)
                    ) {
                        identifiers.push(currentValue);
                        return accumulator.concat(currentValue.value);
                    } else {
                        return accumulator;
                    }
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
                if (filter.value) {
                    const value = filter.type === 'number' ? filter.value : `'${filter.value}'`;
                    where += `${filter.field} = ${value} ${_index + 1 !== filterList[key].length ? 'or' :
                        (index + 1 !== Object.keys(filterList).length ? 'and' : '')} `;
                }
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

// Only works for Bar chart
export const formatDataBar = (options: CardOptions, data: any) => {
    const { fieldCategory, serieConfig, tooltipConfig } = options;
    const response = { categories: [], series: [], tooltip: {} }

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

export const groupDataGraph = (data: any, groupByField: string, yField: string) => {
    const groupedData = groupBy(data, groupByField);
    const categories = Object.keys(groupedData).map((key: string) => key);
    const series = Object.keys(groupedData).map(serie => ({
        name: serie, data: groupedData[serie].map((item: any) => ({ y: item[yField], custom: item }))
    }));
    return { categories, series }
}

export const formatDataMultiserie = (options: CardOptions, data: any) => {
    const { fieldCategory, tooltipConfig, serieConfig, formatConfig } = options;
    const response = { categories: [], series: [], tooltip: {} }

    if (fieldCategory && serieConfig && formatConfig && data) {
        const { categories, series } = groupDataGraph(data, formatConfig.groupByField, serieConfig[0].yField);
        // const groupedData = groupBy(data, formatConfig.groupByField);
        // const categories = Object.keys(groupedData).map((key: string) => key);
        // const series = Object.keys(groupedData).map(serie => ({
        //     name: serie, data: groupedData[serie].map((item: any) => ({ y: item[serieConfig[0].yField], custom: item }))
        // }));
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

export const formatDataPie = (options: CardOptions, data: any) => {
    const { fieldCategory, serieConfig, tooltipConfig } = options;
    const response = { series: [], tooltip: {} }

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

export const formatFilterStatus = (last: Filter) => {
    switch (last.field) {
        // PERIOD
        case 'mes':
            if (last.value instanceof Array) {
                return last.value.map((month: string | number) => SHORT_MONTH_NAMES[month]).toString();
            } else {
                return SHORT_MONTH_NAMES[last.value];
            }
        // TERRITORY
        case 'mfront':
        case 'zrc':
        case 'mzeii':
        case 'zomac':
            if (last.value instanceof Array) {
                return last.value.map((item: string) => `${last.label} (${item})`);
            } else {
                return [`${last.label} (${last.value})`];
            }
        default:
            if (last.value instanceof Array) {
                return last.value.toString();
            } else {
                return last.value;
            }
    }
}

export const getPeriodLabels = (filter: Filter[], initialData: InitialData[]): string[] => {
    const periodFilter = filter.filter(
        filter => filter.filterType === FilterType.Period && (filter.value instanceof Array ? filter.value?.length : filter.value)
    );
    const currentYear = initialData?.length ? Math.max.apply(Math, initialData.map((item) => item.anio)) : (new Date().getFullYear() - 1);
    const labels = [currentYear];
    // Get the last two territory filters
    if (periodFilter.length) {
        const lastPeriodFilter = formatFilterStatus(periodFilter[periodFilter.length - 1]);
        // Prevent duplicates
        const valueAlreadyExists = labels.find(label => label == lastPeriodFilter);
        if (!valueAlreadyExists && lastPeriodFilter) {
            labels.unshift(lastPeriodFilter);
        }
    }
    if (periodFilter.length > 1) {
        const penultimatePeriodFilter = formatFilterStatus(periodFilter[periodFilter.length - 2]);
        if (penultimatePeriodFilter) {
            labels.unshift(penultimatePeriodFilter);
            // Remove the first item, this array allow two items
            labels.pop();
        }
    }
    return labels;
}

export const getTerritoryLabels = (filter: Filter[]): string[] => {
    const territoryFilter = filter.filter(
        filter => filter.filterType === FilterType.Territory && (filter.value instanceof Array ? filter.value?.length : filter.value)
    );
    const labels = ['Colombia'];
    // Get the last two territory filters
    if (territoryFilter.length) {
        const lastTerritoryValues = formatFilterStatus(territoryFilter[territoryFilter.length - 1]);
        if (lastTerritoryValues) {
            labels.push(lastTerritoryValues);
        }
    }
    if (territoryFilter.length > 1) {
        const penultimateTerritoryValues = formatFilterStatus(territoryFilter[territoryFilter.length - 2]);
        if (penultimateTerritoryValues) {
            labels.push(penultimateTerritoryValues);
            // Remove the first item, this array allow two items
            labels.shift();
        }
    }
    return labels;
}

export const applyRules = (queries: Query[], filters: Filter[]): Query[] => {
    // Clear result
    const removeDuplicatesId = (array: Query[]) => {
        const result: Query[] = [];
        array.forEach(item => {
            // check if it already exists in the new array, only the first one added with that Id should remain
            const found = result.find(_item => _item?.cardConfig?.id === item.cardConfig?.id);
            if (!found) {
                result.push(item);
            }
        });
        return result;
    }
    const toRemove = [];
    const withRuleHide = queries.filter(query => query.cardConfig?.hide);
    withRuleHide.forEach(query => {
        query.cardConfig.hide.forEach((rule: Hide) => {
            const found = filters.find(filter => filter[rule.field] === rule.value);
            if (found) {
                const alreadyExists = toRemove.find(_query => JSON.stringify(_query) === JSON.stringify(query));
                if (!alreadyExists) {
                    toRemove.push(query);
                }
            }
        });
    });
    // If it does not find any queries to remove, the deduplication is applied directly to the array 'queries'
    if (!toRemove.length) {
        // It is validated if there are elements with repeated configuration Id, to leave the first one
        return removeDuplicatesId(queries);
    } else {
        // A new list is obtained from the array 'queries', excluding those that correspond
        const withRulesApplied = queries.filter(
            _query => JSON.stringify(_query) !== JSON.stringify(toRemove.find(query => JSON.stringify(_query) === JSON.stringify(query)))
        );
        // It is validated if there are elements with repeated configuration Id, to leave the first one
        return removeDuplicatesId(withRulesApplied);
    }
}