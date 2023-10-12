<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import Icon from '$lib/assets/bot.png';
	import { selectedQuestionId } from '../../store';
	import typewriter from '$lib';
	import TypingTest from '../functions/typingTest.svelte';
	import { get } from 'svelte/store';

	export let messageObj: any;

	let selectedItem: boolean = false;

	function handleClick(event: MouseEvent | KeyboardEvent) {
		event.preventDefault();
		selectedQuestionId.set(messageObj.messageId);
	}

	$: $selectedQuestionId, (selectedItem = messageObj.messageId == get(selectedQuestionId));
</script>

<button />
<div
	class="message-item justify-start items-end border-l-2 border-transparent"
	class:active-message={selectedItem}
>
	<div class="flex w-10 h-10 place-content-end">
		<Avatar src={Icon} background="bg-primary-100" rounded="rounded-full" width="w-16" />
	</div>
	<div
		on:click={handleClick}
		on:keyup={handleClick}
		class="card message-card p-4 bg-transparent rounded-bl-none space-y-2"
	>
		{#if messageObj.message === ''}
			<div>
				<TypingTest />
			</div>
		{:else}
			<div in:typewriter={{ speed: 10 }} class="whitespace-pre-line">
				<p class="break-words">{messageObj.message}</p>
			</div>
		{/if}
	</div>
</div>


<style>
.active-message {
	border-color: rgba(var(--color-primary-300) / 1)!important;
}
</style>
