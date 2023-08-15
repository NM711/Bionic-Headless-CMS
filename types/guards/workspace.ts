import { isType } from "./fnUtils"
import { Workspace, Content } from "../interfaces/workspace"
import { User } from "../interfaces/user"

export function isWorkspace (t: any): t is Workspace {
   const keys = ['id', 'name', 'content', 'operation', 'content_type', 'key_constraint']
   const types = ['string', 'string', 'object', 'string', 'string', 'boolean']
   return isType (t, keys, types, 'Workspace', () => {
     if (
         t.operation !== "update/add"
         && t.operation !== "remove"
         && t.operation !== "add-user"
         && t.operation !== "remove-user"
         && t.operation !== "changed-user-role"
         && t.operation !== ""
     ) throw new Error("Content type on Workspace is missing fixed value!")
   })
}

export function isContent (t: any): t is Content {
  const keys = ["id", "headers", "textareas", "images"]
  const types = ["string", "object", "object", "object"]
  return isType(t, keys, types, 'Content')
}

export function isUser (t: any): t is User {
  const keys = ["id", "username", "email", "role"]
  const types = ["string", "string", "string", "string"]
  return isType(t, keys, types, 'User', () => {
    if (t.role !== "COLLABORATOR" && t.role !== "ADMIN" && t.role !== "OWNER" && t.role !== "") throw new Error("Role on user is missing fixed value!")
  })
}
