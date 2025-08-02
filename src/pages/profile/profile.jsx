import { NavLink } from 'react-router-dom';
import { Input } from '@ya.praktikum/react-developer-burger-ui-components';
import { useState } from 'react';
import styles from './profile.module.css';

const ProfilePage = () => {
    const [form] = useState({
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        password: '********'
    });

    const handleEditClick = () => {
    };

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
                    <button className={`${styles.link} text text_type_main-medium text_color_inactive`}>
                        Выход
                    </button>
                </nav>
                <p className={`${styles.hint} text text_type_main-default text_color_inactive mt-20`}>
                    В этом разделе вы можете изменить свои персональные данные
                </p>
            </div>

            <div className={styles.content}>
                <form className={`${styles.form}`}>
                    <Input
                        type={'text'}
                        placeholder={'Имя'}
                        value={form.name}
                        name={'name'}
                        error={false}
                        errorText={'Ошибка'}
                        size={'default'}
                        icon={'EditIcon'}
                        disabled={true}
                        onIconClick={handleEditClick}
                        extraClass={'text_color_inactive'}
                    />
                    <Input
                        type={'email'}
                        placeholder={'Логин'}
                        value={form.email}
                        name={'email'}
                        error={false}
                        errorText={'Ошибка'}
                        size={'default'}
                        icon={'EditIcon'}
                        disabled={true}
                        onIconClick={handleEditClick}
                        extraClass={`mt-6 text_color_inactive`}
                    />
                    <Input
                        type={'password'}
                        placeholder={'Пароль'}
                        value={form.password}
                        name={'password'}
                        error={false}
                        errorText={'Ошибка'}
                        size={'default'}
                        icon={'EditIcon'}
                        disabled={true}
                        onIconClick={handleEditClick}
                        extraClass={`mt-6 text_color_inactive`}
                    />
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;