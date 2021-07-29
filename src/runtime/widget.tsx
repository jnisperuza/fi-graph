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
  QueryData
} from '../config';

import FilterStatus from '../components/FilterStatus/FilterStatus';
import Card from '../components/Card/Card';
import { CardType, Card as ICard } from '../components/Card/config';
import { getData, unifyFilters, where, getPeriodLabels, getTerritoryLabels, applyRules, formatFilterStatus } from '../helpers/process';
import Dashboard from '../components/Dashboard/Dashboard';

import "./widget.scss";

export default class Widget extends React.PureComponent<AllWidgetProps<{}> & { widgetState: WidgetState }, IMWidgetState> {

  [x: string]: any;
  state = {
    query: null,
    refresh: false,
    preloader: false,
    wrapperFilterStatusRef: React.createRef<HTMLDivElement>(),
    filters: [],
    filterStatus: [],
    queries: [],
    queryData: [],
    selectedCard: null,
  };

  constructor(props: any) {
    super(props);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.handleUIRefresh = this.handleUIRefresh.bind(this);
    this.handleViewMore = this.handleViewMore.bind(this);
  }

  getOriginDataSource() {
    return DataSourceManager.getInstance().getDataSource(this.props.useDataSources?.[0]?.dataSourceId)
  }

  componentDidMount() {
    this.updateFilters();
  }

  componentWillReceiveProps() {
    this.updateFilters();
    // Update FilterStatus (badge)
    this.buildFilterStatus();
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
    this.setState({ selectedCard: card });
    this.setState({ refresh: true });
  }

  /**
   * Map the state your widget needs
   * @param state
   */
  static mapExtraStateProps(state: IMState) {
    return { widgetState: state.widgetState };
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
    const { filters } = this.state;
    const formattedFilters = unifyFilters(filters);
    const whereList = formattedFilters.map(item => where(item.filterList)).filter(item => item);
    const queries: Query[] = QUERY_SCHEMA.map(querySchema => {
      //Unify all where
      querySchema.query.where = whereList.join(' and ').trim();
      return querySchema;
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
    const ds = this.getOriginDataSource();
    const iterate = (e: Query[], item = 0) => {
      try {
        if (e[item] !== undefined) {
          ds.query(e[item].query).then((result: DatasourceResponse) => {
            queryData.push({
              name: e[item].name,
              cardConfig: e[item].cardConfig,
              data: getData(result)
            });
            // Update state
            this.setState({ queryData, refresh: true });
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
      qd.cardConfig.type === CardType.Pie
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
          options={{
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
        options={{
          ...qd.cardConfig.options,
          fullWidth: true,
          title: qd.name
        }} />
    )
  }

  renderCards(loading: boolean) {
    // Generate data for each filter type into state
    const { queryData, preloader } = this.state;

    // It should only be run the first time or when redux enters a new filter
    if (!loading && !preloader && !queryData.length) {
      this.buildQueryData();
    }

    return queryData.map(
      (qd: QueryData) => this.valideCardType(qd)
    );
  }

  renderComponent = (ds: DataSource, info: IMDataSourceInfo) => {
    const loading = info.status === 'UNLOADED' || info.status === 'LOADING';
    const { preloader } = this.state;
    const territoryLabels = getTerritoryLabels(this.state.filters);
    const periodLabels = getPeriodLabels(this.state.filters);

    this.setState({ refresh: false });
    return (
      <div className="fi-graph" style={this.getInlineStyle()}>
        {preloader && (
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
            <Dashboard selectedCard={this.state.selectedCard} handleViewMore={this.handleViewMore} />
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
