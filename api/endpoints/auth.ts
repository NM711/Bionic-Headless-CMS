import bcrypt from 'bcrypt'
import { createUser, getUserByUsername, removeUser } from '../querys/user'
import { generateJWT } from '../functions/authenthication/tokens'
import express from 'express'
import { AuthenticatedRequest, isAuth, attachCurrentUser } from '../middlewares/validate'
export const router = express.Router()

// we need to also validate the user session so that if the user is logged in
// and has an active session then he cant navigate to the auth pages except the
// delete account page and the logout from account page

router.post("/sign-up", async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  bcrypt.hash(password, 12, async (err, hash) => {
    try {
      // this way i can catch the bcrypt err
      if (err) throw new Error(err.message)
      await createUser(username, hash)
      res.redirect(200, "/sign-in")
    } catch (err) {
      console.log("Error When Creating User!", err)
      res.send("Error On User Creation!")
    }
  })
})


router.post('/sign-in', async (req: AuthenticatedRequest, res) => {
  try {
    console.log(req.token)
    const { user } = await getUserByUsername(req.body.username)
    if (user) {
      const isValid: boolean = bcrypt.compareSync(req.body.password, user.password)

      if (isValid) {
        // generate a jwt
        res.json({ token: generateJWT(user) })
      } else throw new Error
    }
  } catch (err) {
      console.log(err)
      res.send(`Somethin Went Wrong Check Your Credentials and Try Again!`)
  }
})

router.post('/sign-out', isAuth, attachCurrentUser, async (req: AuthenticatedRequest, res) => {
  try {
    delete req.headers.authorization
    console.log(`Authorization Request Header Removed!`)
    res.redirect('/sign-in')
  } catch (err) {
    console.log(err)
    res.send(`Error on sign-out!`)
  }
})

router.post('/delete', isAuth, attachCurrentUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { data } = req.token
    await removeUser(data.id)
    res.status(200).redirect('/sign-up')
  } catch (err) {
      console.log(err)
      res.send(`Error Removing Account!`)
  }
})
// Allow user to change account information when session is active, or when he is logged in.
