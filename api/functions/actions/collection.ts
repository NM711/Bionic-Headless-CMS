import { addHeaders, addTextareas, addImages, addAllContent } from "../../querys/collection"
import type { Content, Collection, Workspace, CollectionOperation } from "../../../types/workspace"

export const updateCollectionContentActionMap: { [ operation in CollectionOperation ]: Function } = {
  "add": async (contentType: "headers" | "textareas" | "images" | "all", w: Workspace) => {
   const collectionContentAction = updateCollectionContentMap[contentType]
   const message = await collectionContentAction(w)
   return { message }
  },

  "update": async () => {
  },

  "remove": async () => {
  },

  "none": () => null
}

const updateCollectionContentMap: { [contentType: string]: (w: Workspace) => Promise<{ message: string }>  } = {
  'headers': async (w: Workspace) => {
   return await updateContent(w, addHeaders)
  },
  'textareas': async (w: Workspace) => {
   return await updateContent(w, addTextareas)
  },
  'images': async (w: Workspace) => {
   return await updateContent(w, addImages)
  },
  'all': async (w: Workspace) => {
   return await updateContent(w, addAllContent)
  }
}

async function updateContent (workspace: Workspace, fn: Function): Promise<{ message: any }> {
  const collection = workspace.collections as Collection
  const content = collection.content as Content
  const message = await fn(workspace, content)
  console.log(message)
  return { message }
}