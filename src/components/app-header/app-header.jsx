import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';
import styles from './app-header.module.css';
import NavItem from './nav-item/nav-item';

const AppHeader = () => {
    return (
        <header className={`${styles.header} pt-4 pb-4`}>
            <div className={styles.container}>
                <nav className={styles.nav}>
                    {/* Левый блок навигации */}
                    <div className={`${styles.navBlock} ${styles.left}`}>
                        <NavLink to="/" className={styles.link}>
                            {({ isActive }) => (
                                <NavItem
                                    icon={<BurgerIcon type={isActive ? 'primary' : 'secondary'} />}
                                    text="Конструктор"
                                    isActive={isActive}
                                />
                            )}
                        </NavLink>
                        <NavLink to="/feed" className={styles.link}>
                            {({ isActive }) => (
                                <NavItem
                                    icon={<ListIcon type={isActive ? 'primary' : 'secondary'} />}
                                    text="Лента заказов"
                                    isActive={isActive}
                                />
                            )}
                        </NavLink>
                    </div>

                    {/* Центральный логотип */}
                    <div className={styles.logo}>
                        <Logo />
                    </div>

                    {/* Правый блок (личный кабинет) */}
                    <div className={`${styles.navBlock} ${styles.right}`}>
                        <NavLink to="/profile" className={styles.link}>
                            {({ isActive }) => (
                                <NavItem
                                    icon={<ProfileIcon type={isActive ? 'primary' : 'secondary'} />}
                                    text="Личный кабинет"
                                    isActive={isActive}
                                />
                            )}
                        </NavLink>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default AppHeader;