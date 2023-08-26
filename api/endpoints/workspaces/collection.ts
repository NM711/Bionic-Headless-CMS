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

router.post("/collection/media/add", update.single("image"), async (req, res) => {
  try {   
    const { id, cid } = req.query as { id: string, cid: string }
    const byteData = req.file!.buffer
    const name = req.body.name as string
    // for now error handle later
    const message = await addImage({ id, collections: { id: cid, } }, { byte: byteData, name })
    res.json({ message })
  } catch (err: any) {
    res.status(err.status).json(err)
  }
 })


 /* On this specific endpoint /collection/media/delete
    you might run into the following error "One or more records are not related!" you can ignore it
    this error is due to prisma error P2017 which can occur when a required relation is removed from a table in this case it will throw
    a relation error between Collection and Media. You can read more about this on the official prisma documentation
    https://www.prisma.io/docs/concepts/components/prisma-client/crud#delete-a-single-record I plan to fix this soon but there is no major
    impact on the application itself so im focusing on other stuff for the time being.
 */

 router.delete("/collection/media/delete", async (req, res) => {
   try {
     const { id, cid, mid } = req.query as { id: string, cid: string, mid: string }
     const message = await removeImage({ id, collections: { id: cid } }, mid)
     res.json({ message })
   } catch (err: any) {
     res.status(err.status).json(err)
   }
 })

 router.get("/collection/image", async (req, res) => {
  try {
    const { id, cid, mid } = req.query as { id: string, cid: string, mid: string }
    
  } catch (err: any) {
    res.status(err.status).json(err)
  }
 })