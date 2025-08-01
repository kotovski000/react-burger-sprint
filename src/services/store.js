import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredients/slice';
import constructorReducer from './constructor/slice';
import ingredientDetailsReducer from './ingredient-details/slice';
import orderReducer from './order/slice';
import {logger} from "redux-logger/src";

export const store = configureStore({
    reducer: {
        ingredients: ingredientsReducer,
        burgerConstructor: constructorReducer,
        ingredientDetails: ingredientDetailsReducer,
        order: orderReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV !== 'production'
});

export default store;