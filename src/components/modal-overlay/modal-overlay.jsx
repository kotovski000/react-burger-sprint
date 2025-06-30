import React from 'react';
import styles from './modal-overlay.module.css';
import { ModalOverlayType } from '../../utils/types';

const ModalOverlay = ({ onClose }) => {
    return (
        <div className={styles.overlay} onClick={onClose} data-testid="modal-overlay" />
    );
};

ModalOverlay.propTypes = ModalOverlayType;


export default ModalOverlay;