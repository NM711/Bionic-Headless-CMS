import { client } from "./client"
import { queryHandler } from "./handler"

import type { Workspace } from "../../types/interfaces/workspace"
import type { User } from "../../types/interfaces/user"

export async function createUser (username: string, password: string) {
  const { error } = await queryHandler({ message: "Error creating user!" }, async () => {
    await client.authUser.create({
      data: {
        username,
        password
      }
    })
    console.log(`User ${username} Created!`)
  })

  if (error) throw error
}

async function getUserByUniqueConstrant (constraint: any) {
  const { error, returned } = await queryHandler({ message: "Error retrieving user by constraint!" }, async () => {
    const user = await client.authUser.findUnique({
      where: constraint,
      select: {
        username: true,
        password: true,
        id: true,
      }
    })

    return user
  })

  if (error) throw error

  return returned
}

export const getUserByUsername = async (username: string) => await getUserByUniqueConstrant({ username }) 
export const getUserById = async (id: string) => await getUserByUniqueConstrant({ id })

export async function removeUser (id: string) {
  const { error } = await queryHandler({ message: "Error removing user!" }, async () => {
    await client.authUser.delete({
      where: {
        id
      }
    })
    console.log(`User With Id Of ${id} Removed!`)
  })

  if (error) throw error
}

export async function getAllUserData ({ id }: Workspace) {
  const { error, returned } = await queryHandler({ message: "Failed to retrieve user data!" }, async () => {
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
              creation_date: true,
              name: true,
              user_workspace: {
                select: {
                  user: {
                    select: {
                      username: true,
                    }
                  },
                  role_name: true
                },
              },
              key_constraint: true,
              collection: {
                select: {
                  id: true,
                  content: {
                    select: {
                     images: true,
                     textareas: true,
                     headers: true,
                    }
                  }
                }
              },
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

// types are getting checked through the custom type guards ive implemented on the higher order, so in some of these
// im forced to use ts ignore

export async function addUserToWorkspace ({ username }: User, workspace: Workspace) {
  const { error } = await queryHandler({ message: "Failed to add user to workspace!" }, async () => {
    // @ts-ignore
    const user = await getUserByUsername(username)
    await client.user_Workspace.create({
      // @ts-ignore
      data: {
        role_name: "COLLABORATOR",
        user_id: user.id,
        workspace_id: workspace.id
      }
    })
    console.log(`${username} added to Workspace ${workspace.id}`)
  })

  if (error) throw error
}

export async function removeUserFromWorkspace ({ username }: User, workspace: Workspace) {
  const { error } = await queryHandler({ message: "Failed to retrieve user data!" }, async () => {
    // @ts-ignore
    const user = await getUserByUsername(username)
    await client.user_Workspace.delete({
      where: {
        user_id_workspace_id: {
          user_id: user.id,
          // @ts-ignore
          workspace_id: workspace.id,
        },
      }
    })
  })

  if (error) throw error
}

export async function updateUserWorkspaceRole ({ username, role }: User, workspace: Workspace) {
  const { error } = await queryHandler({ message: "Failed to update user workspace role!" }, async () => {
    // @ts-ignore
    const user = await getUserByUsername(username)

    await client.user_Workspace.update({
      where: {
        user_id_workspace_id: {
          user_id: user.id,
          // @ts-ignore
          workspace_id: workspace.id
        }
      },
      data: {
        role_name: role
      },
    })
  })

  if (error) throw error
}
