<script lang="ts">
	import type { Content, ContentType } from '$lib/api/contents';
	import { isDate } from '$lib/utils';

	export let excludedColumns: string[] = ['id'];
	export let contentType: ContentType | undefined;
	export let contents: Content[];

	let contentColumns: string[] = [];
	$: contentColumns = Object.keys(contentType?.schema || {})
		.filter((column) => !excludedColumns.includes(column))
		.concat('createdAt', 'updatedAt');

	$: console.log(contents);
</script>

<div class="relative overflow-x-auto w-full px-4">
	<table class="w-full text-left">
		<thead class="text-lg uppercase border-b">
			<tr>
				{#each contentColumns as column}
					<th scope="col" class="px-4 sm:px-6 py-3">
						{contentType?.schema[column]?.name || column}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each contents as content, index (content.id)}
				<tr class="text-sm sm:text-base">
					{#each contentColumns as column}
						{#if contentType?.schema[column]?.type === 'reference-to-many'}
							<td class="px-4 py-2 lg:px-6 lg:py-4">{`${content[column].length} ${column}`}</td>
						{:else if contentType?.schema[column]?.type === 'reference-to-one'}
							<td class="px-4 py-2 lg:px-6 lg:py-4">{content[column].id} </td>
						{:else if isDate(content[column])}
							<td class="px-4 py-2 lg:px-6 lg:py-4">
								{content[column].toLocaleDateString()}
							</td>
						{:else}
							<td class="whitespace-nowrap px-4 py-2 lg:px-6 lg:py-4">{content[column]}</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
