import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './app-header.module.css';
import NavItem from './nav-item/nav-item';

const AppHeader = () => {
    return (
        <header className={`${styles.header} pt-4 pb-4`}>
            <div className={styles.container}>
                <nav className={styles.nav}>
                    {/* Левый блок навигации */}
                    <div className={`${styles.navBlock} ${styles.left}`}>
                        <NavItem
                            icon={<BurgerIcon type="secondary" />}
                            text="Конструктор"
                            to="/"
                            exact
                            isActive  // Добавляем пропс для активного состояния
                        />
                        <NavItem
                            icon={<ListIcon type="secondary" />}
                            text="Лента заказов"
                            to="/feed"
                        />
                    </div>

                    {/* Центральный логотип */}
                    <div className={styles.logo}>
                        <Logo />
                    </div>

                    {/* Правый блок (личный кабинет) */}
                    <div className={`${styles.navBlock} ${styles.right}`}>
                        <NavItem
                            icon={<ProfileIcon type="secondary" />}
                            text="Личный кабинет"
                            to="/profile"
                        />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default AppHeader;