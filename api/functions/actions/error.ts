export const prismaErrorMap: { [code: string]:  { message: string, statusCode: number } } = {
  "P2001": { message: "Record does not exist!", statusCode: 404 },
  "P2002": { message: "Unique constraint failed, it is possible that record already exists!", statusCode: 500 },
  "P2004": { message: "Constraint failed!", statusCode: 500 },
  "P2015": { message: "Related record does not exist!", statusCode: 404 },
  "P2017": { message: "One or more records are not related!", statusCode: 400 },
  "P2023": { message: "There seems to be data with an invalid length amount!", statusCode: 400 },
  "P2025": { message: "Record does not exist!", statusCode: 404 }
}
