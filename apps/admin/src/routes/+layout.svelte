<script>
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	import '../app.css';
	import HomeLayout from '../components/Layout/HomeLayout.svelte';

	const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<HomeLayout>
		<slot />
	</HomeLayout>
</QueryClientProvider>
