import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import IngredientCard from './ingredient-card';
import styles from './burger-ingredients.module.css';
import { Ingredient } from '../../utils/types';
import {useAppSelector} from "../../hooks/redux";

interface BurgerIngredientsProps {
	onIngredientClick: (ingredient: Ingredient) => void;
}

type IngredientType = 'bun' | 'sauce' | 'main';

interface IngredientGroups {
	bun: Ingredient[];
	sauce: Ingredient[];
	main: Ingredient[];
}

interface TabRefs {
	bun: React.RefObject<HTMLDivElement>;
	sauce: React.RefObject<HTMLDivElement>;
	main: React.RefObject<HTMLDivElement>;
}

const BurgerIngredients = ({ onIngredientClick }: BurgerIngredientsProps) => {
	const [currentTab, setCurrentTab] = useState<IngredientType>('bun');
	const containerRef = useRef<HTMLDivElement>(null);

	const { items: ingredients } = useAppSelector(state => state.ingredients);
	const { bun, ingredients: constructorIngredients } = useAppSelector(
		state => state.burgerConstructor
	);

	const tabsRef = useRef<TabRefs>({
		bun: useRef<HTMLDivElement>(null),
		sauce: useRef<HTMLDivElement>(null),
		main: useRef<HTMLDivElement>(null)
	});

	const categories = useMemo(
		() => [
			{ type: 'bun' as const, title: 'Булки' },
			{ type: 'sauce' as const, title: 'Соусы' },
			{ type: 'main' as const, title: 'Начинки' }
		],
		[]
	);

	const groupedIngredients = useMemo(() => {
		const groups: IngredientGroups = { bun: [], sauce: [], main: [] };
		ingredients.forEach((ingredient) => {
			if (groups[ingredient.type]) {
				groups[ingredient.type].push(ingredient);
			}
		});
		return groups;
	}, [ingredients]);

	const handleTabClick = useCallback((type: IngredientType) => {
		setCurrentTab(type);
		const section = document.getElementById(type);
		const container = containerRef.current;
		if (section && container) {
			const offset = 20;
			const containerTop = container.getBoundingClientRect().top;
			const sectionTop = section.getBoundingClientRect().top;
			const scrollTop = container.scrollTop;
			const top = scrollTop + (sectionTop - containerTop) - offset;
			container.scrollTo({ top, behavior: 'smooth' });
		}
	}, []);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const categoryElements = categories
			.map(({ type }) => document.getElementById(type))
			.filter(Boolean) as HTMLElement[];

		const handleScroll = () => {
			const containerTop = container.getBoundingClientRect().top;
			let closestCategory: IngredientType | null = null;
			let smallestDistance = Infinity;

			categoryElements.forEach((element) => {
				const elementTop = element.getBoundingClientRect().top;
				const distance = Math.abs(elementTop - containerTop);

				if (distance < smallestDistance) {
					smallestDistance = distance;
					closestCategory = element.id as IngredientType;
				}
			});

			if (closestCategory && closestCategory !== currentTab) {
				setCurrentTab(closestCategory);
			}
		};

		container.addEventListener('scroll', handleScroll);
		return () => container.removeEventListener('scroll', handleScroll);
	}, [ingredients, currentTab, categories]);

	return (
		<section className={styles.section}>
			<h1 className="text text_type_main-large mb-5">Соберите бургер</h1>

			<div className={styles.tabs}>
				{categories.map(({ type, title }) => (
					<Tab
						key={type}
						value={type}
						active={currentTab === type}
						onClick={() => handleTabClick(type)}
						data-active={currentTab === type}
						data-testid={`tab-${type}`}
					>
						{title}
					</Tab>
				))}
			</div>

			<div className={styles.ingredientsContainer} ref={containerRef}>
				{categories.map(({ type, title }) => {
					const ingredients = groupedIngredients[type];
					const tabRef = tabsRef.current[type];

					return ingredients.length > 0 ? (
						<div
							key={type}
							id={type}
							className={styles.ingredientsSection}
							ref={tabRef}
						>
							<h2 className="text text_type_main-medium mt-10 mb-6">{title}</h2>
							<div className={styles.ingredientsGrid}>
								{ingredients.map((item) => (
									<IngredientCard
										key={item._id}
										item={item}
										count={
											item.type === 'bun'
												? bun?._id === item._id
													? 2
													: 0
												: constructorIngredients.filter(
													(ing) => ing._id === item._id
												).length
										}
										onClick={() => onIngredientClick(item)}
									/>
								))}
							</div>
						</div>
					) : null;
				})}
			</div>
		</section>
	);
};

export default BurgerIngredients;