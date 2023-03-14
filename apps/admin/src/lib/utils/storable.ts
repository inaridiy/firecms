import { browser } from '$app/environment';
import type { Writable } from '@felte/common';
import SuperJSON from 'superjson';
import { writable } from 'svelte/store';

export type Storable<T, U> = Writable<U> & { key: T; keyString: string };

export function storable<T, U>(key: T, data?: U): Storable<T, U> {
	const store = writable<U>(data);
	const isBrowser = browser && typeof localStorage !== 'undefined';
	const keyString = SuperJSON.stringify(key);

	if (isBrowser) {
		const stored = localStorage.getItem(keyString);
		if (stored) store.set(SuperJSON.parse(stored));
	}

	return {
		key,
		keyString,
		subscribe: store.subscribe,
		set: (v: U) => {
			if (isBrowser) localStorage.setItem(keyString, SuperJSON.stringify(v));
			store.set(v);
		},
		update: (cb) => {
			const update = (v: U) => {
				const newValue = cb(v);
				if (isBrowser) localStorage.setItem(keyString, SuperJSON.stringify(newValue));
				return newValue;
			};
			store.update(update);
		}
	};
}
