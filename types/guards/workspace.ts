import { isType } from "./fnUtils"
import type { Workspace, Content, Collection } from "../interfaces/workspace"
import type { User } from "../interfaces/user"

export function isWorkspace (t: any): t is Workspace {
   const keys = ['id', 'name', 'collections', 'operation', 'key_constraint']
   const types = ['string', 'string', 'object', 'string', 'boolean']
   return isType (t, keys, types, 'Workspace', () => {
     if (
         t.operation !== "add-user"
         && t.operation !== "remove-user"
         && t.operation !== "change-user-role"
         && t.operation !== "none"
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

export function isCollection (t: any): t is Collection {
  const keys = ["id", "name", "content_type", "operation", "content"]
  const types = ["string", "string", "string", "string", "object"]
  return isType(t, keys, types, 'Collection')
}