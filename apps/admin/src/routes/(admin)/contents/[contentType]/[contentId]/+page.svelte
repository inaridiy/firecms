<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fetchContentItem, fetchContentType } from '$lib/api/contents';
	import { createQuery } from '@tanstack/svelte-query';
	import type { AxiosError } from 'axios';
	import { ContentsEditor } from '../../../../../components/Contents';
	import Header from '../../../../../components/Layout/Header.svelte';

	$: contentTypesQuery = createQuery({
		queryKey: ['content-type', $page.params.contentType],
		queryFn: () => fetchContentType($page.params.contentType)
	});

	$: contentItemQuery = createQuery({
		queryKey: ['content-items', $page.params.contentType, $page.params.contentId],
		queryFn: () => fetchContentItem($page.params.contentType, $page.params.contentId),
		onError: (err: AxiosError) =>
			err.response?.status === 404 && goto(`/contents/${$page.params.contentType}/create`),
		enabled: $page.params.contentId !== 'create',
		retry: false
	});
</script>

<Header title={$contentTypesQuery.data?.name || 'Unknown'} loading={$contentTypesQuery.isLoading} />

<div class="px-4">
	{#if !$contentTypesQuery.data || $contentTypesQuery.isLoading}
		<div class="p-4">Loading...</div>
	{:else if $contentTypesQuery.isError}
		<div class="p-4">Error: {$contentTypesQuery.error}</div>
	{:else}
		<ContentsEditor contentType={$contentTypesQuery.data} defaultContent={$contentItemQuery.data} />
	{/if}
</div>
