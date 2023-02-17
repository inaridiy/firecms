import { postLogin, fetchUser } from '../api/auth';
import { authStore, userStore } from './stores';

export interface LoginData {
	nameOrEmail: string;
	password: string;
}

export const login = async (data: LoginData) => {
	const { nameOrEmail, password } = data;
	const isEmail = nameOrEmail.includes('@'); // TODO: better email validation
	const { id, token } = await postLogin({
		[isEmail ? 'email' : 'user_id']: nameOrEmail,
		password
	});
	authStore.set({ id, token });

	const userData = await fetchUser(id);
	userStore.set(userData);
};
