import { Link } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './register.module.css';

const RegisterPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={`text text_type_main-medium ${styles.title}`}>Регистрация</h1>
            <form className={styles.form}>
                <Input
                    type="text"
                    placeholder="Имя"
                    name="name"
                    extraClass="mb-6"
                />
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
                    icon="ShowIcon"
                    extraClass="mb-6"
                />
                <Button htmlType="submit" type="primary" size="medium" extraClass="mb-20">
                    Зарегистрироваться
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