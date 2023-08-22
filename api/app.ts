import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import 'dotenv/config'
import { router as authEndpoint } from './endpoints/auth'
import { router as workspacesEndpoint } from './endpoints/workspaces/workspace'
import { router as userWorkspaceEndpoint } from './endpoints/workspaces/user'
import { router as workspaceCollectionEndpoint } from './endpoints/workspaces/collection'
import { attachCurrentUser, isAuth, validateWorkspaceKey } from './middlewares/validate'
const app = express()

const port = 3001
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// endpoints
app.use('/auth', authEndpoint)

// for the time being im using query params for the key and workspace id, in the future consider adding all workspace ids
// as a route param that way we can live up to rest standards and also maintain a steady design for ease of use.

app.use(
  '/workspaces',
  isAuth,
  attachCurrentUser,
  validateWorkspaceKey,
  workspacesEndpoint,
  workspaceCollectionEndpoint,
  userWorkspaceEndpoint
)

app.listen(port, () => {
  console.log(`Express app running on port ${port}!`)
})
