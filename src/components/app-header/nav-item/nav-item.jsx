import { NavLink } from 'react-router-dom';
import styles from './nav-item.module.css';
import { NavItemType } from '../../../utils/types';

const NavItem = ({ icon, text, to, exact = false }) => {
    return (
        <NavLink
            exact={exact}
            to={to}
            className={`${styles.navItem} pl-5 pr-5 pb-4 pt-4`}
            activeClassName={styles.active}
        >
            {icon}
            <span className={`text text_type_main-default ml-2`}>
        {text}
      </span>
        </NavLink>
    );
};

NavItem.propTypes = NavItemType;

export default NavItem;