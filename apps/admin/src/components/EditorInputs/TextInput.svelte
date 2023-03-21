<script lang="ts">
	import clsx from 'clsx';

	export let id = '';
	export let label = '';
	export let error = '';
	export let value: string | number = '';
	let addContainerClass = '';
	export { addContainerClass as containerClass };

	let containerClass: string;
	$: containerClass = clsx('flex flex-col gap-1', addContainerClass);
</script>

<div class={containerClass}>
	<label for={id} class="block font-medium text-base-content">{label}</label>
	<div class="rounded-box border-base-content w-full border-2 p-2 flex gap-2">
		<slot name="left" />
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
			class="outline-none w-full"
		/>
	</div>
	{#if error}
		<label for={id} class="block font-medium text-error">{error}</label>
	{/if}
</div>
