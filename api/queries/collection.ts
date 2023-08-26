import { client } from "./client"
import { queryHandler } from "../error/handler"
import type { Workspace, Content, Media } from "../../types/workspace"

import { ApiHandlerError } from "../../types/error"

const expectedObjNotArrErr = new ApiHandlerError({ message: "Expected only a single collection, if collection is in array please switch it for a type of object!", statusCode: 400 })

export async function createCollection ({ id, collections }: Workspace) {
  const { error } = await queryHandler({ message: "Failed to create collection!" }, async () => {
    if (Array.isArray(collections)) throw expectedObjNotArrErr
    if (collections!.name!.length < 6) throw new ApiHandlerError({ message: "A collection name must be atleast 6 characters long!", statusCode: 400 })
    await client.collection.create({
      data: {
        workspace: {
          connect: {
            id
          }
        },
        media_collection: {
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
  if (Array.isArray(collections)) throw expectedObjNotArrErr
    
  await client.collection.update({
    where: {
      // @ts-ignore
      id: collections.id,
      workspace_id: id
    },
    data: data
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

    return 'Created textareas!'
  })

  if (error) throw error

  return returned
}

export async function addImage ({ id, collections }: Workspace, { byte, name }: Media) {
  const { error, returned } = await queryHandler({ message: "Failed to add media type!" }, async () => {
    if (!name) throw new ApiHandlerError({ message: "Missing name for media type", statusCode: 400 })
    const slug = name.replace(/\s+/g, '-').toLowerCase()
    await updateCollectionContent({ id, collections }, {
      media: {
        create: {
          byte,
          name,
          slug
        }
      }
    })
    return 'Added media type!'
  })

  if (error) throw error
  
  return returned
}


export async function removeImage ({ id, collections }: Workspace, mediaId: string) {
  const { error, returned } = await queryHandler({ message: "Failed to remove media type!" }, async () => {
    await updateCollectionContent({ id, collections }, {
      media: {
        delete: {
          id: mediaId
        }
      }
    })
    return 'Removed media type!'
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
        headers: true,
        textareas: true,
        media: true
      }
    })
  })

  if (error) throw error

  return returned
}