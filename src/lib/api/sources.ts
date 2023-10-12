import { asked, sampleSources } from "$lib/api/storage";

interface Source {
  id: number;
  source_name: string;
  content: string;
}

export default function getSourcesApi(data: any) {
  let sources: Array<Source | any> = []
  if (data != -2) {
    let sourcesList = asked.find((x) => x.messageMetadata.messageId === data).messageMetadata?.sourcesId
    for (let i = 0; i < sourcesList.length; i++) {
      sources.push(sampleSources.find((x) => x.id === sourcesList[i]))
    }
  }
  return sources
}