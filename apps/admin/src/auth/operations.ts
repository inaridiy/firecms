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
	console.log('id, token', id, token);
	authStore.set({ id, token });

	const userData = await fetchUser(id);
	console.log('userData', userData);
	userStore.set(userData);
};
