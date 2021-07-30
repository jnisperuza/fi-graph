import React, { useEffect } from 'react';
import { DOWNLOAD_BUTTONS, FILTER_PANEL, Dashboard } from './config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import './Dashboard.scss';
import { Card as ICard } from '../Card/config';
import Card from '../Card/Card';
import { groupDataGraph } from '../../helpers/process';
import { groupBy } from '../../helpers/utils';

function Dashboard(props: Dashboard) {
    const {
        selectedCard,
        refresh,
        handleViewMore,
        data,
        getData,
        preloader
    } = props;

    useEffect(() => {
        controlInterface(true);
        handleData();
        return () => {
            controlInterface();
        };
    }, []);

    const controlInterface = (onInit?: boolean) => {
        const elements = [DOWNLOAD_BUTTONS, FILTER_PANEL];
        const styles = {
            visibility: onInit ? 'hidden' : 'visible',
            opacity: onInit ? '0' : '1',
            pointerEvents: onInit ? 'none' : 'all',
            zIndex: onInit ? '-1' : '1'
        };
        elements.forEach(element => {
            const selector = document.querySelector(element) as HTMLElement;
            const parent = selector.parentNode as HTMLElement;
            const sibling = selector.nextSibling as HTMLElement;
            if (selector) {
                Object.assign(selector.style, styles);
                if (parent) Object.assign(parent.style, styles);
                if (sibling) Object.assign(sibling.style, styles);
            }
        });
        // Separator element
        const separator = document.querySelector(FILTER_PANEL).parentNode.nextSibling as HTMLElement;
        Object.assign(separator.style, styles);
    }

    const handleClose = () => {
        controlInterface();
        if (refresh instanceof Function) {
            refresh();
        }
        if (handleViewMore instanceof Function) {
            handleViewMore();
        }
    }

    const handleData = () => {
        if (getData instanceof Function) {
            getData();
        }
    }

    const iterateCards = (_data: any) => {
        const { options, type, id } = _data.cardConfig;
        const serieConfig = options?.serieConfig;
        const formatConfig = options?.formatConfig;
        const fieldCategory = options?.fieldCategory;
        if (!serieConfig?.length || !formatConfig || !fieldCategory) return;
        const grouped = groupBy(_data.data, formatConfig.groupByField);

        return Object.keys(grouped).map(group => (
            <Card
                type={type}
                data={grouped[group]}

                options={{
                    ...options,
                    title: group
                }} />
        ));
    }

    const renderCards = (_data: any) => {
        const eachRowIsACard = _data.cardConfig?.options?.eachRowIsACard;
        return eachRowIsACard ?
            iterateCards(_data) :
            (
                <Card
                    type={_data.cardConfig.type}
                    data={_data.data}
                    options={{
                        ..._data.cardConfig.options,
                        fullWidth: true,
                        title: _data.name
                    }} />
            )
    }

    return (
        <div className={`Dashboard ${selectedCard ? 'visible' : ''}`}>
            {preloader && (
                <div className="wrapper-preloader">
                    <div className="preloader" />
                </div>
            )}
            <div className="header">
                <span>{selectedCard?.options?.title}</span>
            </div>
            <div className="content">
                {data.map((_data: any) => renderCards(_data))}
                {!preloader && !data?.length && (
                    <div className="empty-data">
                        <span>No hay datos</span>
                    </div>
                )}
            </div>
            <div className="actions">
                <button className="close" onClick={handleClose}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>Regresar al mapa</span>
                </button>
            </div>
        </div>
    )
}

export default Dashboard;