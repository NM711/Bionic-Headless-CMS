
// make a interface for the validator type the params are getting long
function validateInterfaceType <T> (t: any, keys: (keyof T)[], types: string[], typeName: string, fn?: Function): t is T {
 const doesExist = keys.every((k) => k in t)

 if (!doesExist) throw new Error(`Missing fields on type ${typeName}`)

 const areTypes = keys.every((key, i) => typeof(t[key]) === types[i])

 if (!areTypes) throw new Error(`Fields have incorrect types on ${typeName}!`)

 const unwatedKeys = Object.keys(t).filter((k) => !keys.includes(k as keyof T))
 
 if (unwatedKeys.length > 0) throw new Error(`Unwanted fields found on type ${typeName}`)
 if (fn) {
   fn()
 }
 return true
}

export function isType <T> (t: any, keys: (keyof T)[], types: string[], typeName: string, fn?: Function): t is T {
  try {
    const isTrue = validateInterfaceType(t, keys, types, typeName, fn)
    return isTrue
  } catch (e) {
    throw e
  }
}
