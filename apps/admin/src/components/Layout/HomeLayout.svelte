<script lang="ts">
	import SideMenu from './SideMenu.svelte';
</script>

<div class="flex w-full">
	<SideMenu />
	<div class="flex-1 flex flex-col overflow-hidden">
		<slot />
	</div>
</div>
