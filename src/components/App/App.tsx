import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import AppHeader from '../app-header/app-header';
import BurgerIngredients from '../burger-ingredients/burger-ingredients';
import BurgerConstructor from '../burger-constructor/burger-constructor';
import Modal from '../modal/modal';
import IngredientDetails from '../ingredient-details/ingredient-details';
import OrderDetails from '../order-details/order-details';
import LoginPage from '../../pages/login/login';
import RegisterPage from '../../pages/register/register';
import ForgotPasswordPage from '../../pages/forgot-password/forgot-password';
import ResetPasswordPage from '../../pages/reset-password/reset-password';
import ProfilePage from '../../pages/profile/profile';
import IngredientDetailsPage from '../../pages/ingredient-details/ingredient-details';
import FeedPage from '../../pages/feed/feed';
import OrderInfo from '../../pages/order-info/order-info';
import styles from './app.module.css';
import { fetchIngredients } from '../../services/ingredients/slice';
import {
	setIngredientDetails,
	clearIngredientDetails
} from '../../services/ingredient-details/slice';
import { clearOrder } from '../../services/order/slice';
import { clearConstructor } from "../../services/constructor/slice";
import { checkUserAuth } from "../../services/auth/actions";
import { ProtectedRouteElement } from "../protected-route-element/protected-route-element";
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { Ingredient } from "../../utils/types";

function App() {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const background = location.state?.background;

	useEffect(() => {
		dispatch(fetchIngredients());
		dispatch(checkUserAuth());
	}, [dispatch]);

	const {
		loading,
		error
	} = useAppSelector(state => state.ingredients);
	const { number: orderNumber, error: orderError } = useAppSelector(
		state => state.order
	);

	const [modalType, setModalType] = useState<'order' | 'error' | null>(null);

	const handleIngredientClick = (ingredient: Ingredient) => {
		dispatch(setIngredientDetails(ingredient));
		navigate(`/ingredients/${ingredient._id}`, {
			state: { background: location }
		});
	};

	useEffect(() => {
		if (orderNumber) setModalType('order');
	}, [orderNumber]);

	useEffect(() => {
		if (orderError) setModalType('error');
	}, [orderError]);

	const closeModal = () => {
		dispatch(clearIngredientDetails());
		dispatch(clearOrder());
		if (modalType === 'order') {
			dispatch(clearConstructor());
		}
		setModalType(null);
		if (background) {
			navigate(-1);
		}
	};

	if (loading) return <div className={styles.app}>Loading...</div>;
	if (error) return <div className={styles.app}>Error: {error}</div>;

	const isHomePage = location.pathname === '/';
	const isModalOpen = !!background;
	const mainClassName = isHomePage || isModalOpen ? styles.home : styles.regular;

	const orderData = location.state?.order;

	return (
		<div className={styles.app}>
			<AppHeader />
			<main className={`${styles.main} ${mainClassName}`}>
				<Routes location={background || location}>
					<Route path="/" element={
						<DndProvider backend={HTML5Backend}>
							<BurgerIngredients onIngredientClick={handleIngredientClick} />
							<BurgerConstructor />
						</DndProvider>
					} />

					<Route path="/login" element={
						<ProtectedRouteElement onlyUnAuth element={<LoginPage />} />
					} />
					<Route path="/register" element={
						<ProtectedRouteElement onlyUnAuth element={<RegisterPage />} />
					} />
					<Route path="/forgot-password" element={
						<ProtectedRouteElement onlyUnAuth element={<ForgotPasswordPage />} />
					} />
					<Route path="/reset-password" element={
						<ProtectedRouteElement onlyUnAuth onlyFromForgot element={<ResetPasswordPage />} />
					} />

					<Route path="/profile" element={
						<ProtectedRouteElement element={<ProfilePage />} />
					} />
					<Route path="/profile/orders" element={
						<ProtectedRouteElement element={<ProfilePage />} />
					} />
					<Route path="/profile/orders/:number" element={
						<ProtectedRouteElement element={<OrderInfo />} />
					} />

					<Route path="/ingredients/:id" element={
						<IngredientDetailsPage />} />
					<Route path="/feed" element={
						<FeedPage />} />
					<Route path="/feed/:number" element={
						<OrderInfo />} />

				</Routes>

				{background && (
					<Routes>
						<Route
							path="/ingredients/:id"
							element={
								<Modal title="Детали ингредиента" onClose={closeModal}>
									<IngredientDetails />
								</Modal>
							}
						/>
						<Route
							path="/feed/:number"
							element={
								<Modal title={"Детали заказа"} onClose={closeModal}>
									<OrderInfo order={orderData} inModal={true} />
								</Modal>
							}
						/>
						<Route
							path="/profile/orders/:number"
							element={
								<Modal title={"Детали заказа"} onClose={closeModal}>
									<OrderInfo order={orderData} inModal={true}/>
								</Modal>
							}
						/>
					</Routes>
				)}

				{orderNumber && modalType === 'order' && (
					<Modal title="" onClose={closeModal}>
						<OrderDetails />
					</Modal>
				)}

				{orderError && modalType === 'error' && (
					<Modal title="Ошибка" onClose={closeModal}>
						<div className="text text_type_main-default">
							Произошла ошибка при создании заказа: {orderError}
						</div>
					</Modal>
				)}
			</main>
		</div>
	);
}

export default App;