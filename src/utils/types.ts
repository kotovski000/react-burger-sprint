import React from "react";

export interface Ingredient {
	_id: string;
	name: string;
	type: 'bun' | 'sauce' | 'main';
	proteins: number;
	fat: number;
	carbohydrates: number;
	calories: number;
	price: number;
	image: string;
	image_large: string;
}

export interface User {
	name: string;
	email: string;
}

export interface Order {
	number: number;
}

export interface ModalProps {
	title: string;
	onClose: () => void;
	children: React.ReactNode;
}

export interface ModalOverlayProps {
	onClose: () => void;
}

export interface NavItemProps {
	icon: React.ReactNode;
	text: string;
	isActive: boolean;
}

export interface IngredientCardProps {
	item: Ingredient;
	count: number;
	onClick: (ingredient: Ingredient) => void;
}


export interface ProtectedRouteProps {
	element: React.ReactElement;
	onlyUnAuth?: boolean;
	onlyFromForgot?: boolean;
}


export interface AuthResponse {
	success: boolean;
	user: User;
	accessToken: string;
	refreshToken: string;
}

export interface IngredientsResponse {
	success: boolean;
	data: Ingredient[];
}

export interface OrderResponse {
	success: boolean;
	name: string;
	order: {
		number: number;
	};
}

export interface PasswordResetResponse {
	success: boolean;
	message: string;
}

export interface ConstructorIngredient extends Ingredient {
	id: string;
}