import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import React, { useEffect, useState } from 'react';
import { logoutUser, updateUser } from '../../services/auth/slice';
import { useDispatch, useSelector } from 'react-redux';
import styles from './profile.module.css';
import { AppDispatch, RootState } from '../../services/store';
import { useProfileWebSocket } from '../../hooks/useWebSocket';
import { serializeOrder } from '../../utils/orderUtils';

interface FormValues {
	name: string;
	email: string;
	password: string;
}

const ProfilePage = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const location = useLocation();
	const { section } = useParams();
	const { user, loading, error, accessToken } = useSelector((state: RootState) => state.auth);
	const ingredients = useSelector((state: RootState) => state.ingredients.items);
	const { orders: profileOrders, loading: ordersLoading, error: ordersError } = useProfileWebSocket();

	const [form, setForm] = useState<FormValues>({
		name: '',
		email: '',
		password: ''
	});
	const [isEditing, setIsEditing] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isFormChanged, setIsFormChanged] = useState(false);
	const [updateError, setUpdateError] = useState<string>('');
	const [activeTab, setActiveTab] = useState<'profile' | 'orders'>(section === 'orders' ? 'orders' : 'profile');

	const sortedOrders = [...profileOrders].sort((a, b) =>
		new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);

	useEffect(() => {
		if (user) {
			setForm({
				name: user.name,
				email: user.email,
				password: ''
			});
		}
	}, [user]);

	useEffect(() => {
		if (section === 'orders') {
			setActiveTab('orders');
		} else {
			setActiveTab('profile');
		}
	}, [section]);

	useEffect(() => {
		const initialValues = {
			name: user?.name || '',
			email: user?.email || '',
			password: ''
		};

		setIsFormChanged(
			form.name !== initialValues.name ||
			form.email !== initialValues.email ||
			form.password !== initialValues.password
		);
	}, [form, user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const startEditing = () => {
		setIsEditing(true);
		setUpdateError('');
	};

	const cancelEditing = () => {
		setForm({
			name: user?.name || '',
			email: user?.email || '',
			password: ''
		});
		setIsEditing(false);
		setShowPassword(false);
		setUpdateError('');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormChanged || !accessToken) {
			setIsEditing(false);
			return;
		}

		try {
			setUpdateError('');
			const userData = {
				name: form.name,
				email: form.email,
				...(form.password && { password: form.password })
			};

			await dispatch(updateUser({ accessToken, userData })).unwrap();

			setIsEditing(false);
			setShowPassword(false);
			setForm(prev => ({ ...prev, password: '' }));

		} catch (error) {
			console.error('Ошибка при обновлении профиля:', error);
			setUpdateError(error instanceof Error ? error.message : 'Не удалось обновить профиль');
		}
	};

	const handleLogout = () => {
		const refreshToken = localStorage.getItem('refreshToken');
		if (refreshToken) {
			dispatch(logoutUser(refreshToken)).then(() => {
				navigate('/login');
			});
		}
	};

	const handleTabChange = (tab: 'profile' | 'orders') => {
		setActiveTab(tab);
		if (tab === 'orders') {
			navigate('/profile/orders', { replace: true });
		} else {
			navigate('/profile', { replace: true });
		}
	};

	const handleOrderClick = (order: any) => {
		const serializedOrder = serializeOrder(order);
		const targetPath = activeTab === 'orders'
			? `/profile/orders/${order.number}`
			: `/profile/${order.number}`;

		navigate(targetPath, {
			state: { background: location, order: serializedOrder }
		});
	};

	const calculateOrderTotal = (orderIngredients: string[]) => {
		return orderIngredients.reduce((total, id) => {
			const ingredient = ingredients.find(ing => ing._id === id);
			return total + (ingredient?.price || 0);
		}, 0);
	};

	const formatOrderDate = (dateString: string): string => {
		const date = new Date(dateString);
		const now = new Date();

		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		const orderDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

		if (orderDate.getTime() === today.getTime()) {
			return `Сегодня, ${date.toLocaleTimeString('ru-RU', {
				hour: '2-digit',
				minute: '2-digit'
			})}`;
		} else if (orderDate.getTime() === yesterday.getTime()) {
			return `Вчера, ${date.toLocaleTimeString('ru-RU', {
				hour: '2-digit',
				minute: '2-digit'
			})}`;
		} else {
			const daysDiff = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
			return `${daysDiff} дня назад, ${date.toLocaleTimeString('ru-RU', {
				hour: '2-digit',
				minute: '2-digit'
			})}`;
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

	const getStatusClass = (status: string) => {
		switch (status) {
			case 'done': return styles.statusDone;
			case 'pending': return styles.statusPending;
			case 'created': return styles.statusCreated;
			default: return '';
		}
	};

	if (loading && !user) {
		return <div className={styles.container}>Загрузка данных профиля...</div>;
	}

	if (error) {
		return <div className={styles.container}>Ошибка: {error}</div>;
	}

	return (
		<div className={styles.container}>
			<div className={styles.sidebar}>
				<nav className={styles.navigation}>
					<button
						onClick={() => handleTabChange('profile')}
						className={`${styles.link} text text_type_main-medium ${activeTab === 'profile' ? styles.active : 'text_color_inactive'}`}
					>
						Профиль
					</button>
					<button
						onClick={() => handleTabChange('orders')}
						className={`${styles.link} text text_type_main-medium ${activeTab === 'orders' ? styles.active : 'text_color_inactive'}`}
					>
						История заказов
					</button>
					<button
						className={`${styles.link} text text_type_main-medium text_color_inactive`}
						onClick={handleLogout}
					>
						Выход
					</button>
				</nav>
				<p className={`${styles.hint} text text_type_main-default text_color_inactive mt-20`}>
					{activeTab === 'profile'
						? 'В этом разделе вы можете изменить свои персональные данные'
						: 'В этом разделе вы можете просмотреть свою историю заказов'
					}
				</p>
			</div>

			<div className={styles.content}>
				{activeTab === 'profile' ? (
					<form className={styles.form} onSubmit={handleSubmit}>
						<Input
							type="text"
							placeholder="Имя"
							value={form.name}
							name="name"
							error={false}
							errorText="Ошибка"
							size="default"
							icon={isEditing ? 'CloseIcon' : 'EditIcon'}
							disabled={!isEditing}
							onIconClick={isEditing ? cancelEditing : startEditing}
							onChange={handleChange}
							onPointerEnterCapture={() => {}}
							onPointerLeaveCapture={() => {}}
						/>
						<Input
							type="email"
							placeholder="E-mail"
							value={form.email}
							name="email"
							error={false}
							errorText="Ошибка"
							size="default"
							icon={isEditing ? 'CloseIcon' : 'EditIcon'}
							disabled={!isEditing}
							onIconClick={isEditing ? cancelEditing : startEditing}
							onChange={handleChange}
							extraClass="mt-6"
							onPointerEnterCapture={() => {}}
							onPointerLeaveCapture={() => {}}
						/>
						{isEditing ? (
							<Input
								type={showPassword ? "text" : "password"}
								placeholder="Новый пароль"
								value={form.password}
								name="password"
								error={false}
								errorText="Ошибка"
								size="default"
								icon={showPassword ? "HideIcon" : "ShowIcon"}
								onIconClick={() => setShowPassword(!showPassword)}
								onChange={handleChange}
								extraClass="mt-6"
								onPointerEnterCapture={() => {}}
								onPointerLeaveCapture={() => {}}
							/>
						) : (
							<Input
								type="text"
								placeholder="Пароль"
								value="********"
								disabled
								size="default"
								icon="EditIcon"
								onIconClick={startEditing}
								extraClass="mt-6 text_color_inactive"
								onChange={() => {}}
								onPointerEnterCapture={() => {}}
								onPointerLeaveCapture={() => {}}
							/>
						)}
						{updateError && (
							<p className={`text text_type_main-default mt-6`}>
								{updateError}
							</p>
						)}
						{isEditing && (
							<div className={`${styles.buttons} mt-6`}>
								<Button
									htmlType="button"
									type="secondary"
									size="medium"
									onClick={cancelEditing}
									extraClass="mr-6"
								>
									Отмена
								</Button>
								<Button
									htmlType="submit"
									type="primary"
									size="medium"
									disabled={loading || !isFormChanged}
								>
									{loading ? 'Сохранение...' : 'Сохранить'}
								</Button>
							</div>
						)}
					</form>
				) : (
					<div className={styles.ordersSection}>
						{ordersLoading && (
							<div className="text text_type_main-default text_color_inactive mb-6">
								Загрузка заказов...
							</div>
						)}

						{ordersError && (
							<div className="text text_type_main-default text_color_error mb-6">
								Ошибка загрузки заказов: {ordersError}
							</div>
						)}

						<div className={styles.ordersContainer}>
							{sortedOrders.map(order => (
								<div
									key={order._id}
									className={styles.orderCard}
									onClick={() => handleOrderClick(order)}
								>
									<div className={styles.orderHeader}>
                    <span className={`${styles.orderNumber} text text_type_digits-default`}>
                      #{order.number}
                    </span>
										<span className={`${styles.orderDate} text text_type_main-default text_color_inactive`}>
                      {formatOrderDate(order.createdAt)}
                    </span>
									</div>

									<h3 className={`${styles.orderName} text text_type_main-medium`}>
										{order.name}
									</h3>

									<div className={`${styles.orderStatus} ${getStatusClass(order.status)} text text_type_main-default`}>
										{getStatusText(order.status)}
									</div>

									<div className={styles.orderFooter}>
										<div className={styles.ingredientsList}>
											{order.ingredients.slice(0, 6).map((ingredientId, index) => {
												const ingredient = ingredients.find(ing => ing._id === ingredientId);
												return (
													<div key={index} className={styles.ingredientCircle}>
														{index === 5 && order.ingredients.length > 6 && (
															<span className={styles.ingredientCount}>
                                +{order.ingredients.length - 6}
                              </span>
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
                      <span className={`${styles.totalPrice} text text_type_digits-default`}>
                        {calculateOrderTotal(order.ingredients)} ₽
                      </span>
										</div>
									</div>
								</div>
							))}
						</div>

						{sortedOrders.length === 0 && !ordersLoading && (
							<div className="text text_type_main-default text_color_inactive mt-10">
								У вас пока нет заказов
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ProfilePage;