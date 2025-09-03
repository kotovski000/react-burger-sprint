import { Navigate, useLocation } from 'react-router-dom';
import { ProtectedRouteProps } from '../../utils/types';
import {useAppSelector} from "../../hooks/redux";

export const ProtectedRouteElement = ({ element, onlyUnAuth = false, onlyFromForgot = false }: ProtectedRouteProps) => {
	const { user, isAuthChecked } = useAppSelector(state => state.auth);
	const location = useLocation();

	if (!isAuthChecked) {
		return null;
	}

	if (onlyUnAuth && user) {
		const from = location.state?.from || '/';
		return <Navigate to={from} replace />;
	}

	if (!onlyUnAuth && !user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (onlyFromForgot && !location.state?.fromForgotPassword) {
		return <Navigate to="/forgot-password" replace />;
	}

	return element;
};