import { client } from '$lib/axios';
import { toContentType } from './content-types.mappr';
import type { ContentType, ContentTypesRes } from './models';

export const fetchContentTypes = async (): Promise<ContentType[]> => {
	const { data } = await client.get<ContentTypesRes[]>('/content-types');
	return data.map(toContentType);
};

export const fetchContentType = async (
	contentTypeName: string
): Promise<ContentType | undefined> => {
	const { data } = await client.get<ContentTypesRes | undefined>(
		`/content-types/${contentTypeName}`
	);

	return data && toContentType(data);
};
