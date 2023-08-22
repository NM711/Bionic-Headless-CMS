// workspace sub content

export interface Header {
  id?: string,
  name: string
}

export interface Textarea {
  id?: string
  content: string
}

export interface Image {
  id?: string
  byte: BinaryType
  // maybe add byte data later idk
}

export interface Content {
  id?: string
  headers?: Header[]
  textareas?: Textarea[]
  images?: Image[]
}

export type CollectionOperation = "update" | "add" | "remove" | "none"
export type WorkspaceOperation = "add-user" | "remove-user" | "change-user-role" | "none"

export interface Collection {
  id?: string
  name?: string
  content_type?: string
  content?: Content
  operation?: CollectionOperation
}

export interface Workspace {
  id?: string
  name?: string
  key_constraint?: boolean
  collections?: Collection[] | Collection
  operation?: WorkspaceOperation
}