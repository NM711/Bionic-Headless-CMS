import { addHeaders, addTextareas, addAllContent } from "../../../queries/collection"
import type { Content, Collection, Workspace, CollectionOperation } from "../../../../types/workspace"

export const updateCollectionContentActionMap: { [ operation in CollectionOperation ]: Function } = {
  "add": async (contentType: "headers" | "textareas" | "images" | "all", w: Workspace) => {
   const collectionContentAction = addCollectionContentMap[contentType]
   const message = await collectionContentAction(w)
   return { message }
  },

  "update": async () => {
  },

  "remove": async () => {
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

async function updateContent (workspace: Workspace, fn: Function): Promise<{ message: any }> {
  const collection = workspace.collections as Collection
  const content = collection.content as Content
  const message = await fn(workspace, content)
  console.log(message)
  return { message }
}