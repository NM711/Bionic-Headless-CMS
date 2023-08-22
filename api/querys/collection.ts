import { client } from "./client"
import { queryHandler } from "./handler"
import type { Workspace, Content } from "../../types/interfaces/workspace"

export async function createCollection ({ id, collections }: Workspace) {
  const { error } = await queryHandler("Failed to create collection!", async () => {
    if (Array.isArray(collections)) throw new Error("Expected only a single collection, if collection is in array please switch it for a type of object!")
    await client.collection.create({
      data: {
        workspace: {
          connect: {
            id
          }
        },
        content: {
          create: {

          }
        },
        // @ts-ignore
        name: collections.name
      }
    })
  })

  if (error) throw error
}

async function updateCollectionContent({ id, collections }: Workspace, data: Object) {
  const { error } = await queryHandler("Failed to update collection!", async () => {
    if (Array.isArray(collections)) throw new Error("Expected only a single collection, if collection is in array please switch it for a type of object!")
    
    await client.collection.update({
      where: {
        // @ts-ignore
        id: collections.id,
        workspace_id: id
      },
      data: {
        content: {
          update: data
        }
      }
    })
  })

  if (error) throw error
}

export async function updateAllContent({ id, collections }: Workspace, { headers, textareas, images }: Content) {
  const { error, returned } = await queryHandler('There has been an error attempting to update all of the content fields!', async () => {
    await updateCollectionContent({ id, collections }, {
      headers: {
        createMany: {
          data: headers!.map(text => { text })
        }
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
    })

    return "Successfully updated all content"
  })

  if (error) throw error

  return returned
}

export async function updateHeaders ({ id, collections }: Workspace, { headers }: Content) {
  const { error, returned } = await queryHandler('Failed to update headers!', async () => {
    await updateCollectionContent({ id, collections }, {
      headers: {
        createMany: {
          data: headers!.map(text => ({ text }))
        }
      }
    })

    return 'Updated Headers!'
  })

  if (error) throw error

  return returned
}

export async function updateTextareas ({ id, collections }: Workspace, { textareas }: Content) {
  const { error, returned } = await queryHandler('Failed to update headers!', async () => {
    await updateCollectionContent({ id, collections }, {
      textareas: {
        createMany: {
          data: textareas!.map(text => ({ text }))
        }
      }
    })

    return 'Updated Textareas'
  })

  if (error) throw error

  return returned
}

export async function updateImages ({ id, collections }: Workspace, { images }: Content) {
  const { error, returned } = await queryHandler('Failed to update headers!', async () => {
    await updateCollectionContent({ id, collections }, {
      images: {
        createMany: {
          data: images!.map(url => ({ url }))
        }
      }
    })

    return 'Updated Images'
  })

  if (error) throw error
  
  return returned
}

export async function removeCollection (workspaceId: string, collectionId: string) {
  const { error, returned } = await queryHandler("Failed to remove workspace collection!", async () => {
    const workspaceCollection = await client.collection.delete({
      where: {
        // @ts-ignore
        id: collectionId,
        workspace_id: workspaceId
      },
      include: {
       workspace: {
         select: {
           name: true
         }
       }
      }
    })

    return `Successfully deleted collection from workspace ${workspaceCollection.workspace.name}`
  })

  if (error) throw error

  return returned
}