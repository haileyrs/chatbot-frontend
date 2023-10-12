<script lang="ts">
  import ConfigSelect from "./configSelect.svelte";
  import { configOptions, promptValidation } from "$lib";
  import { selectedConfigId, customPrompt, customContext, promptIsValid } from "./store";
  import { get } from "svelte/store";
	import CustomSourcesSettings from "./customSourcesSettings.svelte";
  import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

  let selectedConfig: any;
  let toastId: any;

  const toastStore = getToastStore();  

  selectedConfig = configOptions.find(x => x.id == get(selectedConfigId))

  function promptValidationCheck() {
    promptIsValid.set(promptValidation(get(customPrompt)))
    if (!get(promptIsValid) && !toastId) {
      let toastSettings: ToastSettings = {
        message: "Your prompt should contain the phrases <{query}> and <{formatted_sources}> once and only once to be considered valid.",
        background: 'variant-filled-warning',
        autohide: false
      }
       toastId = toastStore.trigger(toastSettings);
    } else if (get(promptIsValid) && toastId) {
      if (toastId) toastStore.close(toastId)
      toastId = ''
    }
  }

  $: $selectedConfigId, selectedConfig = configOptions.find(x => x.id == get(selectedConfigId))
</script>

<div class="tab-content">
  <ConfigSelect />
  <div class="info-line">
    {#if selectedConfig.retrieval === 'custom_retrieval'}
      <CustomSourcesSettings />
    {:else}
      <h3 class="text-primary-300">Selected Database</h3>
      <p>{selectedConfig.retrievalDisplayName}</p>
    {/if}
  </div>
  {#if selectedConfig.augmentation === 'custom_prompt'}
    <div class="info-line">
      <h3 class="text-primary-300 pb-2">Customizable System Context</h3>
      <input class="textarea border-0" bind:value={$customContext} />
    </div>
    <div class="info-line">
      <h3 class="text-primary-300 pb-2">Customizable Prompt</h3>
      <textarea class="textarea border-0" rows="4" bind:value={$customPrompt} on:input={promptValidationCheck} />
    </div>
  {:else}
    <div class="info-line">
      <h3 class="text-primary-300">Selected Prompt Template</h3>
      <p>{selectedConfig.augmentationDisplayName}</p>
    </div>
  {/if}
  <div class="info-line">
    <h3 class="text-primary-300">Selected Generation Engine</h3>
    <p>{selectedConfig.generationDisplayName}</p>
  </div>
</div>

<style>
  textarea, input {
    padding: .5rem;
    resize: none;
    line-height: 1.5;
    overflow-x: hidden;
    max-height: 80px;
    outline: none;
    color: black;
    overflow-y: scroll;
    font-size: 0.875rem;
	}

  textarea {
    border: none;
    min-height: 160px;
  }
</style>