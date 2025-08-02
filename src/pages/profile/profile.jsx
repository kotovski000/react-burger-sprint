import { NavLink, useNavigate } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { logoutUser, updateUser } from '../../services/auth/slice';
import { useDispatch, useSelector } from 'react-redux';
import styles from './profile.module.css';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);

    // Инициализация формы
    useEffect(() => {
        if (user) {
            setForm({
                name: user.name,
                email: user.email,
                password: ''
            });
        }
    }, [user]);

    // Проверка изменений в форме
    useEffect(() => {
        const nameChanged = form.name !== user?.name;
        const emailChanged = form.email !== user?.email;
        const passwordChanged = form.password !== '';

        setIsFormChanged(nameChanged || emailChanged || passwordChanged);
    }, [form, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const startEditing = () => {
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setForm({
            name: user?.name || '',
            email: user?.email || '',
            password: ''
        });
        setIsEditing(false);
        setShowPassword(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormChanged) {
            setIsEditing(false);
            return;
        }

        try {
            const userData = {
                name: form.name,
                email: form.email,
                ...(form.password && { password: form.password })
            };

            await dispatch(updateUser(userData)).unwrap();

            // После успешного обновления
            setIsEditing(false);
            setShowPassword(false);
            setForm(prev => ({ ...prev, password: '' }));

        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
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
                        />
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