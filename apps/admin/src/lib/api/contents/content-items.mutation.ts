import { client } from '$lib/axios';
import type { Content } from './models';

export const createContentItem = async (tableName: string, content: Content) => {
	const { data } = await client.post<Content>(`/contents/${tableName}`, content);
	console.log(data);
	return data;
};
