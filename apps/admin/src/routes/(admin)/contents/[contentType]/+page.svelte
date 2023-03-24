<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fetchContentItems, fetchContentType, type Content } from '$lib/api/contents';
	import { createQuery } from '@tanstack/svelte-query';
	import { Loader2Icon, Plus, Search } from 'lucide-svelte';
	import { ContentsTableSkelton, ContentsTableView } from '../../../../components/Contents';
	import { TextInput } from '../../../../components/EditorInputs';
	import { Button } from '../../../../components/Elements';
	import Header from '../../../../components/Layout/Header.svelte';

	let search = '';
	let order = { column: 'createdAt', direction: 'desc' };

	const handleClickContent = (e: CustomEvent<Content>) => {
		goto(`/contents/${$page.params.contentType}/${e.detail.id}`);
	};

	$: contentTypesQuery = createQuery({
		queryKey: ['content-type', $page.params.contentType],
		queryFn: () => fetchContentType($page.params.contentType)
	});

	let contentItems: Content[] = [];
	$: contentItemsQuery = createQuery({
		queryKey: ['content-items', $page.params.contentType, { q: search, orders: [order] }],
		queryFn: () => fetchContentItems($page.params.contentType, { q: search, orders: [order] }),
		onSuccess: (data) => (contentItems = data), //黒魔術
		keepPreviousData: true // Not working
	});
	$: contentItems = $contentTypesQuery.isLoading ? [] : $contentItemsQuery.data || contentItems; // 黒魔術
</script>

<Header title={$contentTypesQuery.data?.name || 'Unknown'} loading={$contentTypesQuery.isLoading} />
<div class="p-4 flex gap-4 justify-between items-center">
	<div class="flex items-center gap-4">
		<TextInput containerClass="max-w-sm" bind:value={search}>
			<Search slot="left" />
		</TextInput>
		{#if $contentItemsQuery.isLoading}
			<Loader2Icon class="w-8 h-8 animate-spin hidden sm:block" />
		{/if}
	</div>
	<Button href={`/contents/${$page.params.contentType}/create`}>
		<Plus slot="left" />
		Add
	</Button>
</div>

<div class="px-4">
	{#if !contentItems || $contentTypesQuery.isLoading}
		<ContentsTableSkelton />
	{:else if $contentItemsQuery.isError}
		<div class="p-4">Error: {$contentItemsQuery.error}</div>
	{:else}
		<ContentsTableView
			bind:order
			contentType={$contentTypesQuery.data}
			contents={contentItems}
			on:select={handleClickContent}
		/>
	{/if}
</div>
