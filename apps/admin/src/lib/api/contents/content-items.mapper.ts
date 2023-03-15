import type { Content, ContentRes } from './models';

export const toContent = (res: ContentRes): Content => {
	const { id, created_at, updated_at, ...body } = res;
	const mappedBody = Object.fromEntries(
		Object.entries(body).map(([key, value]) => {
			if (typeof value === 'object' && value.id) {
				return [key, toContent(value)];
			} else if (typeof value === 'object' && Array.isArray(value)) {
				return [key, value.map((item) => toContent(item))];
			} else {
				return [key, value];
			}
		})
	);
	return {
		id,
		...mappedBody,
		createdAt: new Date(created_at),
		updatedAt: new Date(updated_at)
	};
};
