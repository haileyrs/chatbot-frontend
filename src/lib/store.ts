import { writable } from 'svelte/store';

export const selectedQuestionId = writable<number>(-2);

export const selectedConfigId = writable<number>(1);

export const customSources = writable<FileList>();

export const customPrompt = writable<string>(`Please answer the question using only these documents. If you are not absolutely sure, feel free make some assumptions but please state them clearly. \n\nThe documents are: {formatted_sources} \nQuestion: {query} \nAnswer:`);

export const customContext = writable<string>('You are a helpful assistant.');

export const promptIsValid = writable<boolean>(true);

export const workspaceId = writable<string>('');