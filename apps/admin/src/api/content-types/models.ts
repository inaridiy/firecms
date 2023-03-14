export interface ContentTypesRes {
	id: string;
	name?: string;
	table_name: string;
	schema: string;
	created_at: string;
	updated_at: string;
}

export type ContentFieldTypes =
	| 'string'
	| 'int'
	| 'float'
	| 'boolean'
	| 'date'
	| 'markdown'
	| 'json'
	| 'reference-to-one'
	| 'reference-to-many';

export type ContentSchema = {
	[key: string]: {
		name?: string;
		type: ContentFieldTypes;
		referenceTo?: string;
		sqlType: 'text' | 'integer' | 'real';
		required?: boolean;
		unique?: boolean;
	};
};

export interface ContentType {
	id: string;
	name?: string;
	tableName: string;
	schema: ContentSchema;
	createdAt: Date;
	updatedAt: Date;
}
