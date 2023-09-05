import { getUserById } from '../queries/user'
import { getWorkspaceHash, retrieveKeyConstraint } from '../queries/workspace'
import bcrypt from 'bcrypt'
import * as jwt from 'express-jwt'
import 'dotenv/config'
import { isWorkspace } from '../../types/guards/workspace'
import { UnauthorizedError } from 'express-jwt'
import type { Request, Response, NextFunction } from 'express'
import type { Workspace } from '../../types/workspace'

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
  

  // I believe there might be a great fundamental flaw in this, and its the fact that
  // we are not verifying wether or not a workspace exists with this id
  // we can retrieve the constraint but shouldnt we be checking if the workspace exists first and foremost?

  // Me 20min later followup
  // I think im good, since now that i realize all the queries to a specifc workspace are handled on the endpoint level 
  // at the end of the day these queries will tel wether or not these exist
  // im deprived of fucking sleep
  // anyways i still think we should error handle here and check for the workspace record
  // anyways off to sleep
  
  async function validateKeyActionWithBody () {
      if (req.path === "/create") return next()

      if (req.path === "/collection/image/add") {
        // this specific endpoint asks for form data so ill just pass the workspace id in a query instead.
        return await validateKeyAction()
      } 

      console.log(req.body.workspace)
      const key: any = req.query.key
      const workspace: Workspace = req.body.workspace
      isWorkspace(workspace)
      const k = await retrieveKeyConstraint(workspace)
      if (!k?.key_constraint) return next()
      // @ts-ignore
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
