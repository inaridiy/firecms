<script lang="ts">
	import Button from '../components/Elements/Button.svelte';

	const click = () => {
		console.log('Hello World');
	};
</script>

<Button color="primary" size="sm" on:click={click}>Hello World</Button>
