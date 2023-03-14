export const isEmail = (email: string) => {
	return /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email);
};

export const isValidPassword = (password: string) => {
	return password.length >= 8;
};
