import { Prisma } from "@prisma/client"
import { prismaErrorMap } from "../functions/actions/error"
import { ApiHandlerError, type ApiErrorReturn, type IApiErrorHandler } from "../../types/error"
// move to seperate module or folder named errors, seperate error types in types folder under errors, etc.

export const errorObj = ({ message, statusCode = 500 }: IApiErrorHandler): ApiErrorReturn => {
  return { error: { error: message, status: statusCode }, returned: null }
}

export async function queryHandler ({ message, statusCode = 500 }: IApiErrorHandler, fn: Function) {
  try {
    const returned = await fn()
    return { error: null, returned }
  } catch (e) {

    if (e instanceof Prisma.PrismaClientKnownRequestError) {

      console.log(`PRISMA ERROR CODE: ${e.code}`)
      console.log(e.meta)
      const prismaError = prismaErrorMap[e.code]
      return errorObj({ message: prismaError.message, statusCode: prismaError.statusCode })
    }
    
    if (e instanceof ApiHandlerError) {
      return errorObj({ message: e.message, statusCode: e.statusCode })
    }
    console.log(e)
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