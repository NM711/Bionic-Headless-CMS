import { promisify } from 'util'
import { client } from "./client";
import { queryHandler } from './handler';
import type { Workspace, Content, Image } from '../../types/interfaces/workspace';
import uuid4 from "uuid4";
import bcrypt from 'bcrypt'

export async function createWorkspace(userId: string, { name, key_constraint }: Workspace) {
  if (name === undefined || name.length === 0) throw new Error("Workspace name is required!")
  if (userId === undefined || userId.length === 0) throw new Error('User id is required!')

  const { error, returned } = await queryHandler({ message: "Error On Workspace Creation!" }, async () => {
    if (!key_constraint) {
      await client.user_Workspace.create({
        data: {
          user: {
            connect: {
              id: userId
            },
          },
          role: {
            connect: {
              name: "OWNER"
            }
          },
        workspace: {
          create: {
            name,
            key_constraint
            }
          }
        }
      })
      console.log('Workspace with no key constraint created!')
      return null
    }
    const key = `${uuid4()}:${name.replace(/\s+/g, '-').toLowerCase()}`
    const asyncHash = promisify(bcrypt.hash)
    const hash = await asyncHash(key, 12)
    await client.user_Workspace.create({
      data: {
        user: {
          connect: {
            id: userId
          },
        },
        role: {
          connect: {
            name: "OWNER"
          },
        },
        workspace: {
          create: {
            name,
            key_constraint,
            key: hash
          }
        }
      }
    })
    console.log(`Workspace Key Is ${key} Make Sure You Save It!`)
    return key
  })
  if (error) throw error
  return returned
}


export async function retrieveKeyConstraint ({ id }: Workspace) {
  const { error, returned } = await queryHandler({ message: "Could not retrieve key constraint field!" }, async () => {
   const keyConstraint = await client.workspace.findUnique({
     where: {
       id
     },
     select: {
       key_constraint: true
     }
   })
   return keyConstraint
  })

  if (error) throw error

  return returned
}

export async function getWorkspaceHash({ id }: Workspace) {
  const { error, returned } = await queryHandler({ message: "Error Getting Workspace Hash" }, async () => {
    const hash =  await client.workspace.findUnique({
        where: {
          id
        },
        select: {
          key: true
        }
      })
      return hash
    })

    if (error) throw error

    return returned
  }

export async function getWorkspace({ id }: Workspace) {
  const { error, returned } = await queryHandler({ message: "Error getting workspace!" }, async () => {
    const workspace = await client.workspace.findUnique({
      where: {
        id
      },
      include: {
        collection: true,
        user_workspace: {
          include: {
            user: {
              select: {
                username: true,
              }
            },
          }
        },
      }
    })
      return workspace
  })

  if (error) throw error

  return returned
}
// add conditionals within to validate arr, or do it in the higher order function

export async function getAllUserWorkspaces (userId: string) {
  const { error, returned } = await queryHandler({ message: "Error retrieving all workspaces!" }, async () => {
    const workspaces = await client.user_Workspace.findMany({
      where: {
        user_id: userId
      },
      include: {
        workspace: {
          include: {
            collection: {
              include: {
                content: {
                  include: {
                    headers: true,
                    textareas: true,
                    images: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return workspaces
  })

  if (error) throw error

  return returned
}

export async function deleteWorkspace (id: string, userId: string) {
  const { error } = await queryHandler({ message: "Error deleting workspace" }, async () => {
    await client.user_Workspace.delete({
      where: {
        user_id_workspace_id: {
          user_id: userId,
          workspace_id: id,
        },
        role_name: "OWNER"
      },
    })

  await client.workspace.delete({
    where: {
      id
     },
    })
  })

  if (error) throw error

  console.log(`Workspace ${id} removed!`)
}
