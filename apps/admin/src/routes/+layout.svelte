<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { authStore } from '../auth';

	import '../app.css';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	onMount(() => {
		if (browser && !$authStore) goto('/login');
	});
</script>

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
