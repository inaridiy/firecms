<script lang="ts">
	import Button from '../Elements/Button.svelte';
	import SideMenu from './SideMenu.svelte';
	let open = false;
</script>

<div class="flex ">
	<SideMenu bind:open />
	<main class="flex-1">
		<Button on:click={() => (open = !open)}>Open</Button>
		<slot />
	</main>
</div>
