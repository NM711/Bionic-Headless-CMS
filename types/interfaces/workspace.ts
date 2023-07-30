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

export interface Workspace {
  id?: string
  name?: string
  headers?: Header[]
  textareas?: Textarea[]
  images?: Image[]
}
