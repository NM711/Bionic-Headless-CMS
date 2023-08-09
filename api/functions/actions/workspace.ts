import { updateHeaders, updateTextareas, updateImages, updateAllContent } from "../../querys/workspace"
import { Content, Workspace } from "../../../types/interfaces/workspace"

export const updateWorkspaceMap: { [contentType: string]: Function  } = {
  'headers': async ({ id, content }: Workspace) => {
    const { headers } = content as Content
    if (headers) {
      await updateHeaders({ id }, { headers })
    } else throw new Error('Content type set to headers but the field is empty!')
  },
  'textareas': async ({ id, content }: Workspace) => {
    const { textareas }: Content = content as Content
    if (textareas && textareas.length > 0) {
      await updateTextareas({ id }, { textareas })
    } else throw new Error('Content type set to textareas but the field is empty!')
  },
  'images': async ({ id, content }: Workspace) => {
    const { images } = content as Content
    if (images && images.length > 0) {
      await updateImages({ id }, { images })
    } else throw new Error('Content type set to images but the field is empty!')
  },
  'all': async ({ id, content }: Workspace) => {
    const { headers, textareas, images } = content as Content
    if (headers && textareas && images && headers.length > 0 && textareas.length > 0 && images.length > 0) {
      await updateAllContent({ id }, { headers, textareas, images })
    } else throw new Error('Content type set to all but the fields are empty!')
  }
}
