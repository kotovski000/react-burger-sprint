import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ingredient-details.module.css';
import { setIngredientDetails, clearIngredientDetails } from '../../services/ingredient-details/slice';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";

const IngredientDetails = () => {
	const dispatch = useAppDispatch();
	const { items: ingredients } = useAppSelector(state => state.ingredients);
	const { item: ingredient } = useAppSelector(state => state.ingredientDetails);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		if (id && ingredients && ingredients.length > 0) {
			const foundIngredient = ingredients.find(ing => ing._id === id);
			if (foundIngredient) {
				dispatch(setIngredientDetails(foundIngredient));
			} else {
				console.error('Ingredient not found:', id);
			}
		}

		return () => {
			dispatch(clearIngredientDetails());
		};
	}, [id, ingredients, dispatch]);

	if (!ingredient) {
		return <div className="text text_type_main-default">Загрузка данных...</div>;
	}

	return (
		<div className={styles.details}>
			<img
				src={ingredient.image_large}
				alt={ingredient.name}
				className={styles.image}
				data-testid="ingredient-image"
			/>
			<h3 className={`text text_type_main-medium mt-4 ${styles.name}`} data-testid="ingredient-name">
				{ingredient.name}
			</h3>
			<div className={`mt-8 mb-15 ${styles.nutrition}`} data-testid="ingredient-nutrition">
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