<script lang="ts">
  import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import ProgressMessage from './progressMessage.svelte';

  interface Source {
		source_name: string;
		content: string;
    external_ref: string;
    external_id: string;
	}
  
  export let sources: Array<Source> = [];
  export let loading: boolean;

</script>

<div class="tab-content">
  {#if loading}
    <ProgressMessage message="Loading sources" />
  {:else}
    {#if sources.length > 0}
      <Accordion>
        {#each sources as source}
          <AccordionItem>
            <svelte:fragment slot="summary"><h3 class="text-primary-300">{source.source_name}</h3></svelte:fragment>
            <svelte:fragment slot="content"><p class="whitespace-pre-wrap">{source.content}</p></svelte:fragment>
          </AccordionItem>
        {/each}
      </Accordion> 
    {:else}
      <h3 class="text-primary-300">No sources came back for the selected question.</h3>
    {/if}
  {/if}
</div>

