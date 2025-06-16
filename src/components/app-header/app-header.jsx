import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './app-header.module.css';

const AppHeader = () => {
    return (
        <header className={`${styles.header} pt-4 pb-4`}>
            <div className={styles.container}>
                <nav className={styles.nav}>
                    {/* Левый блок навигации */}
                    <div className={`${styles.navBlock} ${styles.left}`}>
                        <NavItem
                            icon={<BurgerIcon type="primary" />}
                            text="Конструктор"
                            active={true}
                        />
                        <NavItem
                            icon={<ListIcon type="secondary" />}
                            text="Лента заказов"
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
                        />
                    </div>
                </nav>
            </div>
        </header>
    );
};

const NavItem = ({ icon, text, active = false }) => {
    return (
        <div className={`${styles.navItem} pl-5 pr-5 pb-4 pt-4`}>
            {icon}
            <span className={`text text_type_main-default ml-2 ${active ? '' : 'text_color_inactive'}`}>
        {text}
      </span>
        </div>
    );
};

export default AppHeader;