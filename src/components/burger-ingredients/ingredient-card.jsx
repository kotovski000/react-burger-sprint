import React from 'react';
import { CurrencyIcon, Counter } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './burger-ingredients.module.css';
import { IngredientType } from '../../utils/types';


const IngredientCard = ({ item }) => {
    return (
        <div className={styles.ingredientCard}>
            {item.count > 0 && (
                <Counter count={item.count} size="default" />
            )}
            <img src={item.image} alt={item.name} className={styles.ingredientImage} />
            <div className={`${styles.price} mt-1 mb-1`}>
                <span className="text text_type_digits-default mr-2">{item.price}</span>
                <CurrencyIcon type="primary" />
            </div>
            <p className={`text text_type_main-default ${styles.ingredientName}`}>{item.name}</p>
        </div>
    );
};

IngredientCard.propTypes = {
    item: IngredientType.isRequired
};

export default IngredientCard;