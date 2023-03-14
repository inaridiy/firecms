<script lang="ts">
	import clsx from 'clsx';

	export let id: string;
	export let label = '';
	export let error = '';
	export let value: string | number = '';
	let addContainerClass = '';
	let addInputClass = '';
	export { addInputClass as inputClass, addContainerClass as containerClass };

	let containerClass: string;
	$: containerClass = clsx('flex flex-col gap-1', addContainerClass);

	let inputClass: string;
	$: inputClass = clsx(
		'rounded-box border-base-content w-full border-2 p-2 shadow-sm outline-none',
		addInputClass
	);
</script>

<div class={containerClass}>
	<label for={id} class="block font-medium text-base-content">{label}</label>
	<input
		{...$$restProps}
		bind:value
		on:blur
		on:change
		on:click
		on:contextmenu
		on:focus
		on:keydown
		on:keypress
		on:keyup
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:paste
		on:input
		class={inputClass}
	/>
	{#if error}
		<label for={id} class="block font-medium text-error">{error}</label>
	{/if}
</div>
