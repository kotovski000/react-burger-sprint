import { Link } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './login.module.css';

const LoginPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={`text text_type_main-medium ${styles.title}`}>Вход</h1>
            <form className={styles.form}>
                <Input
                    type="email"
                    placeholder="E-mail"
                    name="email"
                    extraClass="mb-6"
                />
                <Input
                    type="password"
                    placeholder="Пароль"
                    name="password"
                    extraClass="mb-6"
                    icon="ShowIcon"
                />
                <Button htmlType="submit" type="primary" size="medium" extraClass="mb-20">
                    Войти
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