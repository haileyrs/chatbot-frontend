import { sampleResponses, samplePrompt, sampleSources, asked } from "./storage"

interface MessageMetadata {
  messageId: number,
  prompt: string,
  sourcesId: Array<number>
}

interface ResponseObject {
  question: string,
  answer: string,
  messageMetadata: MessageMetadata,
}

export default function askApi(data: any) {
  let output: ResponseObject = { question: '', answer: '', messageMetadata: {messageId: 0, prompt: "", sourcesId: []}};
  
  const ind = Math.floor(Math.random() * (sampleResponses.length - 1))
  output.question = data.query
  output.messageMetadata.messageId = data.messageMetadata.messageId

  output.messageMetadata.prompt = (data.messageMetadata.prompt ? data.messageMetadata.prompt : samplePrompt)
  output.answer = sampleResponses[ind]
  output.messageMetadata.sourcesId.push(sampleSources[ind].id)

  asked.push(output)

  return output
}