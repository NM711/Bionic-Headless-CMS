// example get all user workspaces, etc.
import express from 'express'
import { AuthenticatedRequest } from '../middlewares/validate'
import { getAllUserWorkspaces } from '../querys/workspace'

export const router = express.Router()

router.get('/my-workspaces', async (req: AuthenticatedRequest, res) => {
  try {
    const { user } = req.user
    console.log(user.id)
    const workspaces = await getAllUserWorkspaces(user.id)

    res.json(workspaces)
  } catch (err) {
    console.log(err)
    res.send(`There has been an error retrieving the users workspaces!`)
  }
})

