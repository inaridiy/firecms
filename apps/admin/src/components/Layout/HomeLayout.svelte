<script lang="ts">
	import SideMenu from './SideMenu.svelte';
	let open = false;
</script>

<div class="flex">
	<SideMenu bind:open />
	<div class="flex-1 flex flex-col">
		<slot />
	</div>
</div>
