<script lang="ts">
  import { TabGroup, Tab } from '@skeletonlabs/skeleton';
  import SettingsTab from './settingsTab.svelte';
  import PromptTab from './promptTab.svelte';
  import SourceTab from './sourceTab.svelte';
  import getSourcesApi from './api/sources';
  import getPromptApi from './api/prompt';
  import { get } from 'svelte/store';
  import { selectedQuestionId, workspaceId } from './store';
  import { URISTRING } from '$lib';

  interface Source {
    id: number;
		source_name: string;
		content: string;
	}

  let tabSet: number = 0;
  let prompt: String = 'You must ask a question to create a prompt.';
  let sources: Array<Source> = [];
  let promptLoading: boolean = false;
  let sourcesLoading: boolean = false;

  const getSources = async(messageId: number) => {
    sourcesLoading = true;
    try {
      sources = getSourcesApi(messageId)
        
    } catch (error) {
      console.log(error)
      sources = []
    }
    sourcesLoading = false;
   };


  const getPrompt = async(messageId: number) => {
    promptLoading = true;
    try {
      prompt = getPromptApi(messageId)
    
    } catch (error) {
      console.log(error)
      prompt = "you need to activate the flask server"
    }
    promptLoading = false;
  };

  $: $selectedQuestionId, (getSources(get(selectedQuestionId)), getPrompt(get(selectedQuestionId)))
</script>

<TabGroup class="text-primary-50 p-4 overflow-y-hidden" active="border-b-2 border-primary-300" hover="hover:variant-ringed-primary">
	<Tab bind:group={tabSet} name="tab1" value={0} class="dark-variant-soft-primary">
		<span>Settings</span>
	</Tab>
	<Tab bind:group={tabSet} name="tab2" value={1} class="dark-variant-soft-primary">Prompt</Tab>
  <Tab bind:group={tabSet} name="tab3" value={2} class="dark-variant-soft-primary">Sources</Tab>
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
			<SettingsTab />
		{:else if tabSet === 1}
			<PromptTab loading={promptLoading} prompt={prompt} />
    {:else if tabSet === 2}
      <SourceTab loading={sourcesLoading} sources={sources} />
		{/if}
	</svelte:fragment>
</TabGroup>