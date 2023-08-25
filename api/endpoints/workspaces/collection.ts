import express from 'express'
import multer from 'multer'
import { isWorkspace, isCollection } from '../../../types/guards/workspace'
import { createCollection, removeCollection, retrieveCollection, addImage, removeImage } from '../../queries/collection'
import { updateCollectionContentActionMap } from '../../functions/actions/collection/content'

import type { Workspace } from '../../../types/workspace'

export const router = express.Router()

const update = multer()

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
    const updateCollectionAction = updateCollectionContentActionMap[collection.operation]
    const { message } = await updateCollectionAction(collection?.content_type, workspace)
    res.json(message)
  } catch (err: any) {
    res.status(err.status).json(err)
  }
})

router.delete("/collection/delete", async (req, res) => {
  try {
    const { id, cid } = req.query as { id: string, cid: string }

    const message = await removeCollection(id, cid)
    console.log(message)
    res.json({ message })
  } catch (err: any) {
    res.status(err.status).json(err)
  }
})

router.get("/collection/retrieve", async (req, res) => {
  try {
    const { id, cid } = req.query as { id: string, cid: string }
    const collection = await retrieveCollection(id, cid)

    return res.json(collection)
  } catch (err: any) {
    res.status(err.status).json(err)
  }
})

// IMAGES part of the collection

router.post("/collection/image/add", update.single("image"), async (req, res) => {
  try {   
    const { id, cid } = req.query as { id: string, cid: string }
    const byteData = req.file!.buffer
    // for now error handle later
    const message = await addImage({ id, collections: { id: cid } }, { byte: byteData })
    res.json({ message })
  } catch (err: any) {
    res.status(err.status).json(err)
  }
 })

 router.delete("/collection/image/delete", async (req, res) => {
   try {
     const { id, cid, imgid } = req.query as { id: string, cid: string, imgid: string }
     const message = await removeImage({ id, collections: { id: cid } }, imgid)
     res.json({ message })
   } catch (err: any) {
     res.status(err.status).json(err)
   }
 })

 router.get("/collection/image", async (req, res) => {
  try {
    const { id, cid, imgid } = req.query as { id: string, cid: string, imgid: string }
    
  } catch (err: any) {
    res.status(err.status).json(err)
  }
 })