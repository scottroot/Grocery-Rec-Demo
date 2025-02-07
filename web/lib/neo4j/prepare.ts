export function prepare(obj: {[p: string|number]: any}) {
  try {
    return Object.keys(obj).reduce((agg, curr) => {
      if("low" in Object.keys(obj[curr])) {
        return { ...agg, [curr]: obj[curr].low }
      }
      return { ...agg, [curr]: obj[curr] }
    }, {})
  } catch {
    console.log(JSON.stringify(obj));
    return obj
  }
}