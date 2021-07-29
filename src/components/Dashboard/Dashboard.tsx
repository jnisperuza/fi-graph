import React, { useEffect, useState } from 'react';
import { DOWNLOAD_BUTTONS, FILTER_PANEL, Dashboard } from './config';

import './Dashboard.scss';

function Dashboard(props: Dashboard) {
    const { selectedCard, refresh, handleViewMore } = props;

    useEffect(() => {
        controlInterface(true);
        return () => {
            controlInterface();
        };
    }, []);

    const controlInterface = (onInit?: boolean) => {
        const elements = [DOWNLOAD_BUTTONS, FILTER_PANEL];
        const styles = {
            visibility: onInit ? 'hidden' : 'visible',
            opacity: onInit ? '0' : '1',
            pointerEvents: onInit ? 'none' : 'all'
        };
        elements.forEach(element => {
            const selector = document.querySelector(element) as HTMLElement;
            const sibling = selector.nextSibling as HTMLElement;
            if (selector) {
                Object.assign(selector.style, styles);
                if (sibling) {
                    Object.assign(sibling.style, styles);
                }
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

    return (
        <div className={`Dashboard ${selectedCard ? 'visible' : ''}`}>
            <div className="header"></div>
            <div className="content"></div>
            <div className="actions">
                <button className="close" onClick={handleClose}>Regresar al mapa</button>
            </div>
        </div>
    )
}

export default Dashboard;