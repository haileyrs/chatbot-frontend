import { asked } from "$lib/api/storage";

export default function getPromptApi(data: any) {
  let foundPrompt = '';
  console.log(asked)
  if (data != -2) {
    foundPrompt = asked.find((x) => x.messageMetadata.messageId === data).messageMetadata?.prompt
  }
  return foundPrompt
}