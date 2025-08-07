import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import IngredientCard from './ingredient-card';
import styles from './burger-ingredients.module.css';

const BurgerIngredients = ({ onIngredientClick }) => {
    const [currentTab, setCurrentTab] = useState('bun');
    const containerRef = useRef(null);

    const { items: ingredients } = useSelector((state) => state.ingredients);
    const { bun, ingredients: constructorIngredients } = useSelector(
        (state) => state.burgerConstructor
    );

    const tabsRef = useRef({
        bun: useRef(null),
        sauce: useRef(null),
        main: useRef(null)
    });

    const categories = useMemo(
        () => [
            { type: 'bun', title: 'Булки' },
            { type: 'sauce', title: 'Соусы' },
            { type: 'main', title: 'Начинки' }
        ],
        []
    );

    const groupedIngredients = useMemo(() => {
        const groups = { bun: [], sauce: [], main: [] };
        ingredients.forEach((ingredient) => groups[ingredient.type].push(ingredient));
        return groups;
    }, [ingredients]);


    const handleTabClick = useCallback((type) => {
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
            .filter(Boolean);

        const handleScroll = () => {
            const containerTop = container.getBoundingClientRect().top;
            let closestCategory = null;
            let smallestDistance = Infinity;

            categoryElements.forEach((element) => {
                const elementTop = element.getBoundingClientRect().top;
                const distance = Math.abs(elementTop - containerTop);

                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    closestCategory = element.id;
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
                    >
                        {title}
                    </Tab>
                ))}
            </div>

            <div className={styles.ingredientsContainer} ref={containerRef}>
                {categories.map(
                    ({ type, title }) =>
                        groupedIngredients[type].length > 0 && (
                            <div
                                key={type}
                                id={type}
                                className={styles.ingredientsSection}
                                ref={tabsRef.current[type]}
                            >
                                <h2 className="text text_type_main-medium mt-10 mb-6">{title}</h2>
                                <div className={styles.ingredientsGrid}>
                                    {groupedIngredients[type].map((item) => (
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
                        )
                )}
            </div>
        </section>
    );
};

export default BurgerIngredients;