import expres from 'express'
import { isWorkspace, isUser } from '../../../types/guards/workspace'
import { addUserToWorkspace, removeUserFromWorkspace, updateUserWorkspaceRole } from '../../querys/user'

import type { User } from '../../../types/interfaces/user'
import type { Workspace } from '../../../types/interfaces/workspace'

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
  } catch (err) {
    res.json({ error: `${err}` })
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
  } catch (err) {
    res.json({ error: `${err}` })
  }
})
