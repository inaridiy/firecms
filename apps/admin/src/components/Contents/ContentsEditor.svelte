<script lang="ts">
	import type { ContentType } from '$lib/api/contents';
	import { NumInput, TextInput } from '../EditorInputs';
	import { Button } from '../Elements';
	import Modal from '../Elements/Modal.svelte';

	export let contentType: ContentType;

	let test = false;
</script>

<Modal bind:open={test} class="h-72" />

<div class="flex justify-between mt-12 items-center mx-auto max-w-screen-lg">
	<div class="text-xl font-bold">ContentID: Not Set</div>
	<Button on:click={() => (test = !test)}>Save</Button>
</div>

<form class="flex flex-col gap-4 p-2 mx-auto max-w-screen-lg">
	{#each Object.entries(contentType.schema) as [key, field]}
		<div>
			<label for={field.name || key} class="text-lg font-bold">{field.name || key}</label>
			{#if field.type === 'string'}
				<TextInput type="text" name={field.name || key} />
			{:else if field.type === 'int'}
				<NumInput name={field.name || key} />
			{:else}
				<p>Unknown field type: {field.type}</p>
			{/if}
		</div>
	{/each}
</form>
