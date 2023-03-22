<script lang="ts">
	import clsx from 'clsx';
	import { fade, scale } from 'svelte/transition';

	let className = '';
	export { className as class };
	export let open = false;

	let containerName: string;
	$: containerName = clsx(
		'bg-base-100 rounded-t-modal sm:rounded-modal z-10 min-h-[60%] w-full max-w-screen-sm overflow-hidden sm:min-h-[50%]',
		className
	);

	const handleKeys = (e: KeyboardEvent) => {
		if (e.key === 'Escape') open = false;
	};
</script>

{#if open}
	<div
		class="fixed inset-0 min-h-screen z-40 w-full flex items-end sm:items-center justify-center sm:p-4"
	>
		<div
			transition:fade={{ duration: 150, delay: 50 }}
			on:click={() => (open = false)}
			on:keydown={handleKeys}
			class="fixed inset-0 bg-black/20 min-h-screen"
		/>
		<div class={containerName} transition:scale={{ start: 0.95, opacity: 0, duration: 150 }}>
			<slot />
		</div>
	</div>
{/if}
