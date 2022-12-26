import type { Room } from '$models/room';
import { writable } from 'svelte/store';

export const rooms = writable<Room[]>([]);
