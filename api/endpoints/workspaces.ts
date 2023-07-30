import { createWorkspace, getWorkspace, updateAllContent, updateHeaders, updateImages, updateTextareas } from '../querys/workspace'
import express from 'express'
import { validateWorkspaceKey } from '../middlewares/validate'
import { AuthenticatedRequest } from '../middlewares/validate'
import { Workspace } from '../../types/interfaces/workspace'
import { User } from '../../types/interfaces/user'
export const router = express.Router()

router.post('/create', async (req: AuthenticatedRequest, res) => {
  try {
    const { id }: User = req.body.user
    const { name }: Workspace = req.body.workspace
    console.log(req.body.workspace, req.body.id)
    if (!id || !name) throw new Error('There seems to be missing fields in the request body!')

    const key = await createWorkspace({ id }, { name })
    console.log(id, name)
    res.json(
        { message: `Succesfully Created Workspace ${name}, Your Key Is ${key} Make Sure You Save It!`,
          key
        })
  } catch (err) {
    res.send(`${err}`)
  }
})

// Make a endpoint where the user is able to update their api key, or generate a new one

// 403385ef-8502-403c-955e-1bd7c6f2d91b:testworkspace1

function checkIfBodyIsArray(body: any) {
  // if true the contents of the req.body get merged into a single arr in postman for example
  // double key = arr but one key is not, so this is why this is necessary and who knows maybe its a good thing
  return Array.isArray(body) ? [...body] : [body]
}

 router.post('/update/:id', validateWorkspaceKey, async (req, res) => {
  try {
    const workspaceId = req.body.id
    const workspace = await getWorkspace(workspaceId)
    console.log(workspace?.workspace_content)
    const textareaContent: string[] = checkIfBodyIsArray(req.body.textarea_content)
    const imagesContent: string[] = checkIfBodyIsArray(req.body.image_content)
    const headerContent: string[] = checkIfBodyIsArray(req.body.header_content)
    //console.log(textareaContent.length, imagesContent.length, headerContent.length)

    if (headerContent.length > 0 && headerContent[0]) {
      await updateHeaders(workspaceId, headerContent)
    }

    if (imagesContent.length > 0 && imagesContent[0]) {
      await updateImages(workspaceId, imagesContent)
    }

    if (textareaContent.length > 0 && textareaContent[0]) {
      await updateTextareas(workspaceId, textareaContent)
    }

    if (textareaContent.length > 0 && textareaContent[0] &&
        imagesContent.length > 0 && imagesContent[0] && headerContent.length > 0 && headerContent[0]) {
      await updateAllContent(workspaceId, headerContent, textareaContent, imagesContent)
    }

  res.send('Updated Succesfully!')
}  catch (err) {
    res.send(`${err}`)
  }
})

router.get('/retrieve/:id', validateWorkspaceKey, async (req, res) => {
  try {
    const id: string = req.params.id
    const workspace = await getWorkspace({ id })
    res.send(workspace)
  } catch (err) {
    console.log(err)
    res.send('Error Retrieving workspace!')
  }
})


// implement all CRUD for workspaces
//
// view workspace content endpoint here aswell
