<script lang="ts">
	import SideMenu from './SideMenu.svelte';
</script>

<div class="flex">
	<SideMenu />
	<div class="flex-1 flex flex-col">
		<slot />
	</div>
</div>
