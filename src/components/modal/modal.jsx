import React, { useEffect } from 'react';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import ModalOverlay from '../modal-overlay/modal-overlay';
import styles from './modal.module.css';
import ReactDOM from 'react-dom';
import { ModalType } from '../../utils/types';


const modalRoot = document.getElementById('portal-root');

const Modal = ({ title, onClose, children }) => {
    useEffect(() => {
        const handleEsc = (e) => {
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
                    <button className={styles.closeButton} onClick={onClose}>
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

Modal.propTypes = ModalType;


export default Modal;

