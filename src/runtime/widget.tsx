/** @jsx jsx */
import {
  React,
  AllWidgetProps,
  jsx,
  DataSourceManager,
  DataSourceComponent,
  DataSource,
  FeatureLayerDataSource,
  IMDataSourceInfo,
  IMState
  // @ts-ignore
} from 'jimu-core';

import {
  IMWidgetState,
  WidgetState,
  Filter,
  FilterType,
  DEFAULT_INSTRUMENTS,
  STANDARDIZATION_TEXT_INSTRUMENTS,
  DEFAULT_FILTER,
  STANDARDIZATION_FILTER_FIELDS,
  Data,
  PAGE_SIZE,
  SHORT_MONTH_NAMES,
  STANDARDIZATION_TEXT_INSTRUMENT_SUBTYPES
} from '../config';

import FilterStatus from '../components/FilterStatus/FilterStatus';
import Card from '../components/Card/Card';
import { CardType, TitleCard } from '../components/Card/config';
import { getData } from '../helpers/process';
import { groupBy } from '../helpers/utils';

import "./widget.scss";
import { LocalDate } from '@js-joda/core';
import { filter } from 'lodash-es';


const flatInstrumentFilter = (data: Filter[]) => {
  if (!data?.length) return [];
  // Filter
  const flatted = data.filter((filter: Filter) => filter.filterType === FilterType.Instrument)
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue.value), []);
  // Normalize
  const normalized = flatted.map(key => STANDARDIZATION_TEXT_INSTRUMENTS[key] || STANDARDIZATION_TEXT_INSTRUMENT_SUBTYPES[key]);
  return normalized.length ? normalized : [];
}

const addFieldToFilter = (filters: Filter[]) => {
  if (!filters?.length) return;
  return filters.map(filter => {
    const sfFields = STANDARDIZATION_FILTER_FIELDS[filter.label];
    filter.field = sfFields?.field || 'instrumento';
    filter.type = sfFields?.type || 'string';
    return filter;
  });
}

const isFullWidth = (data: string[], position: number): boolean => {
  return data?.length === position + 1 &&
    data?.length % 2 !== 0;
}

const getTerritoryLabels = (filter: Filter[]): string[] => {
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

const getPeriodLabels = (filter: Filter[]): string[] => {
  // Get year from filter | default previous year
  const year = filter.find((filter: Filter) => filter.label === 'AÑO')?.value || LocalDate.now().minusYears(1).year();
  const periodFilter = filter.filter(filter => filter.filterType === FilterType.Period);
  const labels = [];
  if (periodFilter.length) {
    const last = periodFilter[periodFilter.length - 1];
    // Format month
    if (last.field === 'mes') {
      const month = SHORT_MONTH_NAMES[Number(last.value)];
      labels.push(month);
    } else {
      labels.push(last.value.slice(0, 4));
    }
  }
  labels.push(year);
  return labels;
}

const hasFilterDepartment = (filter: Filter[]) => {
  if (!filter?.length) return;
  return filter.find((filter: Filter) => filter.label === 'DEPARTAMENTO');
}

export default class Widget extends React.PureComponent<AllWidgetProps<{}> & { widgetState: WidgetState }, IMWidgetState> {

  [x: string]: any;
  state = {
    query: null,
    refresh: false,
    wrapperFilterStatusRef: React.createRef<HTMLDivElement>(),
    filters: [],
    filterStatus: []
  };

  constructor(props: any) {
    super(props);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
  }

  // getOriginDataSource() {
  //   return DataSourceManager.getInstance().getDataSource(this.props.useDataSources?.[0]?.dataSourceId)
  // }

  componentDidMount() {
    this.query();
  }

  componentWillReceiveProps() {
    // Time to wait for redux to update
    setTimeout(() => {
      // Update query (where)
      this.query();
      this.setState({ refresh: true });
    });
  }

  handleRemoveFilter(filter: string) {
    const { filters } = this.props?.widgetState;
    const found = filters.find(item => {
      console.log(item.value, filter);
      return item.value.includes(filter);
    });
    console.log(found);
    this.props.dispatch({
      type: 'CLEAR_FILTERS',
      val: [filter]
    });
  }

  /**
   * Map the state your widget needs
   * @param state
   */
  static mapExtraStateProps(state: IMState) {
    return { widgetState: state.widgetState };
  }

  where = () => {
    const filters = addFieldToFilter(this.props?.widgetState?.filters) ||
      addFieldToFilter(DEFAULT_FILTER);

    // Update state
    this.setState({ filters });

    let where = '';
    filters.forEach((filter, index) => {
      if (filter.value instanceof Array) {
        filter.value.forEach((item, _index) => {
          const value = filter.type === 'number' ? item : `'${item}'`;
          where += `${filter.field} = ${value} ${_index + 1 !== filter.value.length ? 'or' : (index + 1 !== filters.length ? 'and' : '')} `;
        });
      } else {
        const value = filter.type === 'number' ? filter.value : `'${filter.value}'`;
        where += `${filter.field} = ${value} ${index + 1 !== filters.length ? 'and' : ''} `;
      }
    });

    // Update where with years
    const xplode = where.split('anio =');
    if (xplode.length) {
      where = 'anio <=' + xplode[1];
    }
    return where;
  }

  query = () => {
    if (!this.isDsConfigured()) {
      return;
    }

    this.setState({
      query: {
        where: this.where(),
        outFields: ['*'],
        pageSize: PAGE_SIZE
      }
    });
  }

  isDsConfigured = () => {
    return this.props.useDataSources?.length;
  }

  getInlineStyle() {
    if (this.state.wrapperFilterStatusRef?.current) {
      const { height } = this.state.wrapperFilterStatusRef.current.getBoundingClientRect();
      const HEADER_HEIGHT = 100;
      return {
        gridTemplateRows: `${height + HEADER_HEIGHT}px 1fr`
      };
    }
  }

  // getInstruments() {
  //   const ds = this.getOriginDataSource()
  //   return ds.query({ where: "instrumento='CREDITO'", outFields: ['instrumento', 'total_opif', 'valor_opif'] });
  // }

  renderErrorMessage() {
    return (
      <div className="error-message">
        <span>Please, configure the data source</span>
      </div>
    )
  }

  renderCards(loading: boolean, data: Data) {
    const { filters } = this.props.widgetState;
    const instrumentFilters = flatInstrumentFilter(filters);
    const instrumentCards = instrumentFilters.length ? instrumentFilters : DEFAULT_INSTRUMENTS;
    const fs = filters?.length && filters.map((filter: Filter) => filter.label).filter((filter: string) => filter) || [];
    // Get years for subtitle Spline chart
    const groupByYear = groupBy(data.historicalEvolution, 'year');
    const years = Object.keys(groupByYear);

    // this.getInstruments().then((res) => {
    //   console.log(res.records.map((r: any) => r.getData()));
    // });

    // Update badge list for FilterStatus component
    this.setState({
      filterStatus: [
        ...fs,
        ...instrumentFilters.map(item => item.bold)
      ]
    });

    return (
      <>
        {instrumentCards.map((title: TitleCard, index: number) => {
          const instrumentData = data.instruments.find((item: any) => item.name === title.key);
          const instrumentSubtypeData = data.instrumentSubtypes.find((item: any) => item.name === title.key);
          return (
            <Card
              type={CardType.Amount} loading={loading}
              data={instrumentData || instrumentSubtypeData}
              options={{
                fullWidth: isFullWidth(instrumentCards, index),
                title
              }} />
          )
        })}

        <Card
          type={CardType.Multiserie}
          loading={loading}
          data={data.historicalEvolution}
          options={{
            fullWidth: true,
            title: { normal: 'Periodo de', bold: 'Tiempo' },
            subtitle: { normal: 'Instrumentos financieros', bold: years.join(' - ') }
          }} />

        {!hasFilterDepartment(this.state.filters) && (
          <Card
            type={CardType.Bar}
            loading={loading}
            data={data.territorialDistribution}
            options={{
              fullWidth: true,
              title: { normal: 'Top 5', bold: 'Departamentos' }
            }} />
        )}

        <Card
          type={CardType.Bar}
          loading={loading}
          data={data.distributionChain}
          options={{
            fullWidth: true,
            title: { normal: 'Distribución', bold: 'De Cadena' }
          }} />

        <Card
          type={CardType.Pie}
          loading={loading}
          data={data.producerType}
          options={{
            fullWidth: true,
            title: { normal: 'Características', bold: 'Productor' }
          }} />

        <Card
          type={CardType.Bar}
          loading={loading}
          data={data.intermediaryType}
          options={{
            fullWidth: true,
            title: { normal: 'Tipo de', bold: 'Intermediario' }
          }} />
      </>
    )
  }

  renderComponent = (ds: DataSource, info: IMDataSourceInfo) => {
    const loading = info.status === 'UNLOADED' || info.status === 'LOADING';
    const data = getData(ds, this.state.filters);
    const territoryLabels = getTerritoryLabels(this.state.filters);
    const periodLabels = getPeriodLabels(this.state.filters);

    this.setState({ refresh: false });
    return (
      <div className="fi-graph" style={this.getInlineStyle()}>
        {loading && (
          <div className="wrapper-preloader">
            <div className="preloader" />
          </div>
        )}
        <header>
          <div className="right-wrapper">
            {territoryLabels.map((label: string, index: number) => (
              <h1 title={label} className={territoryLabels.length - 1 !== index ? 'small' : ''}>
                {label}
              </h1>
            ))}
          </div>
          <h2 title={periodLabels.join(' - ')}>
            {periodLabels.join(' - ')}
          </h2>
          <div className="wrapper-filter-status" ref={this.state.wrapperFilterStatusRef}>
            <FilterStatus removeFilter={this.handleRemoveFilter} filters={this.state.filterStatus} />
          </div>
        </header>
        <main className={`${loading ? 'loading' : ''}`}>
          {
            !this.isDsConfigured() ?
              this.renderErrorMessage() : this.renderCards(loading, data)
          }
        </main>
      </div>
    )
  }

  render() {
    // Validate DataSource
    if (!this.isDsConfigured())
      return this.renderErrorMessage();

    return (
      <DataSourceComponent
        useDataSource={this.props.useDataSources[0]}
        query={this.state.query}
        widgetId={this.props.id}
        refresh={this.state.refresh}
      >
        {this.renderComponent}
      </DataSourceComponent>
    )
  }
}
