<script lang='ts'>
  import { Avatar } from '@skeletonlabs/skeleton';
  import { selectedQuestionId } from '../../store';
  import { get } from 'svelte/store';

  export let messageObj: any;

  let selectedItem: boolean = false;

  function handleClick(event: MouseEvent | KeyboardEvent) {
    event.preventDefault()
    selectedQuestionId.set(messageObj.messageId);
  }
  
  $: $selectedQuestionId, (selectedItem = (messageObj.messageId == get(selectedQuestionId)))
</script>
  
<div class="message-item justify-end items-end border-l-2 border-transparent" class:active-message={selectedItem}>
  <div 
    
    on:click={handleClick} 
    on:keyup={handleClick}
    class="card message-card p-4 variant-soft rounded-br-none space-y-2"
  >
    <div class="whitespace-pre-line">
      <p class="break-words">{messageObj.message}</p> 
    </div>
  </div>
  <div class="flex w-10 h-10 place-content-end">
    <Avatar initials="me" background="bg-primary-300" rounded="rounded-full" width="w-16" />
  </div>
</div>

<style>
.active-message {
	border-color: rgba(var(--color-primary-300) / 1)!important;
}
</style>
