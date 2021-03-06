import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { CardType, Card, PIE_OPTIONS, BAR_OPTIONS, MULTISERIE_OPTIONS } from './config';
import { currencyFormat, numberFormat } from '../../helpers/utils';
import { formatDataBar, formatDataMultiserie, formatDataPie } from '../../helpers/process';

import './Card.scss';

function Card(props: Card) {
    const { type, options, filter, data, handleViewMore } = props;
    const [wrapperRef] = useState(React.createRef<HTMLDivElement>());
    /** Its function is to show the title of the charts only when they are in full screen */
    const RESPONSIVE_RULES = {
        rules: [{
            condition: {
                minHeight: 800 // to identify full-size mode
            },
            chartOptions: {
                title: {
                    text: options?.title
                },
                subtitle: {
                    text: options?.subtitle
                }
            }
        }]
    };

    const handleViewMoreCard = (card: Card) => {
        if (handleViewMore instanceof Function) {
            handleViewMore(card);
        }
    }

    const renderAmountType = () => (
        <div className={`Card amount ${options?.fullWidth ? 'full-width' : 'half-width'}`} ref={wrapperRef} data-id={filter?.cardId || Date.now()}>
            <div className="header">
                <h1 title={options?.title}>{options?.title}</h1>
            </div>
            <div className="content">
                <ul>
                    <li className="highlighted">
                        <span title={currencyFormat(data?.value)}>
                            {currencyFormat(data?.value) || 0}
                        </span>
                        <span>Millones de pesos</span>
                    </li>
                    <li>
                        <span title={numberFormat(data?.amount)}>
                            {numberFormat(data?.amount) || 0}
                        </span>
                        <span>Nro. operaciones</span>
                    </li>
                </ul>
            </div>
            <div className="actions">
                {options?.viewMore !== false && options?.[options?.viewMoreWhen?.field] === options?.viewMoreWhen?.value && (
                    <button className="view-more" onClick={() => handleViewMoreCard(props)}>
                        <FontAwesomeIcon icon={faSearch} />
                        <span>Ver m??s</span>
                    </button>
                )}
            </div>
        </div>
    );

    const renderAmountRowType = () => (
        <div className={`Card amount-row ${options?.fullWidth ? 'full-width' : ''}`} ref={wrapperRef} data-id={filter?.cardId || Date.now()}>
            <div className="header">
                <div className="wrapper-title">
                    <h1 title={options?.title}>{options?.title}</h1>
                    <h2 title={options?.subtitle}>{options?.subtitle}</h2>
                </div>
                {options?.viewMore !== false && (
                    <div className="description">
                        <button className="view-more" onClick={() => handleViewMoreCard(props)}>
                            <FontAwesomeIcon icon={faSearch} />
                            <span>Ver m??s</span>
                        </button>
                    </div>
                )}
            </div>
            <div className="content">
                <>
                    {data?.length ? data.map((item: any) => (
                        <div className="row-card">
                            <span className="title">{item?.name}</span>
                            <span className="amount">Nro. operaciones: {numberFormat(item?.amount) || 0}</span>
                            <span className="value">Valor: {currencyFormat(item?.value) || 0}</span>
                        </div>
                    )) : (
                        <div className="empty-data">
                            <span>No hay datos</span>
                        </div>
                    )}
                </>
            </div>
        </div>
    );

    const renderBarType = () => {
        const { categories, series, tooltip } = formatDataBar(options, data);
        const ChartOptions = {
            ...BAR_OPTIONS,
            xAxis: {
                ...BAR_OPTIONS.xAxis,
                categories
            },
            responsive: {
                ...RESPONSIVE_RULES
            },
            series: series,
            tooltip
        }
        return (
            <div className={`Card bar ${options?.fullWidth ? 'full-width' : ''}`} ref={wrapperRef} data-id={filter?.cardId || Date.now()}>
                <div className="header">
                    <div className="wrapper-title">
                        <h1 title={options?.title}>{options?.title}</h1>
                        <h2 title={options?.subtitle}>{options?.subtitle}</h2>
                    </div>
                    {options?.viewMore !== false && (
                        <div className="description">
                            <button className="view-more" onClick={() => handleViewMoreCard(props)}>
                                <FontAwesomeIcon icon={faSearch} />
                                <span>Ver m??s</span>
                            </button>
                        </div>
                    )}
                </div>
                <div className="content">
                    <>
                        {data?.length ? (
                            <HighchartsReact
                                containerProps={BAR_OPTIONS.containerProps}
                                highcharts={Highcharts}
                                options={ChartOptions}
                            />
                        ) : (
                            <div className="empty-data">
                                <span>No hay datos</span>
                            </div>
                        )}
                    </>
                </div>
            </div>
        )
    }

    const renderPieType = () => {
        const { series, tooltip } = formatDataPie(options, data);
        const ChartOptions = {
            ...PIE_OPTIONS,
            responsive: {
                ...RESPONSIVE_RULES
            },
            series: series,
            tooltip
        }

        return (
            <div className={`Card pie ${options?.fullWidth ? 'full-width' : ''}`} ref={wrapperRef} data-id={filter?.cardId || Date.now()}>
                <div className="header">
                    <div className="wrapper-title">
                        <h1 title={options?.title}>{options?.title}</h1>
                        <h2 title={options?.subtitle}>{options?.subtitle}</h2>
                    </div>
                    {options.viewMore !== false && (
                        <div className="description">
                            <button className="view-more" onClick={() => handleViewMoreCard(props)}>
                                <FontAwesomeIcon icon={faSearch} />
                                <span>Ver m??s</span>
                            </button>
                        </div>
                    )}
                </div>
                <div className="content">
                    <>
                        {data?.length ? (
                            <HighchartsReact
                                containerProps={PIE_OPTIONS.containerProps}
                                highcharts={Highcharts}
                                options={ChartOptions}
                            />
                        ) : (
                            <div className="empty-data">
                                <span>No hay datos</span>
                            </div>
                        )}
                    </>
                </div>
            </div>
        )
    }

    const renderMultiserieType = () => {
        const { categories, series, tooltip } = formatDataMultiserie(options, data);
        const ChartOptions = {
            ...MULTISERIE_OPTIONS,
            responsive: {
                ...RESPONSIVE_RULES
            },
            xAxis: {
                ...MULTISERIE_OPTIONS.xAxis,
                categories
            },
            series: series,
            tooltip
        }

        return (
            <div className={`Card multiserie ${options?.fullWidth ? 'full-width' : ''}`} ref={wrapperRef} data-id={filter?.cardId || Date.now()}>
                <div className="header">
                    <div className="wrapper-title">
                        <h1 title={options?.title}>{options?.title}</h1>
                        <h2 title={options?.subtitle}>{options?.subtitle}</h2>
                    </div>
                    {options.viewMore !== false && (
                        <div className="description">
                            <button className="view-more" onClick={() => handleViewMoreCard(props)}>
                                <FontAwesomeIcon icon={faSearch} />
                                <span>Ver m??s</span>
                            </button>
                        </div>
                    )}
                </div>
                <div className="content">
                    <>
                        {data?.length ? (
                            <HighchartsReact
                                containerProps={MULTISERIE_OPTIONS.containerProps}
                                highcharts={Highcharts}
                                options={ChartOptions}
                            />
                        ) : (
                            <div className="empty-data">
                                <span>No hay datos</span>
                            </div>
                        )}
                    </>
                </div>
            </div>
        )
    }

    const renderWithoutGraphType = () => {
        return (
            <div className={`Card without-graph ${options?.fullWidth ? 'full-width' : ''}`} ref={wrapperRef} data-id={filter?.cardId || Date.now()}>
                <div className="header">
                    <div className="wrapper-title">
                        <h1 title={options?.title}>{options?.title}</h1>
                        <h2 title={options?.subtitle}>{options?.subtitle}</h2>
                    </div>
                    {options.viewMore !== false && (
                        <div className="description">
                            <button className="view-more" onClick={() => handleViewMoreCard(props)}>
                                <FontAwesomeIcon icon={faSearch} />
                                <span>Ver m??s</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            {type === CardType.Amount && renderAmountType()}
            {type === CardType.AmountRow && renderAmountRowType()}
            {type === CardType.Bar && renderBarType()}
            {type === CardType.Pie && renderPieType()}
            {type === CardType.Multiserie && renderMultiserieType()}
            {type === CardType.WithoutGraph && renderWithoutGraphType()}
        </>
    )
}

export default Card;