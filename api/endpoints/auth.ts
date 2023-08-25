import bcrypt from 'bcrypt'
import express from 'express'
import { createUser, getAllUserData, getUserByUsername, removeUser } from '../queries/user'
import { generateJWT } from '../functions/authenthication/tokens'
import { AuthenticatedRequest, isAuth, attachCurrentUser, jwtErrorHandler } from '../middlewares/validate'
export const router = express.Router()

import type { Response } from 'express'

// we need to also validate the user session so that if the user is logged in
// and has an active session then he cant navigate to the auth pages except the
// delete account page and the logout from account page

router.post("/sign-up", async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  console.log(username, password)
  bcrypt.hash(password, 12, async (err, hash) => {
    try {
      // this way i can catch the bcrypt err
      if (err) throw new Error(err.message)
      await createUser(username, hash)
      res.json({ message: `Succesfully created user ${username}` })
    } catch (err: any) {
      console.log("Error When Creating User!", err)
      res.status(err.status).json(err)
    }
  })
})

router.post('/sign-in', async (req: AuthenticatedRequest, res) => {
  try {
    const user = await getUserByUsername(req.body.username)
    if (user) {
      const isValid: boolean = bcrypt.compareSync(req.body.password, user.password)

      if (isValid) {
        // generate a jwt
        console.log(`User id: ${user.id}, username: ${user.username} signed in! `)
        res.json({ token: generateJWT(user) })
      } else throw new Error
    }
  } catch (err) {
      console.log(err)
      res.status(400).json({ error: `Somethin Went Wrong Check Your Credentials and Try Again!` })
  }
})

router.get('/sign-out', isAuth, jwtErrorHandler, attachCurrentUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    delete req.headers.authorization
    console.log(`Authorization Request Header Removed!`)
    res.json({ message: "Succesfully signed out!" })
  } catch (err: any) {
    console.log(err)
    res.status(500).json({ error: "Error on sign-out!" })
  }
})
// it seems to run the middleware and not
router.delete('/delete', isAuth, jwtErrorHandler, attachCurrentUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data } = req.token
    await removeUser(data.id)
    res.json({ message: "User succesfully removed!" })
  } catch (err: any) {
      console.log(err)
      res.status(err.status).json({ error: "Error Removing Account!" })
  }
})

// Allow user to change account information when session is active, or when he is logged in.
router.get('/retrieve', isAuth, jwtErrorHandler, attachCurrentUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data } = req.token
    const id = data.id
    const user = await getAllUserData({ id })
    res.json(user)
  } catch (e: any) {
    console.log(e)
    res.status(e.status).json(e)
  }
})