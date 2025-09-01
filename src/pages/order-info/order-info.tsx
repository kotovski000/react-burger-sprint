import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './order-info.module.css';
import { request } from '../../utils/api';
import {Orders, OrderFeedMessage} from '../../utils/types';
import { RootState } from '../../services/store';
import { deserializeOrder } from '../../utils/orderUtils';

const OrderInfo: React.FC<{ order?: Orders }> = ({ order }) => {
	const [orderData, setOrderData] = useState<Orders | null>(order || null);
	const [loading, setLoading] = useState(!order);
	const [error, setError] = useState<string | null>(null);
	const { number } = useParams();
	const location = useLocation();
	const ingredients = useSelector((state: RootState) => state.ingredients.items);

	useEffect(() => {
		const locationOrder = location.state?.order;
		if (locationOrder) {
			setOrderData(deserializeOrder(locationOrder));
			setLoading(false);
			return;
		}

		if (!order && number) {
			const fetchOrder = async () => {
				try {
					setLoading(true);
					const data: OrderFeedMessage = await request(`/orders/${number}`);
					if (data.success && data.orders.length > 0) {
						setOrderData(data.orders[0]);
						setError(null);
					} else {
						setError('Заказ не найден');
					}
				} catch (err) {
					setError('Не удалось загрузить заказ');
					console.error('Error fetching order:', err);
				} finally {
					setLoading(false);
				}
			};

			fetchOrder();
		}
	}, [order, number, location.state]);


	if (loading) {
		return <div className={styles.container}>Загрузка...</div>;
	}

	if (error || !orderData) {
		return <div className={styles.container}>Ошибка: {error || 'Заказ не найден'}</div>;
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return `${date.toLocaleDateString('ru-RU')}, ${date.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit'
		})}`;
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'done': return 'Выполнен';
			case 'pending': return 'Готовится';
			case 'created': return 'Создан';
			default: return status;
		}
	};

	const ingredientCounts = orderData.ingredients.reduce((acc, ingredientId) => {
		acc[ingredientId] = (acc[ingredientId] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const uniqueIngredients = Object.keys(ingredientCounts).map(id => {
		const ingredient = ingredients.find(ing => ing._id === id);
		return {
			...ingredient,
			count: ingredientCounts[id]
		};
	});

	const totalPrice = orderData.ingredients.reduce((total, id) => {
		const ingredient = ingredients.find(ing => ing._id === id);
		return total + (ingredient?.price || 0);
	}, 0);

	return (
		<div className={styles.container}>
			<span className={styles.orderNumber}>#{orderData.number}</span>

			<h2 className={styles.orderName}>{orderData.name}</h2>

			<div className={`${styles.orderStatus} ${styles[`status${orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}`]}`}>
				{getStatusText(orderData.status)}
			</div>

			<h3 className={styles.compositionTitle}>Состав:</h3>

			<div className={styles.ingredientsList}>
				{uniqueIngredients.map((ingredient, index) => (
					ingredient && (
						<div key={index} className={styles.ingredientItem}>
							<div className={styles.ingredientImage}>
								<img
									src={ingredient.image}
									alt={ingredient.name}
									className={styles.ingredientImg}
								/>
							</div>

							<span className={styles.ingredientName}>{ingredient.name}</span>

							<div className={styles.ingredientPrice}>
                <span className={styles.price}>
                  {ingredient.count} x {ingredient.price}
                </span>
							</div>
						</div>
					)
				))}
			</div>

			<div className={styles.footer}>
				<span className={styles.date}>{formatDate(orderData.createdAt)}</span>

				<div className={styles.totalPrice}>
					<span className={styles.total}>{totalPrice}</span>
				</div>
			</div>
		</div>
	);
};

export default OrderInfo;