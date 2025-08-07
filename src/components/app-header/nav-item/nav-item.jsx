import { NavLink } from 'react-router-dom';
import styles from './nav-item.module.css';
import {NavItemType} from "../../../utils/types";
import React from "react";

const NavItem = ({ icon, text, to, exact = false, isActive = false }) => {
    return (
        <NavLink
            exact={exact}
            to={to}
            className={`${styles.navItem} pl-5 pr-5 pb-4 pt-4 ${isActive ? styles.active : ''}`}
            activeClassName={styles.active}
        >
            {React.cloneElement(icon, { type: isActive ? 'primary' : 'secondary' })}
            <span className={`text text_type_main-default ml-2 ${isActive ? styles.activeText : ''}`}>
                {text}
            </span>
        </NavLink>
    );
};

NavItem.propTypes = NavItemType;

export default NavItem;