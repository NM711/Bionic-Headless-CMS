import { createWorkspace, getWorkspace, updateAllContent, updateHeaders, updateImages, updateTextareas } from '../querys/workspace'
import express from 'express'
import { validateWorkspaceKey } from '../middlewares/validate'
import { AuthenticatedRequest } from '../middlewares/validate'
import { Workspace } from '../../types/interfaces/workspace'
import { User } from '../../types/interfaces/user'
import { updateWorkspaceMap } from '../functions/actions/workspace'

export const router = express.Router()

router.post('/create', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.body.user) throw new Error('User field is missing, this field is required!')
    if (!req.body.workspace) throw new Error('Workspace field is missing, this field is required!')
    const { id }: User = req.body.user
    const { name }: Workspace = req.body.workspace
    if (!id || !name) throw new Error('There seems to be missing fields in the request body!')

    const key = await createWorkspace({ id }, { name })
    console.log(id, name)
    res.json(
        { message: `Succesfully Created Workspace ${name}, Your Key Is ${key} Make Sure You Save It!`,
          key
        })
  } catch (err) {
    res.json({ message: `${err}` })
  }
})

// Make a endpoint where the user is able to update their api key, or generate a new one

// 403385ef-8502-403c-955e-1bd7c6f2d91b:testworkspace1

router.post('/update', validateWorkspaceKey, async (req, res) => {
  try {
    const { id, content, content_type }: Workspace = req.body.workspace
    const workspace = await getWorkspace({ id })
    console.log(workspace?.workspace_content)

    if (content_type) {
      const updateWorkspaceAction = updateWorkspaceMap[content_type]
      await updateWorkspaceAction({ id, content })
    }

    res.send('Updated Succesfully!')
}  catch (err) {
    res.json({ message: `${err}` })
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
