import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './profile-orders.module.css';
import { useProfileWebSocket } from '../../hooks/use-web-socket';
import { RootState } from '../../services/store';
import { serializeOrder } from '../../utils/orderUtils';

const ProfileOrdersPage: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { orders, loading, error, wsConnected } = useProfileWebSocket();
	const ingredients = useSelector((state: RootState) => state.ingredients.items);
	const { user } = useSelector((state: RootState) => state.auth);

	const handleOrderClick = (order: any) => {
		const serializedOrder = serializeOrder(order);
		navigate(`/profile/orders/${order.number}`, {
			state: { background: location, order: serializedOrder, fromProfile: true }
		});
	};

	const calculateOrderTotal = (orderIngredients: string[]) => {
		return orderIngredients.reduce((total, id) => {
			const ingredient = ingredients.find((ing: { _id: string; }) => ing._id === id);
			return total + (ingredient?.price || 0);
		}, 0);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			return `Сегодня, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
		} else if (diffDays === 1) {
			return `Вчера, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
		} else {
			return `${diffDays} дней назад, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'done': return 'Выполнен';
			case 'pending': return 'Готовится';
			case 'created': return 'Создан';
			default: return status;
		}
	};

	if (!user) {
		return <div className={styles.container}>Требуется авторизация</div>;
	}

	if (error?.includes('token')) {
		return (
			<div className={styles.container}>
				<div className="text text_type_main-default text_color_error mb-6">
					Ошибка авторизации. Пожалуйста, войдите снова.
				</div>
			</div>
		);
	}

	if (loading) {
		return <div className={styles.container}>Загрузка...</div>;
	}

	if (error) {
		return <div className={styles.container}>Ошибка: {error}</div>;
	}

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>История заказов</h1>
			{!wsConnected && (
				<div className="text text_type_main-default text_color_inactive mb-6">
					Соединение обновляется...
				</div>
			)}
			<div className={styles.ordersContainer}>
				{orders.map((order: { _id: React.Key | null | undefined; number: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; createdAt: string; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; status: string; ingredients: any[]; }) => (
					<div
						key={order._id}
						className={styles.orderCard}
						onClick={() => handleOrderClick(order)}
					>
						<div className={styles.orderHeader}>
							<span className={styles.orderNumber}>#{order.number}</span>
							<span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
						</div>

						<h3 className={styles.orderName}>{order.name}</h3>

						<div className={`${styles.orderStatus} ${styles[`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`]}`}>
							{getStatusText(order.status)}
						</div>

						<div className={styles.orderIngredients}>
							<div className={styles.ingredientsList}>
								{order.ingredients.slice(0, 6).map((ingredientId, index) => {
									const ingredient = ingredients.find((ing: { _id: any; }) => ing._id === ingredientId);
									return (
										<div key={index} className={styles.ingredientCircle}>
											{index === 5 && order.ingredients.length > 6 && (
												<span className={styles.ingredientCount}>+{order.ingredients.length - 6}</span>
											)}
											{ingredient && (
												<img
													src={ingredient.image}
													alt={ingredient.name}
													className={styles.ingredientImage}
												/>
											)}
										</div>
									);
								})}
							</div>

							<div className={styles.orderTotal}>
                <span className={styles.totalPrice}>
                  {calculateOrderTotal(order.ingredients)}
                </span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProfileOrdersPage;