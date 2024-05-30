import { identity } from '@coloration/kit'
export const groupArrayBy = (
  option, 
  data
) => {
  const opt = Object.assign({ 
    nameField: 'name', 
    valueField: 'value',
    valueFormatter: identity
  }, option)

  

  const groupData = data.reduce((g, d) => {
    const field = d[opt.field]
    const array = g[field] || []
    array.push(d)
    g[field] = array

    return g
  }, {})

  
  const arrayData = Object.keys(groupData).map(k => {
    return {
      [opt.nameField]: k === 'undefined' ? undefined : k,
      [opt.valueField]: groupData[k].map(opt.valueFormatter)
    }
  })

  return arrayData
}