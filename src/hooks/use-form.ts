import React, { useState } from 'react';

export const useForm = <T extends Record<string, any>>(initialValues: T) => {
	const [values, setValues] = useState<T>(initialValues);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setValues((prev) => ({ ...prev, [name]: value }));
	};

	return { values, handleChange, setValues };
};