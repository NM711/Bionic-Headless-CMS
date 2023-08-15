import { Request, Response, NextFunction } from 'express'
import { getUserById } from '../querys/user'
import { getWorkspaceHash, retrieveKeyConstraint } from '../querys/workspace'
import bcrypt from 'bcrypt'
import * as jwt from 'express-jwt'
import 'dotenv/config'
import { Workspace } from '../../types/interfaces/workspace'
import { isWorkspace } from '../../types/guards/workspace'

export interface AuthenticatedRequest extends Request {
  token?: any;
  user?: any;
}

export function receiveJWTFromAuthHeader (req: Request) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1]
  }
}

export const isAuth = jwt.expressjwt({
  // @ts-ignore
  secret: process.env.JWT_SECRET,
  requestProperty: 'token',
  getToken: receiveJWTFromAuthHeader,
  algorithms: ['RS256', 'HS256'],
})

export async function attachCurrentUser (req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.token
  if (token) {
    try {
      const userId = await getUserById(token.data.id)
      if (userId) {
        req.user = userId
        return next()
      }
      return res.status(401).send('User Not Found!')
    } catch (err) {
      console.log(err)
      return res.status(500).send('Internal Server Error')
    }
  }
  return res.status(401).send('Unauthorized')

}


export async function validateWorkspaceKey (req: Request, res: Response, next: NextFunction) {
  async function compareIdAndHash (id: string, key: string) {
    const { key: hash } = await getWorkspaceHash({ id })
    const isValid = await bcrypt.compare(key, hash)
    if (!isValid) throw new Error('Incorrect key or id!')
    console.log('Workspace key is valid')
    next()
  }

  async function validateKeyActionWithBody () {
    const key: string = req.body.key as string
      if (!req.body.workspace) throw new Error('No workspace body found this field is required!')
      const workspace: Workspace = req.body.workspace
      isWorkspace(workspace)
      if (!workspace.id) throw new Error('Project id field is missing!')
      const k = await retrieveKeyConstraint(workspace)
      if (!k?.key_constraint) return next()
      await compareIdAndHash(workspace.id, key)
  }

  async function validateKeyAction () {
    const key: any = req.query.key
    const id: any = req.query.id
    console.log(id)
    const k = await retrieveKeyConstraint({ id })
    console.log(k)
    if (!k?.key_constraint) return next()
    console.log(`True key constraint found key_constraint: ${k.key_constraint}`)
    await compareIdAndHash(id, key)
  }

  try {
    const keyValidationMap: { [method: string]: Function } = {
    'GET': validateKeyAction,
    'DELETE': validateKeyAction,
    'POST': validateKeyActionWithBody,
    'PUT': validateKeyActionWithBody,
    'PATCH': validateKeyActionWithBody
  }
    const keyValidationAction = keyValidationMap[req.method]
    await keyValidationAction()

    } catch (err) {
      console.log(err)
      res.json({ message: `${err}` })
  }

}
