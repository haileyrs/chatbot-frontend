<!-- this version of this file will not work with the current set up -->
<!-- it is intended for use in our actual dev environment and not this demo branch -->
<script lang="ts">
	import RightMessage from '$lib/components/message/rightMessage.svelte';
	import LeftMessage from '$lib/components/message/leftMessage.svelte';
	import { afterUpdate } from 'svelte';
	import { selectedQuestionId, selectedConfigId, customContext, customPrompt, promptIsValid, workspaceId } from './store';
	import { configOptions, URISTRING } from '$lib/index';
	import { get } from 'svelte/store';
	import SendIcon from './components/svg/sendIcon.svelte';

	interface MessageFeed {
		id: number;
		host: boolean;
		name: string;
		message: string;
		messageId: string;
	}

  interface DataObject {
    query: string,
    [key: string]: any
  }

	let element: any;
	let textarea: any;
	let blankMessageError = false;
	let messageLoading = false;
	let messageFeed: MessageFeed[] = [];
	let currentMessage = '';
	let idVal = 3;
  

	afterUpdate(() => {
		if (messageFeed) scrollToBottom(element);
	});

	const scrollToBottom = async (node: any) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};

	function sendMessage() {
		if (currentMessage.length > 0) {
			blankMessageError = false;
			idVal += 1;

			let newMessage: MessageFeed;
			newMessage = {
				id: idVal,
				host: true,
				name: 'Me',
				message: currentMessage,
				messageId: ''
			};

			messageFeed.push(newMessage);
			messageFeed = messageFeed;
			messageLoading = true;

			idVal += 1;
			let loadingMessage: MessageFeed;
			loadingMessage = {
				id: idVal,
				host: false,
				name: '',
				message: '',
				messageId: ''
			};
			messageFeed.push(loadingMessage);

			sendQuestion(currentMessage);
		} else {
			blankMessageError = true;
		}
    selectedQuestionId.set(messageFeed[messageFeed.length - 1].messageId)

		currentMessage = ''
    textarea.style.height = 'auto';
	}

	const sendQuestion = async (message: string) => {
    let selectedConfig = configOptions.find((x) => x.id == get(selectedConfigId))
    
		try {
      idVal += 1;
			let data: DataObject 
      data = {
				query: message,
				message_metadata: {
          workspace_id: null
        },
				config_name: selectedConfig?.config_name
			};

      // If custom prompt configuration is selected, add custom prompt input
      if (selectedConfig?.augmentation === 'custom_prompt') {
		    data.message_metadata.prompt_template = get(customPrompt)
        data.message_metadata.system_context = get(customContext)
      }

			// If workspace id exists (meaning sources were added manually), add the workspace id message item
			if (get(workspaceId) != '') {
				data.message_metadata.workspace_id = get(workspaceId)
			}

			const req = await fetch(`http://${URISTRING}:8080/ask`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
				body: JSON.stringify(data)
			});
			const res = await req.json();
			

			let newMessage: MessageFeed;
			newMessage = {
				id: idVal,
				host: false,
				name: 'buddy',
				message: res.output,
				messageId: res.message_metadata?.message_id
			};

			messageFeed.pop();

			selectedQuestionId.set(res.message_metadata?.message_id);
			messageFeed[messageFeed.length - 1].messageId = res.message_metadata?.message_id;

			messageFeed.push(newMessage);
			messageFeed = messageFeed;

      workspaceId.set(res.message_metadata?.workspace_id)
			
		} catch (error) {
			console.log(error);
      messageFeed[messageFeed.length - 1].message = 'Something went wrong.'
      
      messageFeed[messageFeed.length - 1].messageId = `error${idVal}`; 
      messageFeed[messageFeed.length - 2].messageId = `error${idVal}`;
		}
    selectedQuestionId.set(messageFeed[messageFeed.length - 1].messageId)
    messageLoading = false;
	};

	function fireEvent(e: any) {
		if (!(currentMessage.length < 1) && e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
      let p = customPromptCheck()
			if (currentMessage.replace('\n', '').length > 0 && !messageLoading && p) {
				sendMessage();
			}
		} else {
			return false;
		}
	}

	function onTextareaInput() {
    customPromptCheck()
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}

  function customPromptCheck() {
    let selectedConfig = configOptions.find((x) => x.id == get(selectedConfigId))
    if (selectedConfig?.augmentation === 'custom_prompt') {
      return get(promptIsValid)
    } else {
      return true
    }
  }

	export function resetMessages() {
    workspaceId.set('')
		messageFeed = [];
		messageLoading = false;
    blankMessageError = false;
    currentMessage = '';
    idVal = 1;
	}

	$: if (messageFeed && element) {
		scrollToBottom(element);
	}

	$: $selectedConfigId, resetMessages()
</script>

<div class="message-container-content">
	<div bind:this={element} class="grid grid-cols-1 gap-2 overflow-y-scroll">
		{#each messageFeed as bubble (bubble.id)}
			{#if bubble.host}
				<RightMessage messageObj={bubble} />
			{:else}
				<LeftMessage messageObj={bubble} />
			{/if}
		{/each}
	</div>
	<form on:submit|preventDefault={() => sendMessage()}>
		{#if blankMessageError}
			<aside class="alert variant-ghost-error">
				<div class="alert-message">
					<p>Please type a message to continue</p>
				</div>
			</aside>
		{/if}
		<div class="flex gap-2">
			<div class="message-input input-group input-group-divider border-primary-300">
				<textarea
					bind:this={textarea}
					bind:value={currentMessage}
					class="bg-transparent border-0 ring-0"
					name="prompt"
					id="prompt"
					placeholder="Write a message..."
					rows="1"
					on:keydown={fireEvent}
					on:input={onTextareaInput}
				/>
				<button
					disabled={currentMessage.replace('\n', '').length < 1 || messageLoading || !customPromptCheck()}
					class="svg-btn variant-filled-primary btn-icon-sm m-3"
					type="submit"
				>
					<SendIcon />
				</button>
			</div>
		</div>
	</form>
</div>


<style>
	textarea {
		padding: 1rem;
		resize: none;
		line-height: 1.5;
		overflow-x: hidden;
		max-height: 120px;
		border: none;
		outline: none;
	}

  textarea:focus {
    outline: none;
    outline-width: 0;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
  }
</style>
