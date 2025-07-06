import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AppHeader from '../app-header/app-header';
import BurgerIngredients from '../burger-ingredients/burger-ingredients';
import BurgerConstructor from '../burger-constructor/burger-constructor';
import Modal from '../modal/modal';
import IngredientDetails from '../ingredient-details/ingredient-details';
import OrderDetails from '../order-details/order-details';
import styles from './app.module.css';
import { fetchIngredients } from '../../services/ingredients/slice';
import {
    setIngredientDetails,
    clearIngredientDetails
} from '../../services/ingredient-details/slice';
import { clearOrder } from '../../services/order/slice';

function App() {
    const dispatch = useDispatch();
    const {
        items: ingredients,
        loading,
        error
    } = useSelector((state) => state.ingredients);
    const { item: selectedIngredient } = useSelector(
        (state) => state.ingredientDetails
    );
    const { number: orderNumber, error: orderError } = useSelector(
        (state) => state.order
    );

    useEffect(() => {
        dispatch(fetchIngredients());
    }, [dispatch]);

    const handleIngredientClick = (ingredient) => {
        dispatch(setIngredientDetails(ingredient));
    };

    const closeModal = () => {
        dispatch(clearIngredientDetails());
        dispatch(clearOrder());
    };

    if (loading) return <div className={styles.app}>Loading...</div>;
    if (error) return <div className={styles.app}>Error: {error}</div>;

    return (
        <div className={styles.app}>
            <AppHeader />
            <main className={styles.main}>
                <DndProvider backend={HTML5Backend}>
                    <BurgerIngredients
                        ingredients={ingredients}
                        onIngredientClick={handleIngredientClick}
                    />
                    <BurgerConstructor />
                </DndProvider>
            </main>

            {selectedIngredient && (
                <Modal title="Детали ингредиента" onClose={closeModal}>
                    <IngredientDetails />
                </Modal>
            )}

            {orderNumber && (
                <Modal title="" onClose={closeModal}>
                    <OrderDetails />
                </Modal>
            )}

            {orderError && (
                <Modal title="Ошибка" onClose={closeModal}>
                    <div className="text text_type_main-default">
                        Произошла ошибка при создании заказа: {orderError}
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default App;