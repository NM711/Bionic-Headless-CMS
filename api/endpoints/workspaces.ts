import { createWorkspace, deleteWorkspace, getWorkspace, updateAllContent, updateHeaders, updateImages, updateTextareas } from '../querys/workspace'
import express from 'express'
import { isAuth, validateWorkspaceKey } from '../middlewares/validate'
import { AuthenticatedRequest } from '../middlewares/validate'
import { Workspace } from '../../types/interfaces/workspace'
import { User } from '../../types/interfaces/user'
import { updateWorkspaceMap } from '../functions/actions/workspace'
import {isContent, isWorkspace} from '../../types/guards/workspace'
import {addUserToWorkspace} from '../querys/user'

export const router = express.Router()

router.post('/create', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.body.workspace) throw new Error('Workspace field is missing, this field is required!')
    const workspace: Workspace = req.body.workspace
    const userId = req.user.user.id
    isWorkspace(workspace)
    const key = await createWorkspace(userId, workspace)
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
    const user: User = req.body.user 
    const workspace: Workspace = req.body.workspace

    if (workspace.content_type && workspace.operation === 'update/add') {
      isContent(workspace.content)
      const updateWorkspaceAction = updateWorkspaceMap[workspace.content_type]
      await updateWorkspaceAction(workspace)
    }

    if (workspace.content_type && workspace.operation === 'add-user') {
      isContent(workspace.content)
      await addUserToWorkspace(user, workspace)
    }

    res.json({ message: 'Updated Succesfully!'})
}  catch (err) {
    res.json({ error: `${err}` })
  }
})
// ask for user id when viewing, check if user is within the given workspace.
router.get('/retrieve/:id', validateWorkspaceKey, async (req, res) => {
  try {
    const id: string = req.params.id
    const workspace = await getWorkspace({ id })
    res.json(workspace)
  } catch (err) {
    console.log(err)
    res.json({ error: `${err}` })
  }
})

router.get('/delete/:id', validateWorkspaceKey, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.user.id
    const id: string = req.params.id
    await deleteWorkspace(id, userId)
    res.json({ message: `Succesfully deleted workspace ${id}` })
  } catch (err) {
    res.json({ error: `${err}` })
  }
})

// implement all CRUD for workspaces
//
// view workspace content endpoint here aswell
