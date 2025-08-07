import { useState, useEffect } from 'react';
import AppHeader from '../app-header/app-header';
import BurgerIngredients from '../burger-ingredients/burger-ingredients';
import BurgerConstructor from '../burger-constructor/burger-constructor';
import Modal from '../modal/modal';
import IngredientDetails from '../ingredient-details/ingredient-details';
import OrderDetails from '../order-details/order-details';
import styles from './app.module.css';
import { API_URL } from '../../utils/constants';

interface Ingredient {
    _id: string;
    name: string;
    type: 'bun' | 'sauce' | 'main';
    price: number;
    image: string;
    image_mobile: string;
    image_large: string;
    calories: number;
    proteins: number;
    fat: number;
    carbohydrates: number;
    count: number;
}

type ActiveModal = 'ingredient' | 'order' | null;

function App() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
    const [orderNumber, setOrderNumber] = useState<number | null>(null);
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch(`${API_URL}/ingredients`);
                if (!response.ok) throw new Error(`HTTP error. status: ${response.status}`);
                const data = await response.json();
                if (data.success) setIngredients(data.data);
                else throw new Error('API request was not successful');
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                console.error('Error fetching ingredients:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchIngredients();
    }, []);

    const handleIngredientClick = (ingredient: Ingredient) => {
        setSelectedIngredient(ingredient);
        setActiveModal('ingredient');
    };

    const handleOrderClick = () => {
        //генерация случайного номера
        setOrderNumber(Math.floor(Math.random() * 1000000));
        setActiveModal('order');
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedIngredient(null);
        setOrderNumber(null);
    };

    if (loading) return <div className={styles.app}>Loading...</div>;
    if (error) return <div className={styles.app}>Error: {error}</div>;

    return (
        <div className={styles.app}>
            <AppHeader />
            <main className={styles.main}>
                <BurgerIngredients
                    ingredients={ingredients}
                    onIngredientClick={handleIngredientClick}
                />
                <BurgerConstructor
                    ingredients={ingredients}
                    onOrderClick={handleOrderClick}
                />
            </main>

            {activeModal === 'ingredient' && selectedIngredient && (
                <Modal title="Детали ингредиента" onClose={closeModal}>
                    <IngredientDetails ingredient={selectedIngredient} />
                </Modal>
            )}

            {activeModal === 'order' && orderNumber && (
                <Modal title="" onClose={closeModal}>
                    <OrderDetails orderNumber={orderNumber} />
                </Modal>
            )}
        </div>
    );
}

export default App;