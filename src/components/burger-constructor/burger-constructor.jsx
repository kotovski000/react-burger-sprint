import React from 'react';
import { ConstructorElement, Button, CurrencyIcon, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { IngredientsArrayType } from '../../utils/types';


const BurgerConstructor = ({ ingredients }) => {
    const buns = ingredients.filter(ing => ing.type === 'bun');
    const mains = ingredients.filter(ing => ing.type !== 'bun');

    // Общая стоимость
    const totalPrice = ingredients.reduce((sum, item) => sum + item.price, 0);

    return (
        <section className={`${styles.constructor} mt-25 pl-4 pr-4`}>
            {/* Верхняя булка */}
            {buns.length > 0 && (
                <ConstructorElement
                    type="top"
                    isLocked={true}
                    text={`${buns[0].name} (верх)`}
                    price={buns[0].price}
                    thumbnail={buns[0].image}
                    extraClass={`${styles.bun} ${styles.fixedSize}`}
                />
            )}

            {/* Список начинок и соусов + прокрутка */}
            <div className={`${styles.scrollableList} custom-scroll`}>
                {mains.map((item, index) => (
                    <div key={item._id} className={styles.draggableItem}>
                        <DragIcon type="primary" />
                        <ConstructorElement
                            text={item.name}
                            price={item.price}
                            thumbnail={item.image}
                            extraClass={styles.ingredient}
                        />
                    </div>
                ))}
            </div>

            {/* Нижняя булка */}
            {buns.length > 0 && (
                <ConstructorElement
                    type="bottom"
                    isLocked={true}
                    text={`${buns[0].name} (низ)`}
                    price={buns[0].price}
                    thumbnail={buns[0].image}
                    extraClass={`${styles.bun} ${styles.fixedSize}`}
                />
            )}

            {/* Итоговая строка с ценой и кнопкой */}
            <div className={`${styles.total} mt-10`}>
                <div className={`${styles.price} mr-10`}>
                    <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
                    <CurrencyIcon type="primary" />
                </div>
                <Button
                    type="primary"
                    size="large"
                    htmlType="button"
                    disabled={buns.length === 0}
                >
                    Оформить заказ
                </Button>
            </div>
        </section>
    );
};

BurgerConstructor.propTypes = {
    ingredients: IngredientsArrayType
};

export default BurgerConstructor;