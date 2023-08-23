import { Prisma } from "@prisma/client"

import type { IApiErrorHandler } from "../../types/error"
// move to seperate module or folder named errors, seperate error types in types folder under errors, etc.

export const errorObj = ({ message, statusCode = 500 }: IApiErrorHandler): { error: { error: string, status: number }, returned: any } => {
  return { error: { error: message, status: statusCode }, returned: null }
}

export async function queryHandler ({ message, statusCode = 500 }: IApiErrorHandler, func: any) {
  try {
    const returned = await func()
    return { error: null, returned }
  } catch (e) {

    if (e instanceof Prisma.PrismaClientKnownRequestError) {

      console.log(`PRISMA ERROR CODE: ${e.code}`)
      //  create a map of errors maybe?
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
        case 'P2023':
        return errorObj({ message: "There seems to be data with an invalid length amount!", statusCode: 400 })
        case 'P2025':
        return errorObj({ message: "Record does not exist!", statusCode: 404 })
      }
    }
    console.log(`Query Handler Error: ${e}`)
    return errorObj({ message, statusCode })
  }
}

export function typeGuardHandler (fn: Function) {
  try {
    fn()
    return { error: null }
  } catch (err: any) {
    return errorObj({ message: err.message, statusCode: 400 })
  }
}