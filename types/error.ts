export class ApiHandlerError extends Error {
  statusCode: number
  name: string
  constructor ({ message, statusCode }: IApiErrorHandler) {
    super(message)
    this.name = "ApiHandlerError"
    this.statusCode = statusCode || 500
  }
}

// i decided to not extend Error since i was getting an odd warning about the "name" property of the object type

export interface IApiErrorHandler {
  statusCode?: number
  message: string
}

export type ApiErrorReturn = { error: { error: string, status: number }, returned: any }