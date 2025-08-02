import { Link } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './reset-password.module.css';

const ResetPasswordPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={`text text_type_main-medium ${styles.title}`}>Восстановление пароля</h1>
            <form className={styles.form}>
                <Input
                    type="password"
                    placeholder="Введите новый пароль"
                    name="password"
                    icon="ShowIcon"
                    extraClass="mb-6"
                />
                <Input
                    type="text"
                    placeholder="Введите код из письма"
                    name="token"
                    extraClass="mb-6"
                />
                <Button htmlType="submit" type="primary" size="medium" extraClass="mb-20">
                    Сохранить
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