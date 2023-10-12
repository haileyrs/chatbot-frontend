<!-- this version of this file will not work with the current set up -->
<!-- it is intended for use in our actual dev environment and not this demo branch -->
<script lang="ts">
  import { TabGroup, Tab } from '@skeletonlabs/skeleton';
  import SettingsTab from './settingsTab.svelte';
  import PromptTab from './promptTab.svelte';
  import SourceTab from './sourceTab.svelte';
  import { get } from 'svelte/store';
  import { selectedQuestionId, workspaceId } from './store';
  import { URISTRING } from '$lib';

  interface Source {
		source_name: string;
		content: string;
    external_ref: string;
    external_id: string;
	}

  let tabSet: number = 0;
  let prompt: String = 'You must ask a question to create a prompt.';
  let sources: Array<Source> = [];
  let promptLoading: boolean = false;
  let sourcesLoading: boolean = false;

  const getSources = async(messageId: string) => {
    if (messageId != '') {
      sources = [];
      try {
        sourcesLoading = true;
        const data = {
          "message_metadata": { 
            "workspace_id": get(workspaceId),
            "message_id": messageId
          }
        }
        const req = await fetch(`http://${URISTRING}:8080/sources`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(data)
        })
        const res = await req.json()
        try {
          sources = res.sources.sources
        } catch (e) {
          console.log(e)
        }
        
      } catch (error) {
        console.log(error)
        sources = []
      }
      sourcesLoading = false;
    }
  }

  const getPrompt = async(messageId: string) => {
    if (messageId != '') {
      prompt = '';
      try {
        promptLoading = true;
        const data = {
          "message_metadata": { 
            "workspace_id": get(workspaceId),
            "message_id": messageId
          }
        }
        const req = await fetch(`http://${URISTRING}:8080/prompt`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(data)
        })
        const res = await req.json()
        prompt = res.prompt
      } catch (error) {
        console.log(error)
        prompt = "you need to activate the flask server"
      }
      promptLoading = false;
    }
  }

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