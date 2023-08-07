import { createWorkspace, deleteWorkspace, getWorkspace, updateAllContent, updateHeaders, updateImages, updateTextareas } from '../querys/workspace'
import express from 'express'
import { validateWorkspaceKey } from '../middlewares/validate'
import { AuthenticatedRequest } from '../middlewares/validate'
import { Workspace } from '../../types/interfaces/workspace'
import { User } from '../../types/interfaces/user'
import { updateWorkspaceMap } from '../functions/actions/workspace'
import {isWorkspace} from '../../types/guards/workspace'

export const router = express.Router()

router.post('/create', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.body.user) throw new Error('User field is missing, this field is required!')
    if (!req.body.workspace) throw new Error('Workspace field is missing, this field is required!')
    const workspace: Workspace = req.body.workspace
    const { id }: User = req.body.user
    isWorkspace(workspace)
    const key = await createWorkspace({ id }, workspace)
    if (!key) return res.json({ message: `Succesfully Created Workspace!` })
    res.json(
        { message: `Succesfully Created Workspace ${workspace.name}, Your Key Is ${key} Make Sure You Save It!`,
          key
        })
  } catch (err) {
    res.json({ error: `${err}` })
  }
})

router.post('/update', validateWorkspaceKey, async (req, res) => {
  try {
    const { id, content, content_type, content_operation }: Workspace = req.body.workspace
    const workspace = await getWorkspace({ id })
    console.log(workspace.content)

    if (content_type && content_operation === 'update/add') {
      const updateWorkspaceAction = updateWorkspaceMap[content_type]
      await updateWorkspaceAction({ id, content })
    }

    if (content_type && content_operation === 'remove') {

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
    res.json({ message: `${err}` })
  }
})

router.get('/delete/:id', validateWorkspaceKey, async (req, res) => {
  try {
    const id: string = req.params.id
    await deleteWorkspace(id)
    res.json({ message: `Succesfully deleted workspace ${id}` })
  } catch (err) {
    res.json({ message: `${err}` })
  }
})

// implement all CRUD for workspaces
//
// view workspace content endpoint here aswell
