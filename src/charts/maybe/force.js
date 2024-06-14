import _ from 'lodash'

const maxSize = 70
const minSize = 5

// 第二层技术人员引力图 option.serie[1]
export const generateForceSerie = (data) => {
  if (!data) return data
  const links = []

  const categories = _.keys(data).map(key => ({ name: key }))

  const serieData = _.map(data, (array, key) => {
    _.filter(array, target => target in data)
    .forEach(target => links.push({ source: key, target }))

    // 不开方太大了
    let val = Math.floor(Math.sqrt(array.length) * 2)
    val = val < minSize ? minSize : val
    val = val > maxSize ? maxSize : val
    return {
      id: key,
      name: key,
      category: key,
      value: 0,
      symbolSize: val,
      label: { show: true }
    }
  })
  // console.log(JSON.stringify(categories), links, categories)
  return {
    name: 'Les Miserables',
    type: 'graph',
    layout: 'circular',
    circular: {
      rotateLabel: true
  },
    data: serieData,
    links: links,
    categories: categories,
    // z: 3,
    force: { repulsion: 50 },
    itemStyle: {
      color: '#1a9baa',
      borderColor: '#fff',
      borderWidth: 1,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.3)'
    },
    lineStyle: { color: 'white', curveness: 0.3, width: 1 }
  }
}