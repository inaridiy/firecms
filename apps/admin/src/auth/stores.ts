import { storable } from '$lib/utils/storable';
import { readable } from 'svelte/store';
import type { AuthData, UserData } from './models';

export const authStore = storable<string, AuthData | undefined>('auth');

export const userStore = storable<string, UserData | undefined>('user');

export const isAuthenticated = readable<boolean>(false, (set) => {
	const unsubscribe = authStore.subscribe((auth) => {
		set(Boolean(auth?.token));
	});
	return unsubscribe;
});
