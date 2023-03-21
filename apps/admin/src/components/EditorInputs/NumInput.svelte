<script lang="ts">
	import clsx from 'clsx';

	export let id = '';
	export let error = '';
	export let value = 0;
	export let containerClass = '';
</script>

<div class={clsx('rounded-box border-base-content flex w-full gap-2 border-2 p-2', containerClass)}>
	<slot name="left" />
	<input
		{...$$restProps}
		type="number"
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
