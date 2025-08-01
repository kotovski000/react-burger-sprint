import React from 'react';
import { useSelector } from 'react-redux';
import styles from './ingredient-details.module.css';

const IngredientDetails = () => {
    const { item: ingredient } = useSelector((state) => state.ingredientDetails);

    if (!ingredient) return null;

    return (
        <div className={styles.details}>
            <img
                src={ingredient.image_large}
                alt={ingredient.name}
                className={styles.image}
            />
            <h3 className={`text text_type_main-medium mt-4 ${styles.name}`}>
                {ingredient.name}
            </h3>

            <div className={`mt-8 mb-15 ${styles.nutrition}`}>
                <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Калории,ккал
          </span>
                    <span className="text text_type_digits-default text_color_inactive mt-2">
            {ingredient.calories}
          </span>
                </div>

                <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Белки, г
          </span>
                    <span className="text text_type_digits-default text_color_inactive mt-2">
            {ingredient.proteins}
          </span>
                </div>

                <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Жиры, г
          </span>
                    <span className="text text_type_digits-default text_color_inactive mt-2">
            {ingredient.fat}
          </span>
                </div>

                <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Углеводы, г
          </span>
                    <span className="text text_type_digits-default text_color_inactive mt-2">
            {ingredient.carbohydrates}
          </span>
                </div>
            </div>
        </div>
    );
};

export default IngredientDetails;