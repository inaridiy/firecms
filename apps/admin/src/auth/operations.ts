import { isEmail } from '$lib/utils';
import { fetchUser, postLogin } from '../api/auth';
import { authStore, userStore } from './stores';

export interface LoginData {
	nameOrEmail: string;
	password: string;
}

export const login = async (data: LoginData) => {
	const { nameOrEmail, password } = data;
	console.log('login', data);
	const { id, token } = await postLogin({
		[isEmail(nameOrEmail) ? 'email' : 'user_id']: nameOrEmail,
		password
	});
	authStore.set({ id, token });
	const userData = await fetchUser(id);
	userStore.set(userData);
};

export const logout = () => {
	authStore.set(undefined);
	userStore.set(undefined);
};
