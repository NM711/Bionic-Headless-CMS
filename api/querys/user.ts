import { client } from "./client";
import { queryHandler } from "./handler";
import { Workspace } from "../../types/interfaces/workspace"
import {User} from "../../types/interfaces/user";
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

export async function getAllUserData ({ id }: Workspace) {
  const { error, returned } = await queryHandler('Failed to retrieve user data!', async () => {
    const user = await client.authUser.findUnique({
      where: {
        id
      },
      select: {
        username: true,
        user_workspace: {
          select: {
            user_id: true,
            workspace: {
              select: {
              id: true,
              name: true,
              user_workspace: true,
              content: true
              }
            }
          }
        }
      }
    })

    return user
  })

  if (error) throw error

  return returned
}

export async function addUserToWorkspace ({ username }: User, workspace: Workspace) {
  const { error, returned } = await queryHandler('Failed to add user to workspace!', async () => {
  // ignore for now
  // @ts-ignore
  const { user } = await getUserByUsername(username) as User
  // had to do this instead of a conditional guard cos the underline wouldnt go away...
  if (user.id && workspace.id) {
    await client.user_Workspace.create({
      data: {
        user_id: user.id,
        workspace_id: workspace.id
      }
    })
    console.log(`${username} added to Workspace ${workspace.id}`)
  } else throw new Error('Cant add user because fields are missing!')

  })

  if (error) throw error

  return returned
}
