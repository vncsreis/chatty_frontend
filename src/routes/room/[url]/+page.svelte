<script lang="ts">
	import type { Message } from '$models/message';
	import { page } from '$app/stores';
	import { rooms } from '$stores/rooms';
	import { goto } from '$app/navigation';
	import type { Room } from '$models/room';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { v4 } from 'uuid';

	let { url } = $page.params;

	let room: Room;

	async function fetchRoomInfo(id: string) {
		const newRoom = await (await fetch(`http://127.0.0.1:3000/room/${id}`)).json();
		room = newRoom;
		if (!room) {
			goto('/404');
		}
	}

	fetchRoomInfo(url);

	let ws: WebSocket;

	let open = false;
	let messages: Message[] = [];
	let username = '';
	let loggedUsername = '';
	let messageText = '';

	onMount(async () => {
		if (browser) {
			try {
				ws = new WebSocket('ws://127.0.0.1:3000/ws');

				ws.addEventListener('open', () => {
					open = true;
				});

				ws.addEventListener('message', (message) => {
					const newMessage = JSON.parse(message.data);

					messages = [...messages, newMessage];
				});

				ws.addEventListener('close', (event) => {
					open = false;
				});
			} catch (e) {
				// console.log(e);
			}
		}
	});

	onDestroy(() => {
		ws.close();
	});

	function handleSendMessage(text: string, user: string) {
		const newMessage: Message = {
			id: v4(),
			sender: user,
			text,
			time: Date.now()
		};

		messageText = '';
		ws.send(JSON.stringify(newMessage));
	}

	async function handleLogin(roomId: string, username: string) {
		const body = {
			room_id: roomId,
			username
		};

		loggedUsername = username;
		ws.send(JSON.stringify(body));
	}
</script>

<div class="flex flex-col items-center w-full h-full">
	<h1 class="text-5xl mb-6 {open ? 'text-green-600' : ''}">{room?.name}</h1>
	<div
		class="border-orange-500 border-solid border-2 w-4/5
		flex flex-col items-center {messages.length === 0 ? 'justify-center' : ''}
		h-1/2 overflow-scroll overflow-x-hidden mb-6 {loggedUsername === '' ? 'bg-gray-300' : ''}"
	>
		{#if messages.length > 0}
			{#each messages as message (message.id)}
				<div class="w-full flex hover:bg-gray-100">
					<span class="text-gray-400">{message.sender}&nbsp;|&nbsp;</span>
					<p class="text-lg">{message.text}</p>
					<p class="text-gray-400 ml-auto">{new Date(message.time).toLocaleTimeString()}</p>
				</div>
			{/each}
		{:else if loggedUsername === ''}
			<p>Please login to chat</p>
		{:else}
			<p>No messages!</p>
		{/if}
	</div>

	{#if loggedUsername === ''}
		<form
			class="w-1/2 flex flex-col items-center"
			on:submit|preventDefault={() => handleLogin(url, username)}
		>
			<input type="text" class="border-orange-600 border-solid border-2" bind:value={username} />
			<button class="text-white bg-orange-500 w-20 h-10 font-bold" type="submit">Login</button>
		</form>
	{:else}
		<form
			class="w-1/2 flex flex-col items-center"
			on:submit|preventDefault={() => handleSendMessage(messageText, loggedUsername)}
		>
			<textarea
				bind:value={messageText}
				on:keydown={(e) => {
					if (e.key === 'Enter' && !e.shiftKey) {
						e.preventDefault();
						handleSendMessage(messageText, loggedUsername);
					}
				}}
				class="border-black outline-none border-solid border-2 w-8/12 mb-3"
			/>
			<button class="text-white bg-orange-500 w-20 h-10 font-bold" type="submit">Send</button>
		</form>
	{/if}
</div>
