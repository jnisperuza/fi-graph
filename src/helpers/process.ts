import Highcharts from 'highcharts';
import { CardOptions } from "../components/Card/config";
import { DatasourceResponse, DB_FIELDS, Filter, FilterList, FilterType, Hide, LOGICAL_OPERATORS, PeriodData, Query, QueryData, State } from "../config";
import { groupBy, SHORT_MONTH_NAMES, stringFormat } from "./utils";

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
                    where += `${filter.field}=${value} ${_index + 1 !== filterList[key].length ? 'or' :
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

export const cleanWhere = (where: string, whereFields: string[]): string => {
    if (!whereFields?.length) return where;
    const broken = where.split(/\b(?:or|and)\b/gi);
    // Compare where fields
    broken.forEach((item: string) => {
        whereFields.forEach((wf: string) => {
            if (item.includes(wf)) {
                LOGICAL_OPERATORS.forEach((operator: string) => {
                    where = where.replace(`${item.trim()} ${operator}`, '');
                    where = where.trim();
                });
                where = where.replace(item.trim(), '');
            }
        });
    });
    // Clean the end of the text
    LOGICAL_OPERATORS.forEach(operator => {
        const finalChunk = where.substring(where.length - 6, where.length);
        if (finalChunk.includes(` ${operator} `)) {
            where = where.replace(` ${operator} `, '');
        }
        else if (finalChunk.includes(` ${operator}`)) {
            where = where.replace(` ${operator}`, '');
        }
        else if (finalChunk.includes(`${operator} `)) {
            where = where.replace(`${operator} `, '');
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
                const { xFieldLabel, customFieldLabel, customField } = tooltipConfig;
                if (xFieldLabel && customFieldLabel && customField) {
                    return `<b>${this.x}</b> <br>
                    ${xFieldLabel} ${Highcharts.numberFormat(this.y, 0)} <br>
                    ${customFieldLabel} ${Highcharts.numberFormat(this.point.custom[customField], 0)}`;
                } else {
                    return `<b>${this.x}:</b> ${Highcharts.numberFormat(this.y, 0)}`;
                }
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

export const groupDataGraph = (data: any, fieldCategory: string, fieldSerie: string, yField: string) => {
    const groupCategory = groupBy(data, fieldCategory);
    const categories = Object.keys(groupCategory).map((key: string) => key);

    const groupSerie = groupBy(data, fieldSerie);
    const series = Object.keys(groupSerie).map(serie => ({
        name: serie, data: groupSerie[serie].map((item: any) => ({ y: item[yField], custom: item }))
    }));
    return { categories, series }
}

export const formatDataMultiserie = (options: CardOptions, data: any) => {
    const { fieldCategory, fieldSerie, tooltipConfig, serieConfig } = options;
    const response = { categories: [], series: [], tooltip: {} }

    if (fieldCategory && fieldSerie && serieConfig && data) {
        const { categories, series } = groupDataGraph(data, fieldCategory, fieldSerie, serieConfig[0].yField);
        const tooltip = {
            formatter: function () {
                const { titleField, xFieldLabel, customFieldLabel, customField } = tooltipConfig;
                if (titleField && xFieldLabel && customFieldLabel && customField) {
                    return `<b>${this.point.custom[titleField]}</b> <br>
                    ${xFieldLabel} ${Highcharts.numberFormat(this.y, 0)} <br>
                    ${customFieldLabel} ${Highcharts.numberFormat(this.point.custom[customField], 0)}`;
                } else {
                    return `<b>${this.x}:</b> ${Highcharts.numberFormat(this.y, 0)}`;
                }
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
                const { xFieldLabel, customFieldLabel, customField } = tooltipConfig;
                if (xFieldLabel && customFieldLabel && customField) {
                    return `<b>${this.point.name}:</b> ${Highcharts.numberFormat(this.percentage, 2)}% <br>
                    ${xFieldLabel} ${Highcharts.numberFormat(this.point.y, 0)} <br>
                    ${customFieldLabel} ${Highcharts.numberFormat(this.point.custom[customField], 0)}`;
                } else {
                    return `<b>${this.point.name}:</b> ${Highcharts.numberFormat(this.point.y, 0)}`;
                }
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
                return last.value.map((month: string | number) => SHORT_MONTH_NAMES[month]);
            } else {
                return SHORT_MONTH_NAMES[last.value];
            }
        // TERRITORY
        case 'pdet':
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
            return last.value;
    }
}

export const formatPredefinedWhere = (querySchema: Query, state: State) => {
    if (!querySchema.queryVars?.length) return '';
    let data = {};
    querySchema.queryVars.forEach((queryVar: string) => {
        let tempData: any;
        const stateVarLevels = queryVar.split('.');

        stateVarLevels.forEach((stateVar: string, index: number) => {
            const itemIndex = Number(stateVar);
            if (index === 0) {
                tempData = state[stateVar];
            } else {
                if (itemIndex !== NaN && tempData instanceof Array) {
                    const value = tempData[itemIndex];
                    if (value) {
                        tempData = value;
                    }
                } else {
                    const value = tempData[stateVar];
                    if (value) {
                        tempData = value;
                    }
                }
            }
            if (tempData && !(tempData instanceof Array)) {
                if (tempData) {
                    data = { ...data, ...tempData };
                }
            }

        });
    });
    return stringFormat(querySchema.query.where, data) || '';
}

export const getPeriodLabels = (periodData: PeriodData[]): string[] => {
    if (!periodData.length) return [];
    const mostRecentYear = Math.max.apply(Math, periodData.map((item) => item.anio));
    const mostRecentData = periodData.filter((item) => item.anio === mostRecentYear);
    // Descendent order (max -> min)
    const first = mostRecentData[0];
    const last = mostRecentData[mostRecentData.length - 1];
    const labels = [`${first.anio}`, `${SHORT_MONTH_NAMES[last.mes]} - ${SHORT_MONTH_NAMES[first.mes]}`];
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

    if (withRuleHide?.length) {
        withRuleHide.forEach(query => {
            query.cardConfig.hide.forEach((rule: Hide) => {
                const found = filters.find(
                    filter => filter[rule.field] === rule.value && (filter.value instanceof Array ? filter.value?.length : filter.value)
                );
                if (found) {
                    const alreadyExists = toRemove.find(_query => JSON.stringify(_query) === JSON.stringify(query));
                    if (!alreadyExists) {
                        toRemove.push(query);
                    }
                }
            });
        });
    }

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

export const unionCardData = (queryDataDashboard: any[]) => {
    const toUnite = queryDataDashboard
        .filter(item => item.cardConfig?.unionCard)
        .map(item => ({ unionId: item.cardConfig.unionCard.id, item }));

    const cardType = toUnite?.[0]?.item?.cardConfig?.type;
    const groupByUnionId = groupBy(toUnite, 'unionId');
    const unifiedData = Object.keys(groupByUnionId).map(key => {
        const group = groupByUnionId[key];
        if (group instanceof Array) {
            return group.map(card => {
                try {
                    const { field, value } = card.item.cardConfig.unionCard;
                    if (field && value) {
                        const found = card.item.data.find((row: any) => row[field] === value);
                        if (found) {
                            return {
                                name: card.item.name,
                                amount: found.total_opif_sum,
                                value: found.valor_opif_sum
                            }
                        }
                    }
                } catch (error) { }
            });
        }
    }).filter(row => row.filter(item => item).length);

    return unifiedData.map(group => {
        const name = group.map(gp => gp?.name).join(', ');
        return { name, type: cardType, data: group }
    });
}