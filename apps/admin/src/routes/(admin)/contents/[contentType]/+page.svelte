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
	import ContentsTableView from '../../../../components/Contents/ContentsTableView.svelte';
	import Button from '../../../../components/Elements/Button.svelte';
	import TextInput from '../../../../components/Elements/TextInput.svelte';
	import Header from '../../../../components/Layout/Header.svelte';

	let search = '';

	let contentTypesQuery: CreateQueryResult<ContentType | undefined>;
	$: contentTypesQuery = createQuery({
		queryKey: ['content-type', $page.params.contentType],
		queryFn: () => fetchContentType($page.params.contentType)
	});

	let contentItemsQuery: CreateQueryResult<Content[]>;
	$: contentItemsQuery = createQuery({
		queryKey: ['content-items', $page.params.contentType, { search }],
		queryFn: () => fetchContentItems($page.params.contentType, { q: search })
	});
</script>

<Header title={$contentTypesQuery.data?.name || 'Unknown'} loading={$contentTypesQuery.isLoading} />
<div class="p-4 flex gap-4 justify-between">
	<TextInput containerClass="max-w-sm" bind:value={search}>
		<Search slot="left" />
	</TextInput>
	<Button>
		<Plus slot="left" />
		Add
	</Button>
</div>
{#if !$contentItemsQuery.data || $contentTypesQuery.isLoading}
	<div class="p-4">Loading...</div>
{:else if $contentItemsQuery.isError}
	<div class="p-4">Error: {$contentItemsQuery.error}</div>
{:else}
	<ContentsTableView contentType={$contentTypesQuery.data} contents={$contentItemsQuery.data} />
{/if}
