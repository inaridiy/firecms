<script lang="ts">
	import type { ContentType } from '$lib/api/contents';
	import { TestEditor } from 'editor';
	import NumInput from '../Elements/NumInput.svelte';
	import TextInput from '../Elements/TextInput.svelte';

	export let contentType: ContentType;
</script>

<TestEditor containerClass="editor-style" />

<form class="flex flex-col gap-4">
	{#each Object.entries(contentType.schema) as [key, field]}
		<div>
			<label for={field.name || key} class="text-lg font-bold">{field.name || key}</label>
			{#if field.type === 'string'}
				<TextInput type="text" containerClass="max-w-lg" name={field.name || key} />
			{:else if field.type === 'int'}
				<NumInput containerClass="max-w-lg" name={field.name || key} />
			{:else}
				<p>Unknown field type: {field.type}</p>
			{/if}
		</div>
	{/each}
</form>
