/** @jsx jsx */
import {
  React,
  AllWidgetProps,
  jsx,
  DataSourceManager,
  DataSourceComponent,
  DataSource,
  IMDataSourceInfo,
  IMState
  // @ts-ignore
} from 'jimu-core';

import {
  IMWidgetState,
  WidgetState,
  DEFAULT_FILTER,
  QUERY_SCHEMA,
  DatasourceResponse,
  Query,
  QueryData,
  QUERY_SCHEMA_DASHBOARD,
  FilterType,
  DEFAULT_FILTER_YEAR
} from '../config';

import {
  CardType,
  Card as ICard,
  FormatConfigField,
  FormatType
} from '../components/Card/config';

import {
  getData,
  unifyFilters,
  where,
  getPeriodLabels,
  getTerritoryLabels,
  applyRules,
  formatFilterStatus,
  formatPredefinedWhere,
  cleanWhere,
  unionCardData
} from '../helpers/process';

import FilterStatus from '../components/FilterStatus/FilterStatus';
import Card from '../components/Card/Card';
import { SHORT_MONTH_NAMES } from '../helpers/utils';
import Dashboard from '../components/Dashboard/Dashboard';

import "./widget.scss";

export default class Widget extends React.PureComponent<AllWidgetProps<{}> & { widgetState: WidgetState }, IMWidgetState> {

  [x: string]: any;
  state = {
    firstLoad: false,
    refresh: false,
    preloader: false,
    wrapperFilterStatusRef: React.createRef<HTMLDivElement>(),
    filters: [],
    filterStatus: [],
    queries: [],
    queryData: [],
    queryDataDashboard: [],
    selectedCard: null,
    periodData: [],
    previousYear: null,
  };

  constructor(props: any) {
    super(props);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.handleUIRefresh = this.handleUIRefresh.bind(this);
    this.handleViewMore = this.handleViewMore.bind(this);
    this.buildQueryDataDashboard = this.buildQueryDataDashboard.bind(this);
  }

  componentDidMount() {
  }

  componentWillReceiveProps() {
    this.updateFilters();
    // Time to wait for redux to update
    setTimeout(() => {
      this.buildQueryData();
      // Update FilterStatus (badge)
      this.buildFilterStatus();
    });
  }

  getOriginDataSource() {
    return DataSourceManager.getInstance().getDataSource(this.props.useDataSources?.[0]?.dataSourceId)
  }

  handleRemoveFilter(filter: string) {
    const { filters } = this.state;
    const found = filters.find(item => String(item?.value).includes(filter));

    if (found) {
      const filterToClean = { ...found };
      filterToClean.value = [filter];

      this.props.dispatch({
        type: 'CLEAR_FILTERS',
        val: filterToClean
      });
    }
  }

  handleUIRefresh() {
    this.setState({ refresh: true });
  }

  handleViewMore(card?: ICard) {
    if (!card) {
      this.setState({ queryDataDashboard: [] });
    }
    this.setState({ selectedCard: card, refresh: true });
  }

  /**
   * Map the state your widget needs
   * @param state
   */
  static mapExtraStateProps(state: IMState) {
    return { widgetState: state.widgetState };
  }

  getPeriodData() {
    const ds = this.getOriginDataSource();
    if (!ds) return;
    return new Promise((resolve) => {
      // Get the most recent periods
      ds.query({ where: '1=1', outFields: ['anio, mes'], returnDistinctValues: true, returnGeometry: false, orderByFields: 'anio DESC, mes DESC' })
        .then((result: DatasourceResponse) => {
          const periodData = getData(result);
          this.setState({ periodData });

          if (periodData.length) {
            const mostRecentYear = Math.max.apply(Math, periodData.map((item) => item.anio));
            const previousYear = { year: mostRecentYear - 1 };
            this.setState({ previousYear });

            resolve({ periodData, previousYear });
          }
        });
    });
  }

  updateFilters() {
    const dispatch = () => {
      const filters = this.props.widgetState?.filters?.length && this.props.widgetState.filters || DEFAULT_FILTER;
      // Update filters state
      this.setState({ filters });
      this.buildQueries();
    }
    // Time to wait for redux to update
    setTimeout(dispatch);
  }

  buildQueries() {
    const { filters, periodData } = this.state;
    /** If a year has not been defined in the filters, it is filtered by the most recent */
    const hasYearFilter = filters.filter(item => item?.filterType === FilterType.Period).find(item => item?.field === 'anio');
    if (!hasYearFilter && periodData?.length) {
      const yearFilter = JSON.parse(JSON.stringify(DEFAULT_FILTER_YEAR));
      yearFilter.value = periodData[0].anio;
      filters.push(yearFilter);
    }
    const formattedFilters = unifyFilters(filters);
    const whereList = formattedFilters.map(item => where(item?.filterList)).filter(item => item);
    const queries: Query[] = QUERY_SCHEMA.map(querySchema => {
      // Predefined where from config
      const predefinedWhere = formatPredefinedWhere(querySchema, this.state);
      const cleanedWhere = cleanWhere(whereList.join(' and ').trim(), querySchema.whereFields);
      // Unify all where
      const _querySchema = JSON.parse(JSON.stringify(querySchema));
      _querySchema.query.where = predefinedWhere ? (cleanedWhere ? `${cleanedWhere} and ${predefinedWhere}` : predefinedWhere) : cleanedWhere;
      return _querySchema;
    });
    const queriesAppliedRules = applyRules(queries, filters);
    // Update queries state
    this.setState({ queries: queriesAppliedRules });
    // Clear previous data
    this.setState({ queryData: [] });
  }

  buildQueryData() {
    const queryData: QueryData[] = [];
    const { queries } = this.state;
    if (!queries.length) return;
    const ds = this.getOriginDataSource();
    if (!ds) return;
    const iterate = (e: Query[], item = 0) => {
      try {
        if (e[item] !== undefined) {
          ds.query(e[item].query).then((result: DatasourceResponse) => {
            queryData.push({
              name: e[item].name,
              cardConfig: e[item].cardConfig,
              data: getData(result),
              query: e[item],
            });
            // Update state
            this.setState({ queryData });
            // Next item
            item++;
            if (item < e.length) {
              iterate(e, item);
            } else {
              // Shutdown preloader and refresh template
              this.setState({ preloader: false, refresh: true });
            }
          });
        }
      } catch (error) { }
    }

    // Start preloader
    this.setState({ preloader: true });
    iterate(queries);
  }

  processDataDashboard() {
    const { queryDataDashboard } = this.state;
    let _queryDataDashboard = JSON.parse(JSON.stringify(queryDataDashboard));

    /** Rule remove items */
    _queryDataDashboard = _queryDataDashboard.map(item => {
      if (item.cardConfig?.excludeRow instanceof Array) {
        item.cardConfig.excludeRow.forEach(row => {
          item.data = item.data.filter(_item => _item[row.field] !== row.value);
        });
      }
      return item;
    });

    /** Rule union Card */
    const withoutItemsToJoin = _queryDataDashboard.filter((item: any) => !item.cardConfig?.unionCard);
    const mappedDataUnion = unionCardData(_queryDataDashboard);
    _queryDataDashboard = withoutItemsToJoin.concat(mappedDataUnion);

    /** Format a specific field by REFERENCE */
    const toFormat = _queryDataDashboard.filter((item: any) => item.cardConfig?.options?.formatConfig?.fields?.length);
    toFormat.forEach((item: any) => {
      const { fields } = item.cardConfig.options.formatConfig;
      fields.forEach((field: FormatConfigField) => {
        item.data.forEach((_item: any) => {
          // MONTH
          if (field.format === FormatType.Month) {
            _item[field.name] = SHORT_MONTH_NAMES[_item[field.name]];
          }
        });
      });
    });

    return _queryDataDashboard;
  }

  buildQueryDataDashboard() {
    const { filters, selectedCard, periodData } = this.state;
    const queryDataDashboard: QueryData[] = [];
    if (!selectedCard || !selectedCard?.filter) return;
    /** If a year has not been defined in the filters, it is filtered by the most recent */
    const hasYearFilter = filters.filter(item => item?.filterType === FilterType.Period).find(item => item?.field === 'anio');
    if (!hasYearFilter && periodData?.length) {
      const yearFilter = JSON.parse(JSON.stringify(DEFAULT_FILTER_YEAR));
      yearFilter.value = periodData[0].anio;
      filters.push(yearFilter);
    }
    // Select the same filter type
    const sameFilterType = filters.filter(_filter => _filter.filterType === selectedCard.filter.type);
    // Set single filter value
    const formattedFilters = unifyFilters(sameFilterType).map(_filter => {
      // Only for instruments card
      if (selectedCard.filter.type === FilterType.Instrument) {
        const key = Object.keys(_filter.filterList)[0];
        _filter.filterList[key][0].value = selectedCard.options.title; // <- Instrument ID
        _filter.filterList[key] = [_filter.filterList[key][0]];
      }
      return _filter;
    });
    const whereList = formattedFilters.map(item => where(item.filterList)).filter(item => item);
    const queries = QUERY_SCHEMA_DASHBOARD.filter(
      querySchema => querySchema.type === selectedCard.filter.type && querySchema.parentCard === selectedCard.filter.cardId
    ).map(querySchema => {
      // Predefined where from config
      const predefinedWhere = formatPredefinedWhere(querySchema, this.state);
      const cleanedWhere = cleanWhere(whereList.join(' and ').trim(), querySchema.whereFields);
      // Set where
      const _querySchema = JSON.parse(JSON.stringify(querySchema));
      _querySchema.query.where = predefinedWhere ? (cleanedWhere ? `${cleanedWhere} and ${predefinedWhere}` : predefinedWhere) : cleanedWhere;
      return _querySchema;
    });
    if (!queries.length) return;
    const ds = this.getOriginDataSource();
    if (!ds) return;
    const iterate = (e: Query[], item = 0) => {
      try {
        if (e[item] !== undefined) {
          ds.query(e[item].query).then((result: DatasourceResponse) => {
            queryDataDashboard.push({
              name: e[item].name,
              cardConfig: e[item].cardConfig,
              data: getData(result),
              query: e[item],
            });
            // Update state
            this.setState({ queryDataDashboard });
            // Next item
            item++;
            if (item < e.length) {
              iterate(e, item);
            } else {
              // Shutdown preloader and refresh template
              this.setState({ preloader: false, refresh: true });
            }
          });
        }
      } catch (error) { }
    }
    // Start preloader
    this.setState({ preloader: true });
    iterate(queries);
  }

  buildFilterStatus() {
    const dispatch = () => {
      const { filters } = this.state;
      const haveIncomingFilters = !!this.props.widgetState?.filters?.length; // [] or null
      const filterStatus = haveIncomingFilters ? filters.map((filter) => formatFilterStatus(filter))
        .reduce((accumulator, currentValue) => accumulator.concat(currentValue), []).filter((item: string | number) => item) : [];

      this.setState({ filterStatus });
    }
    // Time to wait for redux to update
    setTimeout(dispatch);
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

  renderErrorMessage() {
    return (
      <div className="error-message">
        <span>Please, configure the data source</span>
      </div>
    )
  }

  valideCardType(qd: QueryData) {
    if (qd.cardConfig.type === CardType.Amount) {
      return this.drawCardAmount(qd);
    }
    else if (
      qd.cardConfig.type === CardType.Bar ||
      qd.cardConfig.type === CardType.Pie ||
      qd.cardConfig.type === CardType.Multiserie
    ) {
      return this.drawCardGraph(qd);
    }
  }

  drawCardAmount(qd: QueryData) {
    // In this graph an "Amount" card corresponds to a row of data
    return qd.data.map(
      (item: any, position: number) => (
        <Card
          type={qd.cardConfig.type}
          data={{
            amount: item.total_opif_sum,
            value: item.valor_opif_sum
          }}
          handleViewMore={this.handleViewMore}
          filter={{
            cardId: qd.cardConfig.id,
            type: qd.query.type,
            query: qd.query.query
          }}
          options={{
            ...qd.cardConfig.options,
            fullWidth: qd.data.length === position + 1 && qd.data.length % 2 !== 0,
            title: item.subtipo_inst
          }} />
      )
    )
  }

  drawCardGraph(qd: QueryData) {
    return (
      <Card
        type={qd.cardConfig.type}
        data={qd.data}
        handleViewMore={this.handleViewMore}
        filter={{
          cardId: qd.cardConfig.id,
          type: qd.query.type,
          query: qd.query.query
        }}
        options={{
          ...qd.cardConfig.options,
          fullWidth: true,
          title: qd.name
        }} />
    )
  }

  renderCards(loading: boolean) {
    // Generate data for each filter type into state
    const { queryData } = this.state;

    // It should only be run the first time or when redux enters a new filter
    if (!loading && !this.state.firstLoad) {
      this.getPeriodData().then(() => {
        this.updateFilters();
        this.buildQueryData();
        this.setState({ firstLoad: true });
      });
    }

    return queryData.map(
      (qd: QueryData) => this.valideCardType(qd)
    );
  }

  renderComponent = (ds: DataSource, info: IMDataSourceInfo) => {
    const loading = info.status === 'UNLOADED' || info.status === 'LOADING';
    const { preloader } = this.state;
    const territoryLabels = getTerritoryLabels(this.state.filters);
    const periodLabels = getPeriodLabels(this.state.periodData);

    this.setState({ refresh: false });
    return (
      <div className="fi-graph" style={this.getInlineStyle()}>
        {(preloader || loading) && (
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
          <div className="left-wrapper">
            {periodLabels.map((label: string, index: number) => (
              <h2 title={label} className={periodLabels.length - 1 !== index ? 'small' : ''}>
                {label}
              </h2>
            ))}
          </div>
          <div className="wrapper-filter-status" ref={this.state.wrapperFilterStatusRef}>
            <FilterStatus removeFilter={this.handleRemoveFilter} filters={this.state.filterStatus} />
          </div>
        </header>
        <main className={`${preloader || this.state.selectedCard ? 'locked' : ''}`}>
          {this.renderCards(loading)}
          {this.state.selectedCard && (
            <Dashboard
              selectedCard={this.state.selectedCard}
              preloader={preloader}
              data={this.processDataDashboard()}
              handleViewMore={this.handleViewMore}
              refresh={this.handleUIRefresh}
              getData={this.buildQueryDataDashboard}
            />
          )}
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
        query={{}}
        widgetId={this.props.id}
        refresh={this.state.refresh}
      >
        {this.renderComponent}
      </DataSourceComponent>
    )
  }
}
