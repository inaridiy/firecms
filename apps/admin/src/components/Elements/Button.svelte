<script lang="ts">
	import clsx from 'clsx';

	export let className: string | undefined = undefined;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let href: string | undefined = undefined;
	export let color: 'normal' | 'primary' | 'secondary' | 'outline' | 'ghost' = 'normal';
	export let size: 'normal' | 'sm' | 'lg' = 'normal';

	let buttonClass: string;
	$: buttonClass = clsx(
		'rounded-btn inline-flex items-center justify-center',
		'duration-btn active:scale-btn-focus gap-2 font-bold outline-none',
		{
			'bg-primary text-primary-content': color === 'primary',
			'bg-secondary text-secondary-content': color === 'secondary',
			'bg-neutral text-neutral-content hover': color === 'normal',
			'border-btn border-neutral hover:bg-neutral hover:text-neutral-content': color === 'outline',
			'bg-transparent text-base-content hover:bg-black/10': color === 'ghost',
			'px-4 py-2 text-sm': size === 'sm',
			'px-4 py-3 text-base': size === 'normal',
			'px-4 py-4 text-lg': size === 'lg'
		},
		className
	);
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{type}
	{href}
	{...$$restProps}
	on:click
	on:change
	on:keydown
	on:keyup
	on:mouseenter
	on:mouseleave
	class={buttonClass}
>
	<slot name="left" />
	<slot />
</svelte:element>
