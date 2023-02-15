<script>
	import Button from '../components/Elements/Button.svelte';
	const click = () => {
		console.log('Hello World');
	};
</script>

<Button color="normal" size="sm" on:click={click}>Hello World</Button>
