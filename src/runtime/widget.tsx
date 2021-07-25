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
  DEFAULT_FILTER,
  Data,
  PAGE_SIZE,
  FilterList,
  QUERY_SCHEMA,
  DatasourceResponse,
  Query,
  QueryData
} from '../config';

import FilterStatus from '../components/FilterStatus/FilterStatus';
import Card from '../components/Card/Card';
import { CardType, TitleCard } from '../components/Card/config';

import "./widget.scss";
import { getData, unifyFilters, where } from '../helpers/process';


export default class Widget extends React.PureComponent<AllWidgetProps<{}> & { widgetState: WidgetState }, IMWidgetState> {

  [x: string]: any;
  state = {
    query: null,
    refresh: false,
    loading: false,
    wrapperFilterStatusRef: React.createRef<HTMLDivElement>(),
    filters: [],
    filterStatus: [],
    queries: [],
    queryData: []
  };

  constructor(props: any) {
    super(props);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
  }

  getOriginDataSource() {
    return DataSourceManager.getInstance().getDataSource(this.props.useDataSources?.[0]?.dataSourceId)
  }

  componentDidMount() {
    this.updateFilters();
  }

  componentWillReceiveProps() {
    this.updateFilters();
  }

  handleRemoveFilter(filter: string) {
    const { filters } = this.state;
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
    const whereList = formattedFilters.map(item => where(item.filterList));

    const queries: Query[] = QUERY_SCHEMA.map(querySchema => {
      //Unify all where
      querySchema.query.where = whereList.join(' and ').trim();
      return querySchema;
    });
    // Update queries state
    this.setState({ queries });
  }

  buildQueryData() {
    const queryData: QueryData[] = [];
    const { queries } = this.state;
    // const queryList = [];
    const ds = this.getOriginDataSource();
    const iterate = (e: Query[], item = 0) => {
      try {
        if (e[item] !== undefined) {
          ds.query(e[item].query).then((result: DatasourceResponse) => {
            queryData.push({
              name: e[item].name,
              visual: e[item].visual,
              data: getData(result)
            });
            // Update state
            this.setState({ queryData, refresh: true });
            // Next item
            item++;
            if (item < e.length) {
              iterate(e, item);
            } else {
              this.setState({ loading: false, refresh: true });
            }
          });
        }
      } catch (error) { }
    }

    this.setState({ loading: true });
    iterate(queries);

    // queries.forEach(item => {
    //   if (ds) {
    //     queryList.push(ds.query(item.query));
    //   }
    // });

    // Promise.all(queryList).then((results) => {
    //   results.forEach((result, index) => {
    //     queryData.push({
    //       name: queries[index].name,
    //       visual: queries[index].visual,
    //       data: getData(result)
    //     });
    //   });
    //   // Update queries state
    //   this.setState({ queryData });
    //   console.log(queryData);
    // });
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

  renderCards() {
    // Generate data for each filter type into state
    const { queryData } = this.state;

    if (!queryData.length) {
      this.buildQueryData();
    }

    return (
      <>
        {queryData.map(qd => (
          <>
            <span>{qd.name}</span> <br />
          </>
        ))}
      </>
    )
  }

  renderComponent = (ds: DataSource, info: IMDataSourceInfo) => {
    // const loading = info.status === 'UNLOADED' || info.status === 'LOADING';
    const { loading } = this.state;

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
            <h1>
              Colombia
            </h1>
          </div>
          <h2>Feb - 2020</h2>
          <div className="wrapper-filter-status" ref={this.state.wrapperFilterStatusRef}>
            <FilterStatus removeFilter={this.handleRemoveFilter} filters={this.state.filterStatus} />
          </div>
        </header>
        <main className={`${loading ? 'loading' : ''}`}>
          {this.renderCards()}
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
