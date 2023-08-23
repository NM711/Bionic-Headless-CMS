import expres from 'express'
import { isWorkspace, isUser } from '../../../types/guards/workspace'
import { addUserToWorkspace, removeUserFromWorkspace, updateUserWorkspaceRole } from '../../querys/user'

import type { User } from '../../../types/user'
import type { Workspace } from '../../../types/workspace'

export const router = expres.Router()

router.put('/user/update', async (req, res) => {
  try {
    const user: User = req.body.user
    const workspace: Workspace = req.body.workspace
   
    isUser(user)
    isWorkspace(workspace)
    if (workspace.operation !== "add-user" && workspace.operation !== "remove-user") throw new Error(`Operation is neither 'add-user' or 'remove-user'!`)
    if (workspace.operation === "add-user") {
      await addUserToWorkspace(user, workspace)
    }
    if (workspace.operation === "remove-user") {
      await removeUserFromWorkspace(user, workspace)
    }
    res.json({ message: "Operation success!" })
  } catch (err: any) {
    res.status(err.status).json(err)
  }
})

router.patch('/user/update/role', async (req, res) => {
  try {
    const user: User = req.body.user
    const workspace: Workspace = req.body.workspace

    isUser(user)
    isWorkspace(workspace)

    if (workspace.operation === "change-user-role") {
      await updateUserWorkspaceRole(user, workspace)
    }

    res.json({ message: "User role succesfully changed!" })
  } catch (err: any) {
    res.status(err.status).json(err)
  }
})
