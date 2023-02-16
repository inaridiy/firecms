<script>
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	import '../app.css';
	import HomeLayout from '../components/Layout/HomeLayout.svelte';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<HomeLayout>
		<slot />
	</HomeLayout>
</QueryClientProvider>
