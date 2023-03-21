<script lang="ts">
	import { page } from '$app/stores';
	import {
		fetchContentItems,
		fetchContentType,
		type Content,
		type ContentType
	} from '$lib/api/contents';
	import { createQuery, type CreateQueryResult } from '@tanstack/svelte-query';
	import { Plus, Search } from 'lucide-svelte';
	import { ContentsTableSkelton, ContentsTableView } from '../../../../components/Contents';
	import { TextInput } from '../../../../components/EditorInputs';
	import { Button } from '../../../../components/Elements';
	import Header from '../../../../components/Layout/Header.svelte';

	let search = '';
	let order = { column: 'createdAt', direction: 'desc' };

	let contentTypesQuery: CreateQueryResult<ContentType | undefined>;
	$: contentTypesQuery = createQuery({
		queryKey: ['content-type', $page.params.contentType],
		queryFn: () => fetchContentType($page.params.contentType)
	});

	let contentItemsQuery: CreateQueryResult<Content[]>;
	$: contentItemsQuery = createQuery({
		queryKey: ['content-items', $page.params.contentType, { search }],
		queryFn: () => fetchContentItems($page.params.contentType, { q: search, orders: [order] })
	});
</script>

<Header title={$contentTypesQuery.data?.name || 'Unknown'} loading={$contentTypesQuery.isLoading} />
<div class="p-4 flex gap-4 justify-between items-center">
	<TextInput containerClass="max-w-sm" bind:value={search}>
		<Search slot="left" />
	</TextInput>
	<Button href={`/contents/${$page.params.contentType}/create`}>
		<Plus slot="left" />
		Add
	</Button>
</div>

<div class="px-4">
	{#if !$contentItemsQuery.data || $contentTypesQuery.isLoading}
		<ContentsTableSkelton />
	{:else if $contentItemsQuery.isError}
		<div class="p-4">Error: {$contentItemsQuery.error}</div>
	{:else}
		<ContentsTableView
			bind:order
			contentType={$contentTypesQuery.data}
			contents={$contentItemsQuery.data}
		/>
	{/if}
</div>
