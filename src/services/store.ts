import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredients/slice';
import constructorReducer from './constructor/slice';
import ingredientDetailsReducer from './ingredient-details/slice';
import orderReducer from './order/slice';
import authReducer from './auth/slice';
import ordersReducer from './websocket/slice';
import { socketMiddleware } from './websocket/middleware';
import { logger } from 'redux-logger';

export const store = configureStore({
	reducer: {
		ingredients: ingredientsReducer,
		burgerConstructor: constructorReducer,
		ingredientDetails: ingredientDetailsReducer,
		order: orderReducer,
		auth: authReducer,
		orders: ordersReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(socketMiddleware())
			.concat(logger),
	devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;