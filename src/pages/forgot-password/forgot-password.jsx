import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useForm } from '../../hooks/useForm';
import { forgotPassword } from '../../services/auth/slice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import styles from './forgot-password.module.css';

const ForgotPasswordPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, passwordResetRequested } = useSelector((state) => state.auth);
    const { values, handleChange } = useForm({ email: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(values.email));
    };

    useEffect(() => {
        if (passwordResetRequested) {
            navigate('/reset-password', {
                state: { fromForgotPassword: true },
                replace: true
            });
        }
    }, [passwordResetRequested, navigate]);

    return (
        <div className={styles.container}>
            <h1 className={`text text_type_main-medium ${styles.title}`}>Восстановление пароля</h1>
            {error && <p className={`text text_type_main-default ${styles.error}`}>{error}</p>}
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                    type="email"
                    placeholder="Укажите e-mail"
                    name="email"
                    value={values.email}
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
                    {loading ? 'Отправка...' : 'Восстановить'}
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

export default ForgotPasswordPage;