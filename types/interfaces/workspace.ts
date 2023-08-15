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
  url: string
  // maybe add byte data later idk
}

export interface Content {
  id?: string
  headers?: Header[]
  textareas?: Textarea[]
  images?: Image[]
}

export interface Workspace {
  id?: string
  name?: string
  key_constraint?: boolean
  content?: Content
  content_type?: string
  operation?: "update/add" | "remove" | "add-user" | "remove-user" | "change-user-role"
}
