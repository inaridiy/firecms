<script lang="ts">
	import type { Content, ContentType } from '$lib/api/contents';

	export let excludedColumns: string[] = ['id', 'createdAt', 'updatedAt'];
	export let contentType: ContentType | undefined;
	export let contents: Content[];

	let contentColumns: string[] = [];
	$: contentColumns = Object.keys(contentType?.schema || {}).filter(
		(column) => !excludedColumns.includes(column)
	);
</script>

<div class="relative overflow-x-auto px-4">
	<table class="w-full text-sm text-left">
		<thead class="text-lg uppercase bg-gray-5 border-b">
			<tr>
				{#each contentColumns as column}
					<th scope="col" class="px-6 py-3">{contentType?.schema[column].name || column}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each contents as content, index (content.id)}
				<tr class="">
					{#each contentColumns as column}
						{#if contentType?.schema[column].type === 'reference-to-many'}
							<td class="px-6 py-4">{`${content[column].length} ${column}`}</td>
						{:else if contentType?.schema[column].type === 'reference-to-one'}
							<td class="px-6 py-4">{content[column].id} </td>
						{:else}
							<td class="whitespace-nowrap px-6 py-4">{content[column]}</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
