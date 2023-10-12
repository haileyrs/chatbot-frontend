<script lang="ts">
	import ProgressMessage from "./progressMessage.svelte";

  export let prompt: String;
  export let loading: boolean;
</script>

<div class="tab-content">
  {#if loading}
    <ProgressMessage message="Prompt loading" />
  {:else}
    <h3 class="text-primary-300">Prompt Sent to the LLM</h3>
    <p class="whitespace-pre-wrap">{prompt}</p>
  {/if}
</div>