<script lang="ts">
	import type { Content, ContentType } from '$lib/api/contents';
	import { isDate } from '$lib/utils';
	import clsx from 'clsx';
	import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-svelte';

	export let excludedColumns: string[] = ['id'];
	export let contentType: ContentType | undefined;
	export let contents: Content[];
	export let order = { column: 'createdAt', direction: 'desc' };
	export let containerClass = '';

	const setOrder = (column: string) => {
		if (order.column === column) {
			order.direction = order.direction === 'asc' ? 'desc' : 'asc';
		} else {
			order.column = column;
			order.direction = 'asc';
		}
	};

	let contentColumns: string[] = [];
	$: contentColumns = Object.keys(contentType?.schema || {})
		.filter((column) => !excludedColumns.includes(column))
		.concat('createdAt', 'updatedAt');
</script>

<div class={clsx('relative w-full overflow-x-auto', containerClass)}>
	<table class="w-full text-left">
		<thead class="text-lg uppercase border-b">
			<tr>
				{#each contentColumns as column}
					<th scope="col">
						<div class="flex px-4 lg:px-6 py-3 items-center gap-1">
							{contentType?.schema[column]?.name || column}
							{#if !['reference-to-many', 'reference-to-one'].includes(contentType?.schema[column]?.type || '')}
								<button
									class="p-0.5 rounded-btn hover:bg-base-200 active:bg-base-200 w-6 h-6"
									on:click={() => setOrder(column)}
								>
									{#if order.column === column}
										{#if order.direction === 'asc'}
											<ChevronUp class="w-full h-full" />
										{:else}
											<ChevronDown class="w-full h-full" />
										{/if}
									{:else}
										<ChevronsUpDown class="w-full h-full" />
									{/if}
								</button>
							{/if}
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each contents as content, index (content.id)}
				<tr class="text-sm sm:text-base hover:bg-base-200">
					{#each contentColumns as column}
						{#if contentType?.schema[column]?.type === 'reference-to-many'}
							<td class="px-4 py-2 lg:px-6 lg:py-4">{`${content[column].length} ${column}`}</td>
						{:else if contentType?.schema[column]?.type === 'reference-to-one'}
							<td
								class="px-4 py-2 lg:px-6 lg:py-4 text-ellipsis whitespace-nowrap max-w-[8rem] overflow-hidden"
								>{content[column].id}
							</td>
						{:else if isDate(content[column])}
							<td class="px-4 py-2 lg:px-6 lg:py-4">
								{content[column].toLocaleDateString()}
							</td>
						{:else}
							<td
								class="whitespace-nowrap px-4 py-2 lg:px-6 lg:py-4 ext-ellipsis max-w-[12rem] overflow-hidden"
								>{content[column]}</td
							>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
