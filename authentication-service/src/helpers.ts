export const removeUndefined = (obj: any) =>
  Object.entries(obj)
    .filter(([_, v]) => v !== undefined)
    .reduce((newObj, [k, v]) => Object.assign(newObj, { [k]: v }), {});
