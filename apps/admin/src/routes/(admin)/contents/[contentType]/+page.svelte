<script lang="ts">
	import { page } from '$app/stores';
	import { fetchContentType, type ContentType } from '$lib/api/content-types';
	import { createQuery, type CreateQueryResult } from '@tanstack/svelte-query';
	import { Plus, Search } from 'lucide-svelte';
	import Button from '../../../../components/Elements/Button.svelte';
	import TextInput from '../../../../components/Elements/TextInput.svelte';
	import Header from '../../../../components/Layout/Header.svelte';

	let contentTypeQuery: CreateQueryResult<ContentType | undefined>;
	$: contentTypeQuery = createQuery({
		queryKey: ['content-type', $page.params.contentType],
		queryFn: () => fetchContentType($page.params.contentType)
	});
</script>

<Header title={$contentTypeQuery.data?.name || 'Unknown'} loading={$contentTypeQuery.isLoading} />
<div class="p-4 flex gap-4 justify-between">
	<TextInput containerClass="max-w-sm">
		<Search slot="left" />
	</TextInput>
	<Button>
		<Plus slot="left" />
		Add
	</Button>
</div>
