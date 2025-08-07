import React from 'react';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './order-details.module.css';
import {OrderDetailsType} from "../../utils/types";

const OrderDetails = ({ orderNumber }) => {
    return (
        <div className={styles.container}>
            <h2 className={`text text_type_digits-large mb-8 ${styles.number}`}>
                {orderNumber}
            </h2>
            <p className="text text_type_main-medium mb-15">идентификатор заказа</p>

            <div className={`mb-15 ${styles.icon}`}>
                <CheckMarkIcon type="primary" />
            </div>

            <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
            <p className="text text_type_main-default text_color_inactive">
                Дождитесь готовности на орбитальной станции
            </p>
        </div>
    );
};

OrderDetails.propTypes = {
    orderNumber: OrderDetailsType
};

export default OrderDetails;