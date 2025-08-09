import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredients/slice';
import constructorReducer from './constructor/slice';
import ingredientDetailsReducer from './ingredient-details/slice';
import orderReducer from './order/slice';
import authReducer from './auth/slice';
import { logger } from 'redux-logger';

export const store = configureStore({
	reducer: {
		ingredients: ingredientsReducer,
		burgerConstructor: constructorReducer,
		ingredientDetails: ingredientDetailsReducer,
		order: orderReducer,
		auth: authReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
	devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;