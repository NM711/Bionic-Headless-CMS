import express from 'express'
import { createWorkspace, deleteWorkspace, getWorkspace } from '../../querys/workspace'
import { isWorkspace } from '../../../types/guards/workspace'

import type { AuthenticatedRequest } from '../../middlewares/validate'
import type { Workspace } from '../../../types/interfaces/workspace'

export const router = express.Router()

router.post('/create', async (req: AuthenticatedRequest, res) => {
  try {
    const workspace: Workspace = req.body.workspace
    const userId: any = req.user.id
    isWorkspace(workspace)
    const key = await createWorkspace(userId, workspace)
    if (!key) return res.json({ message: `Succesfully Created Workspace!` })
    res.json(
        { message: `Succesfully Created Workspace ${workspace.name}, Your Key Is ${key} Make Sure You Save It!`,
          key
        })
  } catch (err: any) {
    res.status(err.status || 500).json(err)
  }
})

router.patch('/update', async (req, res) => {
  try {
    const workspace: Workspace = req.body.workspace
    isWorkspace(workspace)
    // @ts-ignore
    if (workspace.name?.length > 0) {
      // update name
    }
    res.json({ message: 'Updated Succesfully!'})
}  catch (err: any) {
   res.status(err.status).json(err)
  }
})

// ask for user id when viewing, check if user is within the given workspace.
router.get('/retrieve', async (req, res) => {
  try {
    const id: any = req.query.id
    const workspace = await getWorkspace({ id })
    if (!workspace) throw new Error('No workspace found!')
    res.json(workspace)
  } catch (err: any) {
    res.status(err.status).json(err)
  }
})

router.delete('/delete', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.user.id
    const id: any = req.query.id
    await deleteWorkspace(id, userId)
    res.json({ message: `Succesfully deleted workspace ${id}` })
  } catch (err: any) {
    res.status(err.status).json(err)
  }
})