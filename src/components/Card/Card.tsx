import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CardType, Card, PIE_OPTIONS, BAR_OPTIONS } from './config';
import { Chart } from "react-google-charts";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import './Card.scss';
import { currencyFormat, numberFormat } from '../../helpers/utils';
import { formatDataBar, formatDataMultiserie, formatDataPie } from '../../helpers/process';

function Card(props: Card) {
    const { type, options, data } = props;

    const renderAmountType = () => (
        <div className={`Card amount ${options?.fullWidth ? 'full-width' : 'half-width'}`}>
            <div className="header">
                <h1 title={options.title}>{options.title}</h1>
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
                        <span>Cantidad</span>
                    </li>
                </ul>
            </div>
            <div className="actions">
                <button className="view-more">
                    <FontAwesomeIcon icon={faSearch} />
                    <span>Ver más</span>
                </button>
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
            series: series,
            tooltip
        }
        return (
            <div className="Card bar">
                <div className="header">
                    <h1 title={options.title}>{options.title}</h1>
                    <div className="description">
                        <button className="view-more">
                            <FontAwesomeIcon icon={faSearch} />
                            <span>Ver más</span>
                        </button>
                    </div>
                </div>
                <div className="content">
                    <>
                        {data?.length ? (
                            <HighchartsReact
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

    const renderMultiserieType = () => (
        <div className="Card multiserie">
            <div className="header">
                <h1 title={options.title}>{options.title}</h1>
                <div className="description">
                    <span title={options.subtitle}>{options.subtitle}</span>
                    <button className="view-more">
                        <FontAwesomeIcon icon={faSearch} />
                        <span>Ver más</span>
                    </button>
                </div>
            </div>
            <div className="content">
                {data?.length ? (
                    <span>MultiSerie</span>
                ) : (
                    <div className="empty-data">
                        <span>No hay datos</span>
                    </div>
                )}
            </div>
        </div>
    );

    const renderPieType = () => {
        const { series, tooltip } = formatDataPie(options, data);
        const ChartOptions = {
            ...PIE_OPTIONS,
            series: series,
            tooltip
        }

        return (
            <div className="Card pie">
                <div className="header">
                    <h1 title={options.title}>{options.title}</h1>
                    <div className="description">
                        <button className="view-more">
                            <FontAwesomeIcon icon={faSearch} />
                            <span>Ver más</span>
                        </button>
                    </div>
                </div>
                <div className="content">
                    <>
                        {data?.length ? (
                            <HighchartsReact
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

    return (
        <>
            {type === CardType.Amount && renderAmountType()}
            {type === CardType.Bar && renderBarType()}
            {type === CardType.Pie && renderPieType()}
            {type === CardType.Multiserie && renderMultiserieType()}
        </>
    )
}

export default Card;