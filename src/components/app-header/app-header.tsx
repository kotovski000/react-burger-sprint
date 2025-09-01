import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { NavLink, useLocation, useMatch, useNavigate } from 'react-router-dom';
import styles from './app-header.module.css';
import NavItem from './nav-item/nav-item';

const AppHeader = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const isIngredientPage = useMatch('/ingredients/:id');

	const getBasePath = (): string => {
		if (isIngredientPage) return '/';
		return location.state?.background?.pathname || location.pathname;
	};

	const basePath = getBasePath();

	const isConstructorActive = basePath === '/';
	const isFeedActive = basePath === '/feed';
	const isProfileActive = basePath.startsWith('/profile');

	const handleLogoClick = () => {
		navigate('/');
	};

	return (
		<header className={`${styles.header} pt-4 pb-4`}>
			<div className={styles.container}>
				<nav className={styles.nav}>
					<div className={`${styles.navBlock} ${styles.left}`}>
						<NavLink to="/" className={styles.link}>
							<NavItem
								icon={<BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />}
								text="Конструктор"
								isActive={isConstructorActive}
							/>
						</NavLink>
						<NavLink to="/feed" className={styles.link}>
							<NavItem
								icon={<ListIcon type={isFeedActive ? 'primary' : 'secondary'} />}
								text="Лента заказов"
								isActive={isFeedActive}
							/>
						</NavLink>
					</div>

					<div className={styles.logo} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
						<Logo />
					</div>

					<div className={`${styles.navBlock} ${styles.right}`}>
						<NavLink to="/profile" className={styles.link}>
							<NavItem
								icon={<ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />}
								text="Личный кабинет"
								isActive={isProfileActive}
							/>
						</NavLink>
					</div>
				</nav>
			</div>
		</header>
	);
};

export default AppHeader;