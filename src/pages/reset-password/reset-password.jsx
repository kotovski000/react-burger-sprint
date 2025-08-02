import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useForm } from '../../hooks/useForm';
import { resetPassword } from '../../services/auth/slice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import styles from './reset-password.module.css';

const ResetPasswordPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error, passwordReset } = useSelector((state) => state.auth);
    const { values, handleChange } = useForm({
        password: '',
        token: ''
    });

    // Проверяем, что пользователь пришел с forgot-password
    useEffect(() => {
        if (!location.state?.fromForgotPassword) {
            navigate('/forgot-password', { replace: true });
        }
    }, [location, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPassword({
            password: values.password,
            token: values.token
        }));
    };

    useEffect(() => {
        if (passwordReset) {
            navigate('/login', { replace: true });
        }
    }, [passwordReset, navigate]);

    return (
        <div className={styles.container}>
            <h1 className={`text text_type_main-medium ${styles.title}`}>Восстановление пароля</h1>
            {error && <p className={`text text_type_main-default ${styles.error}`}>{error}</p>}
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                    type="password"
                    placeholder="Введите новый пароль"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    icon="ShowIcon"
                    extraClass="mb-6"
                    required
                />
                <Input
                    type="text"
                    placeholder="Введите код из письма"
                    name="token"
                    value={values.token}
                    onChange={handleChange}
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
                    {loading ? 'Сохранение...' : 'Сохранить'}
                </Button>
            </form>
            <p className="text text_type_main-default text_color_inactive">
                Вспомнили пароль?{' '}
                <Link to="/login" className={styles.link}>
                    Войти
                </Link>
            </p>
        </div>
    );
};

export default ResetPasswordPage;