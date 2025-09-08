import React, { useEffect } from 'react';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import ModalOverlay from '../modal-overlay/modal-overlay';
import styles from './modal.module.css';
import ReactDOM from 'react-dom';
import { ModalProps } from '../../utils/types';

const modalRoot = document.getElementById('portal-root') as HTMLElement;

const Modal = ({ title, onClose, children }: ModalProps) => {
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleEsc);
		return () => {
			document.removeEventListener('keydown', handleEsc);
		};
	}, [onClose]);

	return ReactDOM.createPortal(
		<>
			<ModalOverlay onClose={onClose} />
			<div className={styles.modal}>
				<div className={styles.header}>
					<h2 className="text text_type_main-large">{title}</h2>
					<button className={styles.closeButton} onClick={onClose} data-testid="modal-close-button">
						<CloseIcon type="primary" />
					</button>
				</div>
				<div className={styles.content}>
					{children}
				</div>
			</div>
		</>,
		modalRoot
	);
};

export default Modal;