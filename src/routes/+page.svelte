<script lang="ts">
	import { rooms } from '$stores/rooms';
	import { onMount } from 'svelte';

	onMount(async () => {
		let newRooms = await (await fetch('http://127.0.0.1:3000/room')).json();
		console.log(newRooms);
		rooms.set(newRooms);
	});
</script>

<div class="w-full h-full flex flex-col items-center">
	<h1 class="text-5xl">Find your <span class="text-orange-600">chatroom</span>:</h1>
	<ul class="mt-12">
		{#each $rooms as room (room.id)}
			<li class="text-2xl">
				<a href={`/room/${room.id}`} class="flex flex-col items-center">
					<span>
						{room.name}
					</span>
					<span class="text-orange-600 cursor-pointer text-sm">{room.id}</span></a
				>
			</li>
		{/each}
	</ul>

	<p class="text-3xl mt-64">
		Or create a <a href="/room/new"><span class="bg-orange-600 text-white p-2">new one</span></a>
	</p>
</div>
