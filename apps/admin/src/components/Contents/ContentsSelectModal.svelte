<script lang="ts">
	import { fetchContentItems, type Content, type ContentType } from '$lib/api/contents';
	import { createQuery, type CreateQueryResult } from '@tanstack/svelte-query';
	import { Loader2, SearchIcon } from 'lucide-svelte';
	import { TextInput } from '../EditorInputs';
	import { Modal } from '../Elements';
	import ContentsTableView from './ContentsTableView.svelte';

	export let open: boolean;
	export let contentType: ContentType | undefined;

	let search = '';
	let order = { column: 'createdAt', direction: 'desc' };

	let contentItems: Content[] = [];
	let contentItemsQuery: CreateQueryResult<Content[]>;
	$: contentItemsQuery = createQuery({
		queryKey: ['content-items', contentType?.tableName, { q: search, orders: [order] }],
		queryFn: () =>
			fetchContentItems(contentType?.tableName as string, { q: search, orders: [order] }),
		onSuccess: (data) => (contentItems = data || []), //黒魔術
		keepPreviousData: true, // Not working
		enabled: Boolean(contentType)
	});
	$: contentItems = $contentItemsQuery.data || contentItems; // 黒魔術
</script>

<Modal bind:open class="">
	<div class="px-4 pt-4 flex items-center gap-4">
		<TextInput bind:value={search} containerClass="flex-1">
			<SearchIcon slot="left" />
		</TextInput>
		<div class="pr-4 w-12">
			{#if $contentItemsQuery.isLoading}
				<Loader2 class="w-8 h-8 animate-spin" />
			{/if}
		</div>
	</div>
	<ContentsTableView bind:order {contentType} contents={contentItems} on:select />
</Modal>
