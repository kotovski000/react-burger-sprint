import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useForm } from '../../hooks/use-form';
import { loginUser } from '../../services/auth/slice';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import styles from './login.module.css';
import {AppDispatch, RootState} from '../../services/store';

interface FormValues {
	email: string;
	password: string;
}

const LoginPage = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const location = useLocation();
	const { user, loading, error } = useSelector((state: RootState) => state.auth);
	const { values, handleChange } = useForm<FormValues>({ email: '', password: '' });
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(loginUser(values));
	};

	useEffect(() => {
		if (user) {
			const from = location.state?.from || '/';
			navigate(from, { replace: true });
		}
	}, [user, navigate, location]);

	return (
		<div className={styles.container}>
			<h1 className={`text text_type_main-medium ${styles.title}`}>Вход</h1>
			{error && <p className={`text text_type_main-default ${styles.error}`}>{error}</p>}
			<form className={styles.form} onSubmit={handleSubmit}>
				<Input
					type="email"
					placeholder="E-mail"
					name="email"
					value={values.email}
					onChange={handleChange}
					extraClass="mb-6"
					onPointerEnterCapture={() => {}}
					onPointerLeaveCapture={() => {}}
				/>
				<Input
					type={showPassword ? 'text' : 'password'}
					placeholder="Пароль"
					name="password"
					value={values.password}
					onChange={handleChange}
					extraClass="mb-6"
					icon={showPassword ? 'HideIcon' : 'ShowIcon'}
					onIconClick={() => setShowPassword(prev => !prev)}
					onPointerEnterCapture={() => {}}
					onPointerLeaveCapture={() => {}}
				/>
				<Button
					htmlType="submit"
					type="primary"
					size="medium"
					extraClass="mb-20"
					disabled={loading}
				>
					{loading ? 'Вход...' : 'Войти'}
				</Button>
			</form>
			<p className="text text_type_main-default text_color_inactive mb-4">
				Вы — новый пользователь?{' '}
				<Link to="/register" className={styles.link}>
					Зарегистрироваться
				</Link>
			</p>
			<p className="text text_type_main-default text_color_inactive">
				Забыли пароль?{' '}
				<Link to="/forgot-password" className={styles.link}>
					Восстановить пароль
				</Link>
			</p>
		</div>
	);
};

export default LoginPage;