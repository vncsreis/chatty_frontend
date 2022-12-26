<script lang="ts">
	import { goto } from '$app/navigation';

	let name = '';

	async function handleSubmit() {
		console.log('running');
		try {
			let data = await (
				await fetch('http://127.0.0.1:3000/room', {
					method: 'POST',
					body: JSON.stringify({ name }),
					headers: {
						'Content-Type': 'application/json'
					}
				})
			).json();

			name = '';

			return goto(`/room/${data.id}`);
		} catch (e) {
			console.log(e);
		}
	}
</script>

<div class="h-full w-full flex flex-col items-center">
	<h1 class="text-5xl">Create a room</h1>

	<form class="mt-16 flex flex-col items-center" on:submit|preventDefault={() => handleSubmit()}>
		<div class="mb-8 flex flex-col">
			<label for="name" class="text-2xl">Name</label>
			<input
				bind:value={name}
				id="name"
				type="text"
				class="border-orange-600 border-solid border-2 text-2xl outline-none"
			/>
		</div>

		<button type="submit" class="bg-orange-600 text-white h-14 w-24 text-xl font-bold"
			>Create</button
		>
	</form>
</div>
