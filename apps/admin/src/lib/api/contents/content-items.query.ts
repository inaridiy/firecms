import { client } from '$lib/axios';
import { toContent, toQueryColumn } from './content-items.mapper';
import type { Content, ContentRes } from './models';

export interface QueryContentOptions {
	ids?: string[];
	q?: string;
	orders?: {
		column: string;
		direction: string;
	}[];
}

export const fetchContentItems = async (
	tableName: string,
	opt: QueryContentOptions = {}
): Promise<Content[]> => {
	const queryParams = opt && {
		ids: opt.ids?.join(','),
		q: opt.q,
		orders: opt.orders?.map((o) => `${toQueryColumn(o.column)}:${o.direction}`).join(',')
	};
	const { data } = await client.get<ContentRes[]>(`/contents/${tableName}`, {
		params: queryParams
	});
	const mapped = data.map((res) => toContent(res));
	return mapped;
};

export const fetchContentItem = async (
	tableName: string,
	id: string
): Promise<Content | undefined> => {
	const { data } = await client.get<ContentRes | undefined>(`/contents/${tableName}/${id}`);
	return data && toContent(data);
};
