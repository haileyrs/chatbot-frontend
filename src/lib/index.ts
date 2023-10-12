export const URISTRING: string = 'localhost';

export function getTime() {
  let daysOfWeek : Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let now = new Date()
  let time = daysOfWeek[now.getDate()] + ' @ ' + now.getHours() + ':' + (now.getMinutes()<10?'0':'') + now.getMinutes()
  
  return time
}

export const configOptions = [
  {
    id: 1,
    config_name: "default",
    retrieval: "default_retrieval",
    augmentation: "default_augmentation",
    generation: "default_generation",
    displayName: "Default Database",
    retrievalDisplayName: "Default Retrieval",
    augmentationDisplayName: "Default Augmentation",
    generationDisplayName: "Default Generation"
  },
  {
    id: 2,
    config_name: "custom_prompt",
    retrieval: "default_retrieval",
    augmentation: "custom_prompt",
    generation: "default_generation",
    displayName: "Default w/Custom Prompt",
    retrievalDisplayName: "Default Retrieval",
    augmentationDisplayName: "Custom Prompt",
    generationDisplayName: "Default Generation"
  }
]

export function promptValidation(prompt: string) {
  let reSources = prompt.match(RegExp(/(\{formatted_sources\})/gm))
  let reQuery = prompt.match(RegExp(/(\{query\})/gm))

  if (reSources && reQuery) {
    if (reSources.length === 1 && reQuery.length === 1) {
      return true
    }
  }
  return false
}

export default function typewriter(node: any, { delay = 0, speed = 50 }) {
  const textNodes = getAllTextNodes(node);
  if (!textNodes.length) {
      throw new Error(`This transition only works on elements with text nodes`);
  }

  let totalLength = 0;
  const ranges = textNodes.map(textNode => {
      const range = [totalLength, totalLength + textNode.textContent.length];
      totalLength += textNode.textContent.length;
      const text = textNode.textContent;
      textNode.textContent = '';
      return { textNode, range, text };
  });

  let currentRangeIndex = 0;
  function getCurrentRange(i: any) {
      while (ranges[currentRangeIndex].range[1] < i && currentRangeIndex < ranges.length) {
          const { textNode, text } = ranges[currentRangeIndex];
          textNode.textContent = text;		// finish typing up the last node
          currentRangeIndex++;
      }
      return ranges[currentRangeIndex];
  }
  const duration = totalLength * speed;

  return {
      delay,
      duration,
      tick: (t: number) => {
          const progress = ~~(totalLength * t);
          const { textNode, range, text } = getCurrentRange(progress);
          const [start, end] = range;
          const textLength = ((progress - start) / (end - start)) * text.length;
          textNode.textContent = text.slice(0, textLength);
      },
  };
}


function getAllTextNodes(node: { nodeType: number; hasChildNodes: () => any; childNodes: any; }) {
  if (node.nodeType === 3) {
      return [node];
  } else if (node.hasChildNodes()) {
      let list: any[] = [];
      for (let child of node.childNodes) {
          getAllTextNodes(child).forEach(textNode => list.push(textNode));
      }
      return list;
  }
  return [];
}