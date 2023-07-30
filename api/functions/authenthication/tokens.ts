import jwt from 'jsonwebtoken'
import 'dotenv/config'

export function generateJWT(user: any) {
  const data = {
    id: user.id,
    username: user.username
  }

  const signature: any = process.env.JWT_SECRET
  return jwt.sign({ data }, signature, { expiresIn: '1hr' })
}
