import _ from 'lodash'

const CATE = '投资机构'
const PART = 'PARTICIPATE_INVESTMENT'
const JOIN = 'JOINT_INVESTMENT'
const NEED_SET = 'NEED_SET'

const opt = {
  backgroundColor: 'transparent',
  tooltip: { show: false },
  animationDuration: 1500,
  animationEasingUpdate: 'quinticInOut',
  
  series : [{
    name: 'Les Miserables',
    type: 'graph',
    layout: 'force',
    data: NEED_SET,
    links: NEED_SET,
    categories: [{ name: CATE }],
    roam: 'move',
    focusNodeAdjacency: true,
    force: { 
      repulsion: 1000,
      // gravity: 0.2,
    },
    symbolSize: 60,
    itemStyle: {
      color: '#03babc',
      borderColor: '#fff',
      borderWidth: 1,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.3)'
    },
    label: { show:true, fontSize: 14, formatter: l => l.name.substring(0, 4) },
    lineStyle: { curveness: 0.3, opacity: 1 },
  }]
}


export const getOption = (data) => {
  const orgs = {}
  const links = []

  _.forEach(data, (s, i) => {
    
    const source = s.scr_comp.name
    const target = s.tag_comp.name
    const type = s.rela_type

    // 向orgs 中存储机构，用来画圆
    if (!(source in orgs)) orgs[source] = null 
    if (!(target in orgs)) orgs[target] = null

    
    // 处理连线数据
    // [源]与[目标]相等的会忽略
    if (source === target) return

    // 根据数据规律可以调整索引方向 or: _.findLastIndex
    // 目前暂未发现规律
    const index = _.findIndex(links, (link) => {
      // 累加规则
      // 类型相同：合投 or 参投
      // 机构相同：包括[源]与[目标]对换的情况
      if (
        link.type === type &&
        (link.source === source && link.target === target) ||
        (link.target === source && link.source === target)
      ) return link.lineStyle.width += 1
    })

    index < 0 && links.push({ 
      type, source, target, 
      lineStyle: {
        color: type === JOIN ? '#efcf60' : '#005dd3',
        width: 1 
      }
    })
  })

  
  const serieData = _.map(orgs, (UNUSE, key) => ({ 
    category: CATE, id: key, name: key, value: 20, 
  }))

  const option = _.cloneDeep(opt)
  const serie = option.series[0]

  serie.data = serieData
  serie.links = links

  return option
}