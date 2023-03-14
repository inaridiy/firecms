import type { ContentType, ContentTypesRes } from './models';

export const toContentType = (res: ContentTypesRes): ContentType => {
	return {
		id: res.id,
		name: res.name,
		tableName: res.table_name,
		schema: JSON.parse(res.schema),
		createdAt: new Date(res.created_at),
		updatedAt: new Date(res.updated_at)
	};
};
