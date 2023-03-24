<script lang="ts">
	import type { Content, ContentType } from '$lib/api/contents';
	import { createForm } from 'felte';
	import { NumInput, TextInput } from '../EditorInputs';
	import MarkdownInput from '../EditorInputs/MarkdownInput.svelte';
	import RefToManyInput from '../EditorInputs/RefToManyInput.svelte';
	import RefToOneInput from '../EditorInputs/RefToOneInput.svelte';
	import { Button } from '../Elements';

	export let contentType: ContentType;
	export let defaultContent: Content | undefined = undefined;

	const { data, createSubmitHandler } = createForm({
		onSubmit: (values) => {
			console.log(values);
		}
	});

	$: if (defaultContent) $data = defaultContent;
</script>

<div class="flex justify-between mt-12 items-center mx-auto max-w-screen-lg">
	<div class="text-xl font-bold">ContentID: Not Set</div>
	<Button on:click={createSubmitHandler()}>Save</Button>
</div>

<form class="flex flex-col gap-4 p-2 mx-auto max-w-screen-lg">
	{#each Object.entries(contentType.schema) as [key, field]}
		<div class="flex flex-col">
			<label for={field.name || key} class="text-lg font-bold">{field.name || key}</label>
			{#if field.type === 'string'}
				<TextInput type="text" name={field.name || key} bind:value={$data[key]} />
			{:else if field.type === 'int'}
				<NumInput name={field.name || key} bind:value={$data[key]} />
			{:else if field.type === 'reference-to-one'}
				<RefToOneInput referenceTo={field.referenceTo} bind:content={$data[key]} />
			{:else if field.type === 'reference-to-many'}
				<RefToManyInput referenceTo={field.referenceTo} bind:contents={$data[key]} />
			{:else if field.type === 'markdown'}
				<MarkdownInput bind:value={$data[key]} />
			{:else}
				<p>Unknown field type: {field.type}</p>
			{/if}
		</div>
	{/each}
</form>
