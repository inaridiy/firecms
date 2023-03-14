<script lang="ts">
	import { page } from '$app/stores';
	import { createQuery, type CreateQueryResult } from '@tanstack/svelte-query';
	import type { ContentType } from 'src/api/content-types/models';
	import { fetchContentType } from '../../../../api/content-types';
	import Header from '../../../../components/Layout/Header.svelte';

	let contentTypeQuery: CreateQueryResult<ContentType | undefined>;
	$: contentTypeQuery = createQuery({
		queryKey: ['content-type', $page.params.contentType],
		queryFn: () => fetchContentType($page.params.contentType)
	});
</script>

<Header title={$contentTypeQuery.data?.name || 'Unknown'} loading={$contentTypeQuery.isLoading} />
