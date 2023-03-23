<script lang="ts">
	import { fetchContentType, type Content } from '$lib/api/contents';
	import { createQuery } from '@tanstack/svelte-query';
	import { Loader2 } from 'lucide-svelte';
	import ContentsSelectModal from '../Contents/ContentsSelectModal.svelte';
	import Button from '../Elements/Button.svelte';
	import DeletableContentsTable from './DeletableContentsTable.svelte';

	export let referenceTo: string | undefined = undefined;
	export let contents: Content[] = [];

	let open = false;

	const handleSelectContent = (e: CustomEvent<Content>) => {
		open = false;
		contents = [...contents, e.detail].filter(
			(content, index, self) => index === self.findIndex((t) => t.id === content.id)
		);
	};

	$: referenceTypeQuery = createQuery({
		queryKey: ['content-type', referenceTo],
		queryFn: () => fetchContentType(referenceTo as string),
		enabled: Boolean(referenceTo)
	});
</script>

<ContentsSelectModal
	bind:open
	contentType={$referenceTypeQuery.data}
	on:select={handleSelectContent}
/>
{#if $referenceTypeQuery.isLoading}
	<Loader2 class="p-4 w-12 h-12 animate-spin" />
{:else if contents.length}
	<div class="w-full max-w-lg overflow-x-auto border-2 border-base-content rounded-box py-2">
		<DeletableContentsTable
			tableClass="w-full"
			contentType={$referenceTypeQuery.data}
			{contents}
			on:delete={(e) => (contents = contents.filter((content) => content.id !== e.detail.id))}
		/>
	</div>
{/if}
<Button color="outline" className="block max-w-sm mt-4" on:click={() => (open = true)}>
	Select
</Button>
