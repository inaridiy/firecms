<script lang="ts">
	export let title: string;
	export let loading = false;
</script>

<header class="flex border-b px-4 items-center h-16">
	{#if loading}
		<div class="h-12 bg-base-200 w-full max-w-sm rounded-lg animate-pulse" />
	{:else}
		<h2 class="text-4xl font-bold">{title}</h2>
	{/if}
</header>
