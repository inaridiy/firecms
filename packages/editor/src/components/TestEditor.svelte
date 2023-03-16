<script context="module">
	import { CodeHighlightNode, CodeNode } from '@lexical/code';
	import { createEmptyHistoryState, registerHistory } from '@lexical/history';
	import { AutoLinkNode, LinkNode } from '@lexical/link';
	import { ListItemNode, ListNode } from '@lexical/list';
	import { registerMarkdownShortcuts, TRANSFORMERS } from '@lexical/markdown';
	import {
		$createHeadingNode as createHeadingNode,
		HeadingNode,
		QuoteNode,
		registerRichText
	} from '@lexical/rich-text';
	import { $setBlocksType as setBlocksType } from '@lexical/selection';
	import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
	import {
		$getSelection as getSelection,
		$isRangeSelection as isRangeSelection,
		createEditor
	} from 'lexical';
	import { onDestroy, onMount } from 'svelte';
</script>

<script lang="ts">
	import type { HeadingTagType } from '@lexical/rich-text';
	import type { LexicalEditor } from 'lexical';

	export let containerClass = '';

	let editor_dom: HTMLElement;
	let editor: LexicalEditor;
	let selectedType = 'paragraph';

	const formatHeading = (type: string) => {
		if (!editor) return;
		if (selectedType === type) return;
		editor.update(() => {
			const selection = getSelection();
			if (isRangeSelection(selection)) {
				setBlocksType(selection, () => createHeadingNode(type as HeadingTagType));
			}
		});
	};

	onMount(() => {
		editor = createEditor({
			namespace: 'demo',
			nodes: [
				HeadingNode,
				ListNode,
				ListItemNode,
				QuoteNode,
				CodeNode,
				CodeHighlightNode,
				TableNode,
				TableCellNode,
				TableRowNode,
				AutoLinkNode,
				LinkNode
			]
		});
		editor.setRootElement(editor_dom);
		registerRichText(editor);
		registerMarkdownShortcuts(editor, TRANSFORMERS);
		registerHistory(editor, createEmptyHistoryState(), 200);
	});
	onDestroy(() => {
		editor.setRootElement(null);
	});
</script>

<div class={containerClass}>
	<div class="flex">
		<button class="text-xl font-bold" on:click={() => formatHeading('h1')}>P</button>
		<button class="text-xl font-bold">H1</button>
	</div>
	<div
		id="editor"
		contenteditable="true"
		class="p-2 border-2 border-base-content rounded-box"
		bind:this={editor_dom}
	/>
</div>
