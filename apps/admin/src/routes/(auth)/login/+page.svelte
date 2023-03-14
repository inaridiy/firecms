<script>
	import { goto } from '$app/navigation';
	import { isEmail } from '$lib/utils';
	import { createForm } from 'felte';
	import { login } from '../../../auth';
	import Button from '../../../components/Elements/Button.svelte';
	import TextInput from '../../../components/Elements/TextInput.svelte';

	const { form, errors, data } = createForm({
		validate: (values) => {
			const errors = {};
			if (!values.email) errors.email = 'Email is required';
			if (values.email && !isEmail(values.email)) errors.email = 'Email is invalid';
			if (!values.password) errors.password = 'Password is required';
			if (values.password && values.password.length < 8)
				errors.password = 'Password must be at least 8 characters';

			return errors;
		},
		onSubmit: async (values) => {
			await login({
				nameOrEmail: values.email,
				password: values.password
			});
		},
		onSuccess: () => goto('/'),
		onError: () => ({
			global: 'Something went wrong :( check your password'
		})
	});
</script>

<section class="bg-white">
	<div class="lg:grid lg:min-h-screen lg:grid-cols-12">
		<aside class="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
			<img
				alt="Pattern"
				src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
				class="absolute inset-0 h-full w-full object-cover"
			/>
		</aside>

		<main
			aria-label="Main"
			class="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6"
		>
			<div class="max-w-xl lg:max-w-3xl w-full p-2">
				<h1 class="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">Login</h1>

				<form use:form class="mt-8 flex flex-col gap-4">
					<TextInput id="email" label="Email" bind:value={$data.email} error={$errors.email} />
					<TextInput
						id="password"
						type="password"
						label="Password"
						bind:value={$data.password}
						error={$errors.password}
					/>
					<Button type="submit">Login</Button>
					{#if $errors.global}
						<div class="block font-medium text-error">{$errors.global}</div>
					{/if}
				</form>
			</div>
		</main>
	</div>
</section>
