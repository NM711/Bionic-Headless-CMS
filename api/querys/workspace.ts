import { promisify } from 'util'
import { client } from "./client";
import { queryHandler } from './handler';
import { Workspace } from '../../types/interfaces/workspace';
import { User } from '../../types/interfaces/user';
import uuid4 from "uuid4";
import bcrypt from 'bcrypt'

export async function createWorkspace({ id }: User, { name }: Workspace) {

  if (name === undefined || name.length === 0) throw new Error("Workspace name is required!");
  if (id === undefined || id.length === 0) throw new Error('User id is required!')
  const { error, returned } = await queryHandler('Error On Workspace Creation!', async () => {
    const key = `${uuid4()}:${name.replace(/\s+/g, '-').toLowerCase()}`
    const asyncHash = promisify(bcrypt.hash)
    const hash = await asyncHash(key, 12)
    console.log("Created Workspace")
    await client.user_Workspace.create({
      data: {
        user: {
          connect: {
            id
          },
        },
        workspace: {
          create: {
            name,
            key: hash,
            workspace_content: {
              create: {
              }
            }
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

// to add a extra layer of security we will implement a function that returns a single id
// and another that returns everything related to the workspace

// NOTE WORKSPACE IS RETURNING NULL BECAUSE PRISMA IS TRYING TO QUERY WITH A TYPE OF STRING AND NOT UUID
// THIS COULD EXPLAIN MANY ISSUES BUT I AM NOT ENTIRELY SURE, FOR NOW I WILL CALL IT A NIGHT BUT IN THE MORNING
// WE WILL FIX.

export async function getWorkspaceHash({ id }: Workspace) {
  const { error, returned } = await queryHandler('Error Getting Workspace Hash', async () => {
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
  const { error, returned } = await queryHandler('Error getting workspace!', async () => {
    const workspace = await client.workspace.findUnique({
      where: {
        id
      },
      include: {
        workspace_content: {  include: { content: true }},
        user_workspace: true,
      }
    })
      return workspace
  })

  if (error) throw error

  return returned
}

async function updateWorkspaceContent(workspaceId: string, dataObj: any) {
  await client.workspace_Content.update({
    where: {
      workspace_id: workspaceId
    },
    data: dataObj
  })
}

export async function updateAllContent(workspaceId: string, headers: string[], textareas: string[], images: string[]) {
  try {
    await updateWorkspaceContent(workspaceId, {
      content: {
        update: {
          headers: {
            createMany: {
              data: headers.map(text => ({ text }))
            },
          },
          textareas: {
            createMany: {
              data: textareas.map(text => ({ text }))
            }
          },
          images: {
            createMany: {
              data: images.map(url => ({ url }))
            },
          },
        },
      }
    })
  } catch (err) {
      console.log(err)
      throw new Error('Something Went Wrong On Content Creation/Update!')
  }

}

async function createOneContentType(workspaceId: string, propQuery: any, type: string) {
  await updateWorkspaceContent(workspaceId, {
    content: {
      update: propQuery
    }
  })

  console.log(`Created ${type}`)
}
// add conditionals within to validate arr, or do it in the higher order function
export async function updateHeaders(workspaceId: string, headers: string[]) {
  await createOneContentType(workspaceId, {
    headers: {
      createMany: {
        data: headers.map(text => ({ text }))
      }
    }
  }, 'Headers')
}

export async function updateTextareas(workspaceId: string, textareas: string[]) {
  await createOneContentType(workspaceId, {
    textareas: {
      createMany: {
        data: textareas.map(text => ({ text }))
      }
    }
  }, 'Textareas')
}

export async function updateImages(workspaceId: string, images: string[]) {
  await createOneContentType(workspaceId, {
    images: {
      createMany: {
        data: images.map(url => ({ url }))
      }
    }
  }, 'Images')
}

export async function getAllUserWorkspaces(userId: string) {
  const workspaces = await client.user_Workspace.findMany({
    where: {
      user_id: userId
    },
    include: {
      workspace: {
        include: {
          workspace_content: {
            include: {
              content: {
                include: {
                  headers: true,
                  textareas: true,
                  images: true,
                }
              }
            }
          }
        }
      }
    }
  })

  return workspaces
}
