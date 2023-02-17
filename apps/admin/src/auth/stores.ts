import { writable, readable } from 'svelte/store';
import type { AuthData, UserData } from './models';

export const authStore = writable<AuthData | undefined>();

export const userStore = writable<UserData | undefined>();

export const isAuthenticated = readable<boolean>(false, (set) => {
	const unsubscribe = authStore.subscribe((auth) => {
		set(Boolean(auth?.token));
	});
	return unsubscribe;
});
