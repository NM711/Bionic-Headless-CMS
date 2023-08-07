import { isType } from "./fnUtils"
import { Workspace } from "../interfaces/workspace"

export function isWorkspace (t: any): t is Workspace {
   const keys = ['id', 'name', 'content', 'content_operation', 'content_type', 'key_constraint']
   const types = ['string', 'string', 'object', 'string', 'string', 'boolean']
   return isType (t, keys, types, 'Workspace')
}
