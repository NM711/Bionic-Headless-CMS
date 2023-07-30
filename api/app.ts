import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import 'dotenv/config'
import { router as authEndpoint } from './endpoints/auth'
import { router as workspacesEndpoint } from './endpoints/workspaces'
import { router as userEndpoint } from './endpoints/user'
import { attachCurrentUser, isAuth } from './middlewares/validate'
const app = express()

const port = 3001

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// endpoints
app.use('/auth', authEndpoint)
app.use('/workspaces', isAuth, attachCurrentUser, workspacesEndpoint)
app.use('/user', isAuth, attachCurrentUser, userEndpoint)
app.listen(port, () => {
  console.log(`Express app running on port ${port}!`)
})
