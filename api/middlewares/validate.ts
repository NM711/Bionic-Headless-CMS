import { getUserById } from '../querys/user'
import { getWorkspaceHash, retrieveKeyConstraint } from '../querys/workspace'
import bcrypt from 'bcrypt'
import * as jwt from 'express-jwt'
import 'dotenv/config'
import { isWorkspace } from '../../types/guards/workspace'
import { UnauthorizedError } from 'express-jwt'
import type { Request, Response, NextFunction } from 'express'
import type { Workspace } from '../../types/interfaces/workspace'

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
  algorithms: ['RS256', 'HS256']
})

export function jwtErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof UnauthorizedError && err.message === 'jwt expired') {
    console.log("Invalid JWT!")
    res.status(401).json({ error: "Token is invalid or is expired!" })
  } else {
    next(err)
  }
}

export async function attachCurrentUser (req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.token
  if (token) {
    try {
      const userId = await getUserById(token.data.id)
      if (userId) {
        req.user = userId
        return next()
      }
      return res.status(404).send({ error: 'User Not Found!' })
    } catch (err) {
      console.log(err)
      return res.status(500).send({ error: 'Internal Server Error' })
    }
  }
  return res.status(401).json({ error: 'Unauthorized' })

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
      if (req.path === "/create") return next()
      const key: any = req.query.key
      const workspace: Workspace = req.body.workspace
      if (!workspace) throw new Error('No workspace found in the body this field is required!')
      isWorkspace(workspace)
      if (!workspace.id) throw new Error('Workspace id field is missing!')
      const k = await retrieveKeyConstraint(workspace)
      if (!k?.key_constraint) return next()
      await compareIdAndHash(workspace.id, key)
  }

  async function validateKeyAction () {
    const key: any = req.query.key
    const id: any = req.query.id
    const k = await retrieveKeyConstraint({ id })
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

    } catch (err: any) {
      console.log(err.status)
      res.status(err.status).json(err)
  }

}
