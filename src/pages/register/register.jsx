import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useForm } from '../../hooks/useForm';
import { registerUser } from '../../services/auth/slice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import styles from './register.module.css';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.auth);
    const { values, handleChange } = useForm({
        name: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(values));
    };

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className={styles.container}>
            <h1 className={`text text_type_main-medium ${styles.title}`}>Регистрация</h1>
            {error && <p className={`text text_type_main-default ${styles.error}`}>{error}</p>}
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="Имя"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    extraClass="mb-6"
                    required
                />
                <Input
                    type="email"
                    placeholder="E-mail"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    extraClass="mb-6"
                    required
                />
                <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Пароль"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    icon={showPassword ? 'HideIcon' : 'ShowIcon'}
                    onIconClick={() => setShowPassword(prev => !prev)}
                    extraClass="mb-6"
                    required
                />
                <Button
                    htmlType="submit"
                    type="primary"
                    size="medium"
                    extraClass="mb-20"
                    disabled={loading}
                >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
            </form>
            <p className="text text_type_main-default text_color_inactive mb-4">
                Уже зарегистрированы?{' '}
                <Link to="/login" className={styles.link}>
                    Войти
                </Link>
            </p>
        </div>
    );
};

export default RegisterPage;