import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setLabelsFilter } from '../../../store/labels/labelsActions';

import styles from './QueryLabels.module.scss';

const QueryLabels = ({ labels }) => {
    const [highlighted, setHighlighted] = useState();
    const [stacking, setStacking] = useState(false);

    // Enable us to dispatch
    const dispatch = useDispatch();

    const stateLabels = useSelector((state) => state.labels);

    // If we have over this many labels per query, stack them
    const stackOver = 2;

    // Set our initial state
    useEffect(() => {
        // Are the labels stacked
        setStacking(labels && labels.length > stackOver ? true : false);
        // If we don't already have a highlighted label, set it to the last one
        setHighlighted(highlighted ? highlighted : labels[labels.length - 1]);
        // Sigh, nonsensical dependency requirements again
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [labels]);

    // Dispatch an action to set the active label filter
    const setFilter = (id) => {
        dispatch(setLabelsFilter(id));
    };

    // Given a label id, return the full label object
    const findLabel = (toFind) =>
        stateLabels && stateLabels.labelList.length > 0 && toFind
            ? stateLabels.labelList.find((label) => label.id === toFind)
            : {};

    // Are we stacking the labels
    const isStacking = stacking ? styles.stack : styles.noStack;

    // Is the given label being hovered over
    const isHighlighted = (id) => {
        return stacking && highlighted === id ? styles.highlighted : '';
    };

    // Is the given label the active filter
    const isActiveFilter = (id) => {
        return stateLabels && id === stateLabels.filter
            ? styles.activeFilter
            : '';
    };

    const Label = ({ label }) => {
        const fullLabel = findLabel(label);
        return (
            <li
                onClick={() => setFilter(label)}
                onMouseOver={() => setHighlighted(label)}
                className={`${styles.label} ${isStacking} ${isHighlighted(
                    label
                )} ${isActiveFilter(label)}`}
            >
                <div
                    data-testid="labelindicator"
                    className={styles.indicator}
                    style={{ background: fullLabel.colour }}
                ></div>
                <div className={styles.labelName}>{fullLabel.name}</div>
            </li>
        );
    };
    return (
        <ul className={styles.container}>
            {labels &&
                labels.length > 0 &&
                labels.map((label) => <Label key={label} label={label} />)}
        </ul>
    );
};

export default QueryLabels;
