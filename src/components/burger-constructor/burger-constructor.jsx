import React, { useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop, useDrag } from 'react-dnd';
import {
    ConstructorElement,
    Button,
    CurrencyIcon,
    DragIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { ItemTypes } from '../../utils/dnd-types';
import {
    addIngredient,
    removeIngredient,
    moveIngredient
} from '../../services/constructor/slice';
import { createOrder } from '../../services/order/slice';

const BurgerConstructor = () => {
    const dispatch = useDispatch();
    const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
    const { loading: orderLoading } = useSelector((state) => state.order);
    const { items: allIngredients } = useSelector((state) => state.ingredients);

    const [, dropTarget] = useDrop({
        accept: ItemTypes.INGREDIENT,
        drop(item) {
            const ingredient = allIngredients.find((ing) => ing._id === item.id);
            if (ingredient) {
                dispatch(addIngredient(ingredient));
            }
        }
    });

    const totalPrice = useMemo(() => {
        const bunPrice = bun ? bun.price * 2 : 0;
        const ingredientsPrice = ingredients.reduce(
            (sum, item) => sum + item.price,
            0
        );
        return bunPrice + ingredientsPrice;
    }, [bun, ingredients]);

    const handleOrderClick = () => {
        if (!bun) return;

        const ingredientsIds = [
            bun._id,
            ...ingredients.map((item) => item._id),
            bun._id
        ];

        dispatch(createOrder(ingredientsIds));
    };

    return (
        <section
            className={`${styles.constructor} mt-25 pl-4 pr-4`}
            ref={dropTarget}
            data-testid="burger-constructor"
        >
            {bun && (
                <ConstructorElement
                    type="top"
                    isLocked={true}
                    text={`${bun.name} (верх)`}
                    price={bun.price}
                    thumbnail={bun.image}
                    extraClass={`${styles.bun} ${styles.fixedSize}`}
                />
            )}

            <div className={`${styles.scrollableList} custom-scroll`}>
                {ingredients.map((item, index) => (
                    <DraggableConstructorElement
                        key={item.id}
                        item={item}
                        index={index}
                        moveCard={(dragIndex, hoverIndex) =>
                            dispatch(moveIngredient({ dragIndex, hoverIndex }))
                        }
                        onRemove={() => dispatch(removeIngredient(item.id))}
                    />
                ))}
            </div>

            {bun && (
                <ConstructorElement
                    type="bottom"
                    isLocked={true}
                    text={`${bun.name} (низ)`}
                    price={bun.price}
                    thumbnail={bun.image}
                    extraClass={`${styles.bun} ${styles.fixedSize}`}
                />
            )}

            <div className={`${styles.total} mt-10`}>
                <div className={`${styles.price} mr-10`}>
                    <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
                    <CurrencyIcon type="primary" />
                </div>
                <Button
                    type="primary"
                    size="large"
                    onClick={handleOrderClick}
                    disabled={!bun || orderLoading}
                    data-testid="order-button"
                >
                    {orderLoading ? 'Оформляем...' : 'Оформить заказ'}
                </Button>
            </div>
        </section>
    );
};

const DraggableConstructorElement = ({ item, index, moveCard, onRemove }) => {
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CONSTRUCTOR_INGREDIENT,
        item: () => ({ id: item.id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const [, drop] = useDrop({
        accept: ItemTypes.CONSTRUCTOR_INGREDIENT,
        hover: (draggedItem, monitor) => {
            if (!ref.current) return;

            const dragIndex = draggedItem.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveCard(dragIndex, hoverIndex);
            draggedItem.index = hoverIndex;
        }
    });

    drag(drop(ref));

    const opacity = isDragging ? 0 : 1;

    return (
        <div
            ref={ref}
            className={styles.draggableItem}
            style={{ opacity }}
            data-testid={`constructor-item-${item.id}`}
        >
            <DragIcon type="primary" />
            <ConstructorElement
                text={item.name}
                price={item.price}
                thumbnail={item.image}
                extraClass={styles.ingredient}
                handleClose={onRemove}
            />
        </div>
    );
};

export default BurgerConstructor;