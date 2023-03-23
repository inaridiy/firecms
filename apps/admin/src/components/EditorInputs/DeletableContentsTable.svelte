<script lang="ts">
	import type { Content, ContentType } from '$lib/api/contents';
	import { isDate } from '$lib/utils';
	import { X } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let excludedColumns = ['id'];
	export let contentType: ContentType | undefined;
	export let contents: Content[];
	export let tableClass = '';

	const handleDelete = (content: Content) => {
		dispatch('delete', content);
	};

	$: contentColumns = Object.keys(contentType?.schema || {}).filter(
		(column) => !excludedColumns.includes(column)
	);
</script>

<table class={tableClass}>
	<thead>
		<tr>
			<th />
			{#each contentColumns as column}
				<th scope="col">
					<div class="flex px-4 lg:px-6 items-center gap-1">
						{contentType?.schema[column]?.name || column}
					</div>
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each contents as content}
			<tr>
				<td class="px-4 flex items-center">
					<button
						class="text-error p-2 rounded-btn hover:bg-base-200"
						on:click={() => handleDelete(content)}
					>
						<X class="w-6 h-6" />
					</button>
				</td>
				{#each contentColumns as column}
					{#if contentType?.schema[column]?.type === 'reference-to-many'}
						<td class="px-4 lg:px-6">{`${content[column].length} ${column}`}</td>
					{:else if contentType?.schema[column]?.type === 'reference-to-one'}
						<td class="px-4 lg:px-6 text-ellipsis whitespace-nowrap max-w-[8rem] overflow-hidden"
							>{content[column]?.id}
						</td>
					{:else if isDate(content[column])}
						<td class="px-4 lg:px-6">
							{content[column].toLocaleDateString()}
						</td>
					{:else}
						<td class="whitespace-nowrap px-4 lg:px-6 ext-ellipsis max-w-[12rem] overflow-hidden"
							>{content[column]}
						</td>
					{/if}
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
