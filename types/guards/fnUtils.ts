function validateInterfaceType <T> (t: any, keys: (keyof T)[], types: string[], typeName: string): t is T {
 const doesExist = keys.every((k) => k in t)

 if (!doesExist) throw new Error(`Missing fields on type ${typeName}`)

 const areTypes = keys.every((key, i) => typeof(t[key]) === types[i])

 if (!areTypes) throw new Error(`Fields have incorrect types on ${typeName}!`)

 const unwatedKeys = Object.keys(t).filter((k) => !keys.includes(k as keyof T))
 
 if (unwatedKeys.length > 0) throw new Error(`Unwanted fields found on type ${typeName}`)

 return true
}

export function isType <T> (t: any, keys: (keyof T)[], types: string[], typeName: string): t is T {
  try {
    const isTrue = validateInterfaceType(t, keys, types, typeName)
    return isTrue
  } catch (e) {
    throw e
  }
}
