import { Link } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './forgot-password.module.css';

const ForgotPasswordPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={`text text_type_main-medium ${styles.title}`}>Восстановление пароля</h1>
            <form className={styles.form}>
                <Input
                    type="email"
                    placeholder="Укажите e-mail"
                    name="email"
                    extraClass="mb-6"
                />
                <Button htmlType="submit" type="primary" size="medium" extraClass="mb-20">
                    Восстановить
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