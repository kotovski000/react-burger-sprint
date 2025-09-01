import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredients/slice';
import constructorReducer from './constructor/slice';
import ingredientDetailsReducer from './ingredient-details/slice';
import orderReducer from './order/slice';
import authReducer from './auth/slice';
import ordersReducer from './websocket/slice';
import { socketMiddleware } from './websocket/middleware';
import {
	wsConnectionStart,
	wsConnectionSuccess,
	wsConnectionError,
	wsConnectionClosed,
	wsGetMessage
} from './websocket/slice';

const wsActions = {
	wsConnectionStart,
	wsConnectionSuccess,
	wsConnectionError,
	wsConnectionClosed,
	wsGetMessage
};

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
			.concat(socketMiddleware(wsActions)),
	devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;