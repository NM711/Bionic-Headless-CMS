import { addHeaders, addTextareas, addAllContent, updateHeaders, updateTextareas, removeHeader, removeTextarea } from "../../../queries/collection"
import type { Content, Collection, Workspace, CollectionOperation } from "../../../../types/workspace"

export const updateCollectionContentActionMap: { [ operation in CollectionOperation ]: Function } = {
  "add": async (contentType: "headers" | "textareas" | "all", w: Workspace) => {
   const collectionContentAction = addCollectionContentMap[contentType]
   const message = await collectionContentAction(w)
   return { message }
  },

  "update": async (contentType: "headers" | "textareas", w: Workspace) => {
    const collectionContentAction = updateCollectionContentMap[contentType]
    const message = await collectionContentAction(w)

    return { message }
  },

  "remove": async (contentType: "headers" | "textareas", w: Workspace) => {
    const collectionContentAction = removeCollectionContentMap[contentType]
    const message = await collectionContentAction(w)

    return { message }
  },

  "none": () => null
}

type ReturnMessage = Promise<{ message: string }>

function generateCollectionMap (cmf: Function[]): { [contentType: string]: (w: Workspace) => ReturnMessage  }  {
  return {
    'headers': async (w: Workspace) => {
     return await updateContent(w, cmf[0])
   },
   'textareas': async (w: Workspace) => {
    return await updateContent(w, cmf[1])
   },
   'all': async (w: Workspace) => {
    return await updateContent(w, cmf[3])
   }
  }
}

const addCollectionContentMap = generateCollectionMap([addHeaders, addTextareas, addAllContent])
const updateCollectionContentMap = generateCollectionMap([updateHeaders, updateTextareas])
const removeCollectionContentMap = generateCollectionMap([removeHeader, removeTextarea])

async function updateContent (workspace: Workspace, fn: Function): Promise<{ message: any }> {
  const collection = workspace.collections as Collection
  const content = collection.content as Content
  const message = await fn(workspace, content)
  console.log(message)
  return { message }
}
