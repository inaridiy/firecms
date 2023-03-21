<script lang="ts">
	import { page } from '$app/stores';
	import { fetchContentType, type ContentType } from '$lib/api/contents';
	import { createQuery, type CreateQueryResult } from '@tanstack/svelte-query';
	import { ContentsEditor } from '../../../../../components/Contents';
	import Header from '../../../../../components/Layout/Header.svelte';

	let contentTypesQuery: CreateQueryResult<ContentType | undefined>;
	$: contentTypesQuery = createQuery({
		queryKey: ['content-type', $page.params.contentType],
		queryFn: () => fetchContentType($page.params.contentType)
	});
</script>

<Header title={$contentTypesQuery.data?.name || 'Unknown'} loading={$contentTypesQuery.isLoading} />

<div class="px-4">
	{#if !$contentTypesQuery.data || $contentTypesQuery.isLoading}
		<div class="p-4">Loading...</div>
	{:else if $contentTypesQuery.isError}
		<div class="p-4">Error: {$contentTypesQuery.error}</div>
	{:else}
		<ContentsEditor contentType={$contentTypesQuery.data} />
	{/if}
</div>
