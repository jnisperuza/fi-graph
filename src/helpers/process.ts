import { DatasourceResponse, DB_FIELDS, Filter, FilterList } from "../config";
import { groupBy } from "./utils";

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