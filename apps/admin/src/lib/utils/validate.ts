export const isEmail = (email: string) => {
	return /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email);
};

export const isValidPassword = (password: string) => {
	return password.length >= 8;
};

export const isDate = (date: Date) => {
	return date instanceof Date && !isNaN(date.getTime());
};
