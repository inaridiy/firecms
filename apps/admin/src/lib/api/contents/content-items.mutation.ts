import { client } from '$lib/axios';
import type { Content, SubmittedContent } from './models';

export const createContentItem = async (tableName: string, content: SubmittedContent) => {
	const { data } = await client.post<Content>(`/contents/${tableName}`, content);
	console.log(data);
	return data;
};
