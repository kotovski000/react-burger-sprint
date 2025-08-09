import React from 'react';
import styles from './modal-overlay.module.css';
import { ModalOverlayProps } from '../../utils/types';

const ModalOverlay = ({ onClose }: ModalOverlayProps) => {
	return (
		<div className={styles.overlay} onClick={onClose} data-testid="modal-overlay" />
	);
};

export default ModalOverlay;