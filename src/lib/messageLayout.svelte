<script lang="ts">
	import RightMessage from '$lib/components/message/rightMessage.svelte';
	import LeftMessage from '$lib/components/message/leftMessage.svelte';
	import { afterUpdate } from 'svelte';
	import { selectedQuestionId, selectedConfigId, customPrompt, promptIsValid, workspaceId } from './store';
	import { configOptions } from '$lib/index';
	import { get } from 'svelte/store';
  import askApi from '$lib/api/ask';
	import SendIcon from './components/svg/sendIcon.svelte';

	interface MessageFeed {
		id: number;
		host: boolean;
		name: string;
		message: string;
		messageId: number;
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
	let idVal = 0;
  let messageIdVal = 1;
  

	afterUpdate(() => {
		if (messageFeed) scrollToBottom(element);
	});

	const scrollToBottom = async (node: any) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};

	function sendMessage() {
		if (currentMessage.length > 0) {
			blankMessageError = false;

			let newMessage: MessageFeed;
			newMessage = {
				id: idVal,
				host: true,
				name: 'Me',
				message: currentMessage,
				messageId: messageIdVal
			};

      idVal++;

			messageFeed.push(newMessage);
			messageFeed = messageFeed;
			messageLoading = true;
			
			let loadingMessage: MessageFeed;
			loadingMessage = {
				id: idVal,
				host: false,
				name: '',
				message: '',
				messageId: messageIdVal
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
			let data: DataObject 
      data = {
				query: message,
				messageMetadata: {
          messageId: messageIdVal
        }
			};

      if (selectedConfig?.augmentation === 'custom_prompt') {
		    data.messageMetadata.prompt = get(customPrompt)
      }
      
			const res = askApi(data)
			
      idVal++;
			let newMessage: MessageFeed;
			newMessage = {
				id: idVal,
				host: false,
				name: 'Chatbot',
				message: res.answer,
				messageId: res.messageMetadata.messageId
			};
      setTimeout(function() { 
        messageFeed.pop();
        messageFeed.push(newMessage);
        messageFeed = messageFeed;
      }, 5000); 

		} catch (error) {
			console.log(error);
      messageFeed[messageFeed.length - 1].message = 'Something went wrong.'
		}
    idVal++;
    messageIdVal++;
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
