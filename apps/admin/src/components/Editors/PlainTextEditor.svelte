<script context="module">
	import { registerPlainText } from '@lexical/plain-text';
	import { Editor } from 'editor';
	import { createEditor } from 'lexical';
	import { onMount } from 'svelte';
</script>

<script lang="ts">
	let editor_dom: HTMLElement;
	onMount(() => {
		const editor = createEditor();
		editor.setRootElement(editor_dom);
		registerPlainText(editor);
	});
</script>

<Editor />
<div
	id="editor"
	contenteditable="true"
	class="p-2 border-2 border-base-content rounded-box"
	bind:this={editor_dom}
/>
