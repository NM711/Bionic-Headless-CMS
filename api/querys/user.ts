import { client } from "./client";

export async function createUser (username: string, password: string) {
  await client.authUser.create({
      data: {
        username,
        password
      }
    })
  if (!username || !password) throw new Error("A field returned a falsy value!")
  console.log(`User ${username} Created!`)
}

async function getUserByUniqueConstrant (constraint: any) {
  const user = await client.authUser.findUnique({
    where: constraint,
    select: {
      username: true,
      password: true,
      id: true,
    }
  })

  if (!user) throw new Error("No Users Found!")

  return { user }
}

export const getUserByUsername = async (username: string) => await getUserByUniqueConstrant({ username }) 
export const getUserById = async (id: string) => await getUserByUniqueConstrant({ id })

export async function removeUser (id: string) {
  await client.authUser.delete({
    where: {
      id
    }
  })
  console.log(`User With Id Of ${id} Removed!`)
}
