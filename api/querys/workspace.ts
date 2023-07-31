import { promisify } from 'util'
import { client } from "./client";
import { queryHandler } from './handler';
import { Workspace, Content } from '../../types/interfaces/workspace';
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
                content: {
                  create: {

                  }
                }
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
        workspace_content: {
          include: {
            content: {
              include: {
                headers: true,
                textareas: true,
                images: true
              }
            }
          }
        },
        user_workspace: true,
      }
    })
      return workspace
  })

  if (error) throw error

  return returned
}

async function updateWorkspaceContent({ id }: Workspace, dataObj: Object) {
  await client.workspace_Content.update({
    where: {
      workspace_id: id
    },
    data: dataObj
  })
}

export async function updateAllContent({ id }: Workspace, { headers, textareas, images }: Content) {
  const { error } = await queryHandler('There has been an error attempting to update all of the content fields!', async () => {
    await updateWorkspaceContent({ id }, {
      content: {
        update: {
          headers: {
            createMany: {
              data: headers!.map(text => ({ text }))
            },
          },
          textareas: {
            createMany: {
              data: textareas!.map(text => ({ text }))
            }
          },
          images: {
            createMany: {
              data: images!.map(url => ({ url }))
            },
          },
        },
      }
    })
  })

  if (error) throw error
}

async function createOneContentType({ id }: Workspace, propQuery: any, contentType: string) {
  await updateWorkspaceContent({ id }, {
    content: {
      update: propQuery
    }
  })

  console.log(`Created ${contentType}`)
}
// add conditionals within to validate arr, or do it in the higher order function
export async function updateHeaders ({ id }: Workspace, { headers }: Content) {
  await queryHandler('Failed to update headers!', async () => {
    await createOneContentType({ id }, {
      headers: {
        createMany: {
          data: headers!.map(text => ({ text }))
        }
      }
    }, 'Headers')
  })
}

export async function updateTextareas ({ id }: Workspace, { textareas }: Content) {
  await queryHandler('Failed to update headers!', async () => {
    await createOneContentType({ id }, {
      textareas: {
        createMany: {
          data: textareas!.map(text => ({ text }))
        }
      }
    }, 'Textareas')
  })
}

export async function updateImages ({ id }: Workspace, { images }: Content) {
  await queryHandler('Failed to update headers!', async () => {
    await createOneContentType({ id }, {
      images: {
        createMany: {
          data: images!.map(url => ({ url }))
        }
      }
    }, 'Images')
  })
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
