import { Prisma } from "@prisma/client"
import { prismaErrorMap } from "../functions/actions/error"
import type { ApiErrorReturn, IApiErrorHandler } from "../../types/error"
// move to seperate module or folder named errors, seperate error types in types folder under errors, etc.

export const errorObj = ({ message, statusCode = 500 }: IApiErrorHandler): ApiErrorReturn => {
  return { error: { error: message, status: statusCode }, returned: null }
}

export async function queryHandler ({ message, statusCode = 500 }: IApiErrorHandler, func: any) {
  try {
    const returned = await func()
    return { error: null, returned }
  } catch (e) {

    if (e instanceof Prisma.PrismaClientKnownRequestError) {

      console.log(`PRISMA ERROR CODE: ${e.code}`)
      const prismaError = prismaErrorMap[e.code]
      return errorObj({ message: prismaError.message, statusCode: prismaError.statusCode })
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