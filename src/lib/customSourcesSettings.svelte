<script lang="ts">
	import ProgressMessage from './progressMessage.svelte';
	import { customSources, workspaceId } from './store';
	import { get } from 'svelte/store';
	import { URISTRING } from '$lib';
	import { FileButton, clipboard } from '@skeletonlabs/skeleton';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import UploadFileLg from './components/svg/uploadFileLg.svelte';
	import UploadFileSm from './components/svg/uploadFileSm.svelte';
	import UploadFileMd from './components/svg/uploadFileMd.svelte';
	import UploadedFile from './components/svg/uploadedFile.svelte';
	import CopyBtn from './components/svg/copyBtn.svelte';
	import RemoveBtn from './components/svg/removeBtn.svelte';
	import SuccessIcon from './components/svg/successIcon.svelte';

	interface FileTableObject {
		name: string;
		[key: string]: any;
	}

	let popupSettings: PopupSettings = {
		event: 'hover',
		target: 'copyPopup',
		placement: 'right'
	};

	let fileNames: Array<File> = [];
	let uploading = false;
	let hasUploadedFiles = false;
	let finalFiles: Array<FileTableObject> = [];
	let addtnlFiles: FileList;
	let inputWorkspaceId = '';
	let copyMessage = 'Copy';

	const toastStore = getToastStore();

	const uploadFiles = async (files: Array<File>) => {
		if (files.length > 0) {
			try {
        uploading = true;
				let formData = new FormData();
				for (let i = 0; i < files.length; i++) {
					formData.append('files[]', files[i]);
				}

				const req = await fetch(`http://${URISTRING}:8080/upload`, {
					method: 'POST',
					body: formData
				});
				// receive response for each file and change loading icon to green check mark
				const res = await req.json();

				for (let i = 0; i < files.length; i++) {
					finalFiles.unshift({ name: files[i].name });
				}

				workspaceId.set(res.workspace_id);

				hasUploadedFiles = true;
				fileNames = [];
				toast('Files were uploaded successfully, ask away!', 'success');
			} catch (error) {
				// console.log(error)
				// toast('There was an error uploading and embedding the files.', 'error')
				for (let i = 0; i < files.length; i++) {
					finalFiles.unshift({ name: files[i].name });
				}
				inputWorkspaceId = 'asdf';
				workspaceId.set('asdf');
				hasUploadedFiles = true;
				fileNames = [];
				toast('Files were uploaded successfully, ask away!', 'success');
			}
			uploading = false;
		}
	};

  const uploadFilesRevisited = async (files: Array<File>) => {
    if (files.length > 0) {
      try {
        uploading = true;
				let formData = new FormData();
				for (let i = 0; i < files.length; i++) {
					formData.append('files[]', files[i]);
				}

        let urlString: string = `http://${URISTRING}:8080/upload`;

        if (inputWorkspaceId.length === 36) {
          urlString = urlString + `/?conversation_id=${inputWorkspaceId}`;
        }

				const req = await fetch(urlString, {
					method: 'POST',
					body: formData
				});
				// receive response for each file and change loading icon to green check mark
				const res = await req.json();

				for (let i = 0; i < files.length; i++) {
					finalFiles.unshift({ name: files[i].name });
				}

				workspaceId.set(res.workspace_id);
        inputWorkspaceId = res.workspace_id

				hasUploadedFiles = true;
				fileNames = [];
				toast('Files were uploaded successfully, ask away!', 'success');
			} catch (error) {
				console.log(error)
				toast('There was an error uploading and embedding the files.', 'error');
			}
			uploading = false;
		}
  }

	const addFiles = async (files: Array<File>) => {
		if (files.length > 0 && inputWorkspaceId != '') {
			try {
        uploading = true;
				let formData = new FormData();
				let urlWParams = `http://${URISTRING}:8080/add/?conversation_id=${inputWorkspaceId}`;
				for (let i = 0; i < files.length; i++) {
					formData.append('files[]', files[i]);
				}

				const req = await fetch(urlWParams, {
					method: 'POST',
					body: formData
				});
				// receive response for each file and change loading icon to green check mark
				const res = await req.json();
				// confirm all items have uploaded message
				console.log(res);
				for (let i = 0; i < files.length; i++) {
					finalFiles.unshift({ name: files[i].name });
				}

				finalFiles = finalFiles;

				fileNames = [];
				toast('Files were uploaded successfully, ask away!', 'success');
			} catch (error) {
				// console.log(error)
				// toast('There was an error uploading additional files.', 'error')

				for (let i = 0; i < files.length; i++) {
					finalFiles.unshift({ name: files[i].name });
				}

				finalFiles = finalFiles;

				fileNames = [];
				toast('Files were uploaded successfully, ask away!', 'success');
			}
			uploading = false;
		}
	};

	const sendWorkspaceID = async () => {
		// will hit workspace id endpoint and get back sources to feed into sources table
		try {
			uploading = true;
			let data = {
			  workspace_id: inputWorkspaceId
			}
			const req = await fetch(`http://${URISTRING}:8080/fetch`, {
			    method: "POST",
			    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
			    body: JSON.stringify(data)
			  })
			const res = await req.json();

			// for item in response, add to finalFiles so they're displayed in table
			for (let i = 0; i < res.file_list.length; i++) {
			  finalFiles.push({name: res.file_list[i] })
			}
			workspaceId.set(inputWorkspaceId)
			hasUploadedFiles = true;
			toast('Workspace id is valid and files were found.', 'success')
		} catch (error) {
			console.log(error);
			toast('The workspace id could not be found.', 'error');
		}
		uploading = false;
		fileNames = [];
	};

	function onSourceUpload(e: Event): void {
		inputWorkspaceId = '';
		for (const file of get(customSources)) {
			fileNames.unshift(file);
		}
		fileNames = [...fileNames];
	}

	function onMoreSourcesUpload(e: Event): void {
		for (const file of addtnlFiles) {
			fileNames.unshift(file);
		}
		fileNames = [...fileNames];
	}

	function removeFile(filename: string) {
		fileNames = fileNames.filter((n) => n.name != filename);
	}

	function validateWorkspaceId() {
    // uuid should be 36 characters
		if (inputWorkspaceId.length === 36) {
			sendWorkspaceID();
		}
	}

	function toast(message: string, type: string) {
		let background = 'variant-filled-primary';
		if (type === 'success') {
			background = 'variant-filled-success';
		} else if (type === 'error') {
			background = 'variant-filled-error';
		}

		let toastSettings: ToastSettings = {
			message: message,
			timeout: 5000,
			background: background
		};
		toastStore.trigger(toastSettings);
	}

	function changePopup() {
		copyMessage = 'Copied!';
		setTimeout(() => {
			copyMessage = 'Copy';
		}, 3000);
	}
</script>

<div class="flex align-center justify-between">
	<div class="flex flex-grow">
		<div
			class="grow min-h-[21px] grid-cols-[1fr_auto] rounded-md drop-shadow-lg input-group input-group-divider border-primary-300"
		>
			<input
				class="bg-transparent border-0 ring-0"
				name="prompt"
				id="prompt"
				placeholder="Enter a custom workspace id or upload files"
        disabled={uploading}
				bind:value={inputWorkspaceId}
				on:input={validateWorkspaceId}
			/>

			<button
				on:click={changePopup}
				use:clipboard={inputWorkspaceId}
				use:popup={popupSettings}
				class="[&>*]:pointer-events-none"
			>
        <CopyBtn />
			</button>
		</div>
		<div class="card variant-filled-surface px-3 py-2" data-popup="copyPopup">
			<div><p class="loading-text">{copyMessage}</p></div>
			<div class="arrow bg-primary-400" />
		</div>
	</div>
</div>

{#if uploading}
	{#if fileNames.length}
		<!-- If user entered files and clicked upload -->
		<ProgressMessage message="Uploading and embedding attached files to Pinecone vector database" />
	{:else if inputWorkspaceId != ''}
		<!-- If user entered workspace Id and service is searching for files associated with that id -->
		<ProgressMessage
			message="Searching for files associated with workspace id: {inputWorkspaceId}"
		/>
	{/if}
{:else if hasUploadedFiles}
	{#if fileNames.length != 0}
		<div class="table-container">
			<table class="table table-compact">
				<tbody>
					{#each fileNames as file, i}
						<tr>
							<td style="color: black;">{file.name}</td>
							<td class="flex justify-end content-center">
                <button type="button" class="btn p-0" on:click={() => removeFile(file.name)} on:keydown={() => removeFile(file.name)}>
                  <RemoveBtn />
                </button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="flex justify-end">
			<btn
				class="btn btn-sm variant-filled-surface my-2 cursor-pointer"
				type="button"
				on:click={addFiles(fileNames)}
				on:keydown={addFiles(fileNames)}
			>
				Upload
			</btn>
		</div>
	{/if}

	<!-- display uploaded files -->

	<div class="table-container">
		<table class="table table-compact">
			<tbody>
				<tr class="sticky top-0 bg-primary-100 h-[44px]">
					<td>
						<FileButton
							multiple
							name="files"
							bind:files={addtnlFiles}
							on:change={onMoreSourcesUpload}
							button="btn flex p-0 flex-row"
							disabled={uploading}
						>
              <UploadFileSm />
							<span class="text-primary-500" style="font-size: 0.875rem;">Add more files</span>
						</FileButton>
					</td>
					<td class="bg-primary-100" />
				</tr>
				{#each finalFiles as file, i}
					<tr>
						<td style="color: black;">{file.name}</td>
						<td class="flex justify-end content-center">
							<SuccessIcon />
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- grid option -->

	<div style="max-height: 320px; overflow-y: scroll;">
		<div class="file-grid grid grid-cols-3 lg:grid-cols-4 gap-3 justify-center content-center m-2">
			<div class="grid-square">
				<FileButton
					multiple
					name="files"
					bind:files={addtnlFiles}
					on:change={onMoreSourcesUpload}
					button="btn p-0 m-0 h-16"
					disabled={uploading}
					class="h-16"
				>
          <UploadFileMd />
				</FileButton>
				<p class="text-center h-8" style="font-size: 0.75rem; line-height: 1rem;">Add more files</p>
			</div>

			{#each finalFiles as file, i}
				<div class="grid-square">
          <UploadedFile />
					<p class="line-clamp-2 text-center h-8" style="font-size: 0.75rem; line-height: 1rem;">
						{file.name}
					</p>
				</div>
			{/each}
		</div>
	</div>
{:else if fileNames.length != 0 && !hasUploadedFiles}
	<div class="table-container">
		<table class="table table-compact">
			<tbody>
				{#each fileNames as file, i}
					<tr>
						<td style="color: black;">{file.name}</td>
						<td class="flex justify-end content-center">
              <button type="button" class="btn p-0" on:click={() => removeFile(file.name)} on:keydown={() => removeFile(file.name)}>
                <RemoveBtn />
              </button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div class="flex justify-end">
		<btn
			class="btn btn-sm variant-filled-surface mt-2 cursor-pointer"
			type="button"
			disabled={hasUploadedFiles}
			on:click={uploadFiles(fileNames)}
			on:keydown={uploadFiles(fileNames)}
		>
			Upload
		</btn>
	</div>
{:else}
	<div class="flex my-8 justify-center">
		<FileButton
			multiple
			bind:files={$customSources}
			on:change={onSourceUpload}
			name="files"
			button="btn py-1 flex flex-col justify-center"
			disabled={hasUploadedFiles || uploading}
			class="flex flex-col"
		>
      <UploadFileLg />
			<p class="text-center" style="margin-left:0!important;">Upload files</p>
		</FileButton>
	</div>
{/if}

<style>
	input {
		padding: 0.5rem;
		resize: none;
		line-height: 1.5;
		overflow-x: hidden;
		max-height: 80px;
		outline: none;
		color: black;
		overflow-y: scroll;
		font-size: 0.875rem;
	}

	input:focus {
		outline: none;
		outline-width: 0;
		box-shadow: none;
		-moz-box-shadow: none;
		-webkit-box-shadow: none;
	}
</style>
