<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		createContentItem,
		fetchContentItem,
		fetchContentType,
		type Content,
		type SubmittedContent
	} from '$lib/api/contents';
	import { createQuery, type CreateQueryResult } from '@tanstack/svelte-query';
	import type { AxiosError } from 'axios';
	import { ContentsEditor } from '../../../../../components/Contents';
	import Header from '../../../../../components/Layout/Header.svelte';

	let status = 'none';

	const handleSubmit = async (e: CustomEvent<SubmittedContent>) => {
		status = 'loading';
		await createContentItem($page.params.contentType, e.detail);
		status = 'success';
		goto(`/contents/${$page.params.contentType}`);
	};

	$: contentTypesQuery = createQuery({
		queryKey: ['content-type', $page.params.contentType],
		queryFn: () => fetchContentType($page.params.contentType)
	});

	let contentItemQuery: CreateQueryResult<Content | undefined>;
	$: contentItemQuery = createQuery({
		queryKey: ['content-items', $page.params.contentType, $page.params.contentId],
		queryFn: () =>
			$contentItemQuery?.data || fetchContentItem($page.params.contentType, $page.params.contentId),
		onError: (err: AxiosError) =>
			err.response?.status === 404 && goto(`/contents/${$page.params.contentType}/create`),
		enabled: $page.params.contentId !== 'create',
		retry: false
	});
</script>

<Header
	href={`/contents/${$page.params.contentType}`}
	title={$contentTypesQuery.data?.name || 'Unknown'}
	loading={$contentTypesQuery.isLoading}
/>

<div class="px-4">
	{#if !$contentTypesQuery.data || $contentTypesQuery.isLoading}
		<div class="p-4">Loading...</div>
	{:else if $contentTypesQuery.isError}
		<div class="p-4">Error: {$contentTypesQuery.error}</div>
	{:else}
		<ContentsEditor
			{status}
			contentType={$contentTypesQuery.data}
			defaultContent={$contentItemQuery.data}
			on:submit={handleSubmit}
		/>
	{/if}
</div>
