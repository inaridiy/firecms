<script lang="ts">
	import { fetchContentType, type Content } from '$lib/api/contents';
	import { createQuery } from '@tanstack/svelte-query';
	import { Loader2 } from 'lucide-svelte';
	import ContentsSelectModal from '../Contents/ContentsSelectModal.svelte';
	import Button from '../Elements/Button.svelte';
	import DeletableContentsTable from './DeletableContentsTable.svelte';

	export let referenceTo: string | undefined = undefined;
	export let content: Content | undefined = undefined;

	let open = false;

	const handleSelectContent = (e: CustomEvent<Content>) => {
		open = false;
		content = e.detail;
	};

	$: referenceTypeQuery = createQuery({
		queryKey: ['content-type', referenceTo],
		queryFn: () => fetchContentType(referenceTo as string),
		enabled: Boolean(referenceTo)
	});
	$: console.log(content, $referenceTypeQuery.data);
</script>

<ContentsSelectModal
	bind:open
	contentType={$referenceTypeQuery.data}
	on:select={handleSelectContent}
/>
{#if $referenceTypeQuery.isLoading}
	<Loader2 class="p-4 w-12 h-12 animate-spin" />
{:else if content}
	<div class="w-full max-w-lg overflow-x-auto border-2 border-base-content rounded-box py-2">
		<DeletableContentsTable
			tableClass="w-full"
			contentType={$referenceTypeQuery.data}
			contents={[content]}
			on:delete={() => (content = undefined)}
		/>
	</div>
{:else}
	<Button color="outline" className="block max-w-sm" on:click={() => (open = true)}>Select</Button>
{/if}
