
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FilterStatus, DEFAULT_HEIGHT } from './config';

import './FilterStatus.scss';

function FilterStatus(props: FilterStatus) {
    const [badgeListRef] = useState(React.createRef<HTMLDivElement>());
    const [showToggleButton, setShowToggleButton] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const { filters, removeFilter } = props;

    useEffect(() => {
        setShowAll(false);
        handleToggleButton();
    }, [filters]);

    const handleToggleButton = () => {
        if (filters?.length) {
            const { height } = badgeListRef?.current && badgeListRef.current.getBoundingClientRect();
            const toShow = height > DEFAULT_HEIGHT;
            setShowToggleButton(toShow);
        } else {
            // Without items
            setShowToggleButton(false);
        }
    };

    const handleShowAll = () => {
        setShowAll(!showAll);
        if (badgeListRef?.current) {
            badgeListRef.current.scrollTo(0, 0);
        }
    }

    const handleRemoveFilter = (filter: string) => {
        removeFilter(filter);
        handleToggleButton();
    }

    return (
        <div className={`filter-status ${showAll ? 'show-all' : ''}`}>
            {
                filters?.length ?
                    <div className="badge-list" ref={badgeListRef}>
                        {filters.map((filter, index) => (
                            <div className="badge" key={index} title={filter}>
                                <span>{filter}</span>
                                <button type="button" onClick={() => handleRemoveFilter(filter)}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        ))}
                    </div>
                    :
                    <div className="last-update">
                        <span>Última actualización de instrumentos financieros</span>
                    </div>
            }
            {showToggleButton && (
                <button className="toggle-list" onClick={handleShowAll}>
                    <FontAwesomeIcon icon={!showAll ? faChevronDown : faChevronUp} />
                </button>
            )}
        </div>
    )
}

export default FilterStatus;