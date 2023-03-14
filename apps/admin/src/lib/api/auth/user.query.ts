import { client } from '$lib/axios';
import type { UserData } from '../../../auth/models';

export interface UserRes {
	id: string;
	name: string;
	email: string;
	created_at: string;
	updated_at: string;
}

export const fetchUser = async (id: string): Promise<UserData> => {
	const { data } = await client.get<UserRes>(`/users/${id}`);
	return {
		id: data.id,
		name: data.name,
		email: data.email,
		createdAt: new Date(data.created_at),
		updatedAt: new Date(data.updated_at)
	};
};
