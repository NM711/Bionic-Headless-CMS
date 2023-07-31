export async function queryHandler (message: string, func: any) {
  const error = new Error(message)
  try {
    const returned = await func()
    return { error: null, returned }
  } catch (e) {
    console.log(`Query Handler Error: ${e}`)

    return { error, returned: null }
  }
}
