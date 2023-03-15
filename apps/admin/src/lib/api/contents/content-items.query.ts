import { client } from '$lib/axios';
import { toContent } from './content-items.mapper';
import type { Content, ContentRes } from './models';

export interface QueryContentOptions {
	ids?: string;
	q?: string;
	filters?: string;
	orders?: string;
	limit?: number;
	offset?: number;
}

export const fetchContentItems = async (
	tableName: string,
	q: QueryContentOptions = {}
): Promise<Content[]> => {
	const { data } = await client.get<ContentRes[]>(`/contents/${tableName}`, { params: q });
	const mapped = data.map((res) => toContent(res));
	return mapped;
};
