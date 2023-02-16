import { client } from '$lib/axios';
import type { ContentType } from '../models';

export interface ContentTypesRes {
	id: string;
	name?: string;
	table_name: string;
	schema: string;
	created_at: string;
	updated_at: string;
}

export const fetchContentTypes = async (): Promise<ContentType[]> => {
	const { data } = await client.get<ContentTypesRes[]>('/content-types');
	console.log(data);
	return data.map((contentType) => ({
		id: contentType.id,
		name: contentType.name,
		tableName: contentType.table_name,
		schema: JSON.parse(contentType.schema),
		createdAt: new Date(contentType.created_at),
		updatedAt: new Date(contentType.updated_at)
	}));
};
