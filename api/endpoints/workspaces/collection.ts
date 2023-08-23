import express from 'express'
import { isWorkspace, isCollection } from '../../../types/guards/workspace'
import { createCollection, removeCollection, retrieveCollection } from '../../querys/collection'
import { updateCollectionActionMap } from '../../functions/actions/collection'

import type { Workspace } from '../../../types/workspace'

export const router = express.Router()

router.post('/collection/create', async (req, res) => {
  try {
    const workspace: Workspace = req.body.workspace
    isWorkspace(workspace)
    isCollection(workspace.collections)
    await createCollection(workspace)
    res.json({ message: 'Successfully created collection!!'})
  }  catch (err: any) {
     res.status(err.status).json(err)
  }
})

router.put("/collection/update", async (req, res) => {
  try {
    const workspace: Workspace = req.body.workspace
    const collection = workspace.collections
    isWorkspace(workspace)
    isCollection(collection)

    if (Array.isArray(collection)) throw new Error("Expected only a single collection!")
    // @ts-ignore
    const updateCollectionAction = updateCollectionActionMap[collection.operation]
    const { message } = await updateCollectionAction(collection?.content_type, workspace)
    res.json(message)
  } catch (err: any) {
    res.status(err.status).json(err)
  }
})

router.delete("/collection/delete", async (req, res) => {
  try {
    const workspaceId = req.query.id as string
    const collectionId = req.query.cid as string

    const message = await removeCollection(workspaceId, collectionId)
    console.log(message)
    res.json({ message })
  } catch (err: any) {
    res.status(err.status).json(err)
  }
})

router.get("/collection/retrieve", async (req, res) => {
  try {
    const workspaceId = req.query.id as string
    const collectionId = req.query.cid as string
    const collection = await retrieveCollection(workspaceId, collectionId)

    return collection
  } catch (err: any) {
    res.status(err.status).json(err)
  }
})