import { Prisma } from "@prisma/client"

// move to seperate module or folder named errors, seperate error types in types folder under errors, etc.

class QueryHandlerError extends Error {
  statusCode: number
  name: string
  constructor ({ message, statusCode }: IApiErrorHandler) {
    super(message)
    this.name = "QueryHandlerError"
    this.statusCode = statusCode || 500
  }
}

// i decided to not extend Error since i was getting an odd warning about the "name" property of the object type

interface IApiErrorHandler {
  statusCode?: number
  message: string
}

export const errorObj = ({ message, statusCode = 500 }: IApiErrorHandler): { error: { error: string, status: number }, returned: any } => {
  return { error: { error: message, status: statusCode }, returned: null }
}

export async function queryHandler ({ message, statusCode = 500 }: IApiErrorHandler, func: any) {
  const error = new QueryHandlerError({ message, statusCode })
  try {
    const returned = await func()
    return { error: null, returned }
  } catch (e) {

    if (e instanceof Prisma.PrismaClientKnownRequestError) {

      console.log(`PRISMA ERROR CODE: ${e.code}`)
      switch (e.code) {
        // some basic errors which im certain might appear
        case 'P2001':
        return errorObj({ message: "Record does not exist!", statusCode: 404 })
        case 'P2002':
        return errorObj({ message: "Unique constraint failed, it is possible that record already exists!", statusCode: 500 })
        case 'P2004':
        return errorObj({ message: "Constraint failed!", statusCode: 500 })
        case 'P2015':
        return errorObj({ message: "Related record does not exist!", statusCode: 404 })
        case 'P2025':
        return errorObj({ message: "Record does not exist", statusCode: 404 })
      }
    }
    console.log(`Query Handler Error: ${e}`)
    return errorObj({ message: error.message, statusCode: error.statusCode })
  }
}