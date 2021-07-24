import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CardType, Card, SPLINE_OPTIONS, PIE_OPTIONS, BAR_OPTIONS } from './config';
import { Chart } from "react-google-charts";

import './Card.scss';
import { currencyFormat, numberFormat } from '../../helpers/utils';
import { formatDataBar, formatDataMultiserie, formatDataPie, formatDataSpline } from '../../helpers/process';

function Card(props: Card) {
    const { type, options, loading, data } = props;

    const renderAmountType = () => (
        <div className={`Card amount ${options?.fullWidth ? 'full-width' : 'half-width'}`}>
            <div className="header">
                <h1 title={`${options.title.normal} ${options.title.bold}`}>
                    {options.title.normal} <em>{options.title.bold}</em>
                </h1>
            </div>
            <div className="content">
                <ul>
                    <li className="highlighted">
                        <span title={currencyFormat(data?.value)}>
                            {currencyFormat(data?.value) || (loading ? '...' : 0)}
                        </span>
                        <span>Millones de pesos</span>
                    </li>
                    <li>
                        <span title={numberFormat(data?.amount)}>
                            {numberFormat(data?.amount) || (loading ? '...' : 0)}
                        </span>
                        <span>{options.title.normal}</span>
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

    const renderSplineType = () => (
        <div className="Card spline">
            <div className="header">
                <h1 title={`${options.title.normal} ${options.title.bold}`}>
                    {options.title.normal} <em>{options.title.bold}</em>
                </h1>
                <div className="description">
                    <span title={`${options.subtitle.normal} ${options.subtitle.bold}`}>
                        {options.subtitle.normal} <em>{options.subtitle.bold}</em>
                    </span>
                    <button className="view-more">
                        <FontAwesomeIcon icon={faSearch} />
                        <span>Ver más</span>
                    </button>
                </div>
            </div>
            <div className="content">
                {data?.length ? (
                    <Chart
                        width={'100%'}
                        height={'100%'}
                        chartType="LineChart"
                        loader={<div className="preloader" />}
                        data={formatDataSpline(data)}
                        options={SPLINE_OPTIONS}
                    />
                ) : (
                    <div className="empty-data">
                        <span>No hay datos</span>
                    </div>
                )}
            </div>
        </div>
    );

    /**
     * 
     * @name renderPieBarType
     * @param {CardType} type 
     * @description Render Pie and Bar graphs 
     */
    const renderPieBarType = (type: CardType.Pie | CardType.Bar) => (
        <div className={`Card ${type.toLowerCase()}`}>
            <div className="header">
                <h1 title={`${options.title.normal} ${options.title.bold}`}>
                    {options.title.normal} <em>{options.title.bold}</em>
                </h1>
                <div className="description">
                    <button className="view-more">
                        <FontAwesomeIcon icon={faSearch} />
                        <span>Ver más</span>
                    </button>
                </div>
            </div>
            <div className="content">
                {type === CardType.Pie && (
                    <>
                        {data?.length ? (
                            <Chart
                                width={'100%'}
                                height={'100%'}
                                chartType="PieChart"
                                loader={<div className="preloader" />}
                                data={formatDataPie(data)}
                                options={PIE_OPTIONS}
                            />
                        ) : (
                            <div className="empty-data">
                                <span>No hay datos</span>
                            </div>
                        )}
                    </>
                )}
                {type === CardType.Bar && (
                    <>
                        {data?.length ? (
                            <Chart
                                width={'100%'}
                                height={'100%'}
                                chartType="ColumnChart"
                                loader={<div className="preloader" />}
                                data={formatDataBar(data)}
                                options={BAR_OPTIONS}
                            />
                        ) : (
                            <div className="empty-data">
                                <span>No hay datos</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );

    const renderMultiserieType = () => (
        <div className="Card multiserie">
            <div className="header">
                <h1 title={`${options.title.normal} ${options.title.bold}`}>
                    {options.title.normal} <em>{options.title.bold}</em>
                </h1>
                <div className="description">
                    <span title={`${options.subtitle.normal} ${options.subtitle.bold}`}>
                        {options.subtitle.normal} <em>{options.subtitle.bold}</em>
                    </span>
                    <button className="view-more">
                        <FontAwesomeIcon icon={faSearch} />
                        <span>Ver más</span>
                    </button>
                </div>
            </div>
            <div className="content">
                {data?.length ? (
                    <Chart
                        width={'100%'}
                        height={'100%'}
                        chartType="ColumnChart"
                        loader={<div className="preloader" />}
                        data={formatDataMultiserie(data)}
                        options={SPLINE_OPTIONS}
                    />
                ) : (
                    <div className="empty-data">
                        <span>No hay datos</span>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {type === CardType.Amount && renderAmountType()}
            {type === CardType.Spline && renderSplineType()}
            {(type === CardType.Pie || type === CardType.Bar) && renderPieBarType(type)}
            {type === CardType.Multiserie && renderMultiserieType()}
        </>
    )
}

export default Card;