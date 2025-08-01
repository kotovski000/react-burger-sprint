import PropTypes from 'prop-types';

// export const IngredientType = PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//     type: PropTypes.oneOf(['bun', 'sauce', 'main']).isRequired,
//     price: PropTypes.number.isRequired,
//     image: PropTypes.string.isRequired,
//     image_mobile: PropTypes.string,
//     image_large: PropTypes.string,
//     calories: PropTypes.number,
//     proteins: PropTypes.number,
//     fat: PropTypes.number,
//     carbohydrates: PropTypes.number,
//     count: PropTypes.number
// });
//
// export const IngredientsArrayType = PropTypes.arrayOf(IngredientType).isRequired;

export const NavItemType = {
    icon: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired,
    // to: PropTypes.string.isRequired,
    // exact: PropTypes.bool,
    isActive: PropTypes.bool

};

// export const IngredientDetailsType = PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//     image_large: PropTypes.string.isRequired,
//     calories: PropTypes.number.isRequired,
//     proteins: PropTypes.number.isRequired,
//     fat: PropTypes.number.isRequired,
//     carbohydrates: PropTypes.number.isRequired,
// });
//
// export const OrderDetailsType = {
//     number: PropTypes.number.isRequired
// };

export const ModalOverlayType = {
    onClose: PropTypes.func.isRequired,
};

export const ModalType = {
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};