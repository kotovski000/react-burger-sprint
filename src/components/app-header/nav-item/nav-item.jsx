import styles from './nav-item.module.css';
import React from 'react';
import { NavItemType } from "../../../utils/types";

const NavItem = ({ icon, text, isActive }) => {
    return (
        <div className={`${styles.navItem} pl-5 pr-5 pb-4 pt-4 ${isActive ? styles.active : ''}`}>
            {icon}
            <span className={`text text_type_main-default ml-2 ${isActive ? styles.activeText : ''}`}>
        {text}
      </span>
        </div>
    );
};

NavItem.propTypes = NavItemType;

export default NavItem;