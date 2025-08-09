import { NavLink, useNavigate } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import React, { useEffect, useState } from 'react';
import { logoutUser, updateUser } from '../../services/auth/slice';
import { useDispatch, useSelector } from 'react-redux';
import styles from './profile.module.css';
import { AppDispatch, RootState } from '../../services/store';

interface FormValues {
	name: string;
	email: string;
	password: string;
}

const ProfilePage = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { user, loading, error, accessToken } = useSelector((state: RootState) => state.auth);

	const [form, setForm] = useState<FormValues>({
		name: '',
		email: '',
		password: ''
	});
	const [isEditing, setIsEditing] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isFormChanged, setIsFormChanged] = useState(false);
	const [updateError, setUpdateError] = useState<string>('');

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
					<NavLink
						to="/profile"
						end
						className={({ isActive }) =>
							`${styles.link} text text_type_main-medium ${isActive ? styles.active : 'text_color_inactive'}`
						}
					>
						Профиль
					</NavLink>
					<NavLink
						to="/profile/orders"
						className={({ isActive }) =>
							`${styles.link} text text_type_main-medium ${isActive ? styles.active : 'text_color_inactive'}`
						}
					>
						История заказов
					</NavLink>
					<button
						className={`${styles.link} text text_type_main-medium text_color_inactive`}
						onClick={handleLogout}
					>
						Выход
					</button>
				</nav>
				<p className={`${styles.hint} text text_type_main-default text_color_inactive mt-20`}>
					В этом разделе вы можете изменить свои персональные данные
				</p>
			</div>

			<div className={styles.content}>
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
			</div>
		</div>
	);
};

export default ProfilePage;