import { client } from '$lib/axios';
import type { AuthData } from 'src/auth/models';

export interface LoginPostData {
	name?: string;
	email?: string;
	password: string;
}

export interface LoginMutationRes {
	token: string;
	id: string;
}

export const postLogin = async (data: LoginPostData): Promise<AuthData> => {
	const res = await client.post<LoginMutationRes>('/auth/login', data);
	const { token, id } = res.data;
	return { token, id };
};
