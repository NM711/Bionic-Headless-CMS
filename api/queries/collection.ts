import { client } from "./client"
import { queryHandler } from "../error/handler"
import type { Workspace, Content } from "../../types/workspace"
import type { Image } from "../../types/workspace"

export async function createCollection ({ id, collections }: Workspace) {
  const { error } = await queryHandler({ message: "Failed to create collection!" }, async () => {
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
}

export async function addAllContent({ id, collections }: Workspace, { headers, textareas }: Content) {
  const { error, returned } = await queryHandler({ message: "There has been an error attempting to update all of the content fields!" }, async () => {
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
      }
    })

    return "Successfully updated all content"
  })

  if (error) throw error

  return returned
}

export async function addHeaders ({ id, collections }: Workspace, { headers }: Content) {
  const { error, returned } = await queryHandler({ message: "Failed to update headers!" }, async () => {
    await updateCollectionContent({ id, collections }, {
      headers: {
        createMany: {
          data: headers!.map(text => ({ text }))
        }
      }
    })

    return 'Created Headers!'
  })

  if (error) throw error

  return returned
}

export async function addTextareas ({ id, collections }: Workspace, { textareas }: Content) {
  const { error, returned } = await queryHandler({ message: "Failed to update textareas!" }, async () => {
    await updateCollectionContent({ id, collections }, {
      textareas: {
        createMany: {
          data: textareas!.map(text => ({ text }))
        }
      }
    })

    return 'Created Textareas!'
  })

  if (error) throw error

  return returned
}

export async function addImage ({ id, collections }: Workspace, { byte }: Image) {
  const { error, returned } = await queryHandler({ message: "Failed to update image!" }, async () => {
    await updateCollectionContent({ id, collections }, {
      images: {
        create: {
          byte
        }
      }
    })

    return 'Created Image!'
  })

  if (error) throw error
  
  return returned
}


export async function removeImage ({ id, collections }: Workspace, imageId: string) {
  const { error, returned } = await queryHandler({ message: "Failed to remove image!" }, async () => {
    await updateCollectionContent({ id, collections }, {
      images: {
        delete: {
          id: imageId
        }
      }
    })
    return 'Removed Image!'
  })

  if (error) throw error
  
  return returned
}

export async function removeCollection (workspaceId: string, collectionId: string) {
  const { error, returned } = await queryHandler({ message: "Failed to remove workspace collection!" }, async () => {
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

export async function retrieveCollection (workspaceId: string, collectionId: string) {
  const { error, returned } = await queryHandler({ message: "Failed to retrieve collection!" }, async () => {
    return await client.collection.findUniqueOrThrow({
      where: {
        id: collectionId,
        workspace_id: workspaceId
      },

      include: {
        content: {
          include: {
            headers: true,
            textareas: true,
            images: true
          }
        }
      }
    })
  })

  if (error) throw error

  return returned
}