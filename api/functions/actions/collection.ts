import { updateHeaders, updateTextareas, updateImages, updateAllContent } from "../../querys/collection"
import type { Content, Collection, Workspace, CollectionOperation } from "../../../types/interfaces/workspace"

export const updateCollectionActionMap: { [ operation in CollectionOperation ]: Function } = {
  "add": async (contentType: "headers" | "textareas" | "images" | "all", w: Workspace) => {
   const collectionContentAction = updateCollectionMap[contentType]
   const message = await collectionContentAction(w)
   return { message }
  },

  "update": async () => {
  },

  "remove": async () => {
  },

  "none": () => null
}

export const updateCollectionMap: { [contentType: string]: (w: Workspace) => Promise<{ message: string }>  } = {
  'headers': async ({ id, collections }: Workspace) => {
    const collection = collections as Collection
    const { headers } = collection.content as Content
    if (headers) {
      const message = await updateHeaders({ id, collections }, { headers })
      return { message }
    } else throw new Error('Content type set to headers but the field is empty!')
  },
  'textareas': async ({ id, collections }: Workspace) => {
    const collection = collections as Collection
    const { textareas } = collection.content as Content
    if (textareas && textareas.length > 0) {
      const message = await updateTextareas({ id, collections }, { textareas })
      return { message }
    } else throw new Error('Content type set to textareas but the field is empty!')
  },
  'images': async ({ id, collections }: Workspace) => {
    const collection = collections as Collection
    const { images } = collection.content as Content
    if (images && images.length > 0) {
      const message = await updateImages({ id, collections }, { images })

      return { message }
    } else throw new Error('Content type set to images but the field is empty!')
  },
  'all': async ({ id, collections }: Workspace) => {
    const collection = collections as Collection
    const { headers, textareas, images } = collection.content as Content
    if (headers && textareas && images && headers.length > 0 && textareas.length > 0 && images.length > 0) {
      const message = await updateAllContent({ id, collections }, { headers, textareas, images })
      return { message }
    } else throw new Error('Content type set to all but the fields are empty!')
  }
}
