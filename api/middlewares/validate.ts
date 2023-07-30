import { Request, Response, NextFunction } from 'express'
import { getUserById } from '../querys/user'
import { getWorkspaceHash } from '../querys/workspace'
import bcrypt from 'bcrypt'
import * as jwt from 'express-jwt'
import 'dotenv/config'
import { Workspace } from '../../types/interfaces/workspace'

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

  try {
    const key: string = req.query.key as string

    const keyValidationMap: { [key: string]: Function } = {
    'GET': async (key: string) => {
      const id: string = req.params.id
      await compareIdAndHash(id, key)
    },
    'POST': async (key: string) => {
      const { id }: Workspace = req.body.workspace
      if (!id) throw new Error('Project id field is missing!')
      await compareIdAndHash(id, key)
    }
  }
    const keyValidationAction = keyValidationMap[req.method]
    await keyValidationAction(key)

    } catch (err) {
      console.log(err)
      res.send('Error Validating Key!')
  }

}
