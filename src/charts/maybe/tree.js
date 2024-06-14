export const warpReg = 
  /((信息|电子)?(服务|股份|技术|商务|科技)?(股份|控股)?有限(责任)?公司)$/
export const leaveSize = 20
export const nodeType = { FUND: 1, INVEST: 2, ORG: 3, PROJECT: 4, NORMAL: 2 }
const opt = {
  series: [{
    type: 'tree',
    data: 'NEED_SET',

    top: '6%', left: '10%', bottom: '1%', right: '40%', // 最后一层名字特别长
    symbol: 'circle', symbolSize: 26,
    itemStyle: { borderWidth: 0, color: '#0099db' },
    lineStyle: { color: 'rgba(255, 255, 255, 0.3)' },
    label: {
      position: 'bottom',
      verticalAlign: 'middle',
      align: 'center',
      fontSize: 14,
      color: '#eeeeee',
    },

    leaves: {
      label: { position: 'right', verticalAlign: 'middle', align: 'left' }
    },
    initialTreeDepth: -1,
    expandAndCollapse: true,
    animationDuration: 550,
    animationDurationUpdate: 750
  }]
}

let STRUCT = []
// pure
const generateStruct = (nodes, level, id, struct = []) => {
  if (!nodes) return struct
  // const root = struct[0]
  // const rootName = _.keys(struct[0])[0]

  if (level > struct.length) struct.push({})

  const container = struct[level - 1]


  _.forEach(nodes, (node, i) => {

    let parentColor
    let parentType

    switch (node.name) {
      case '项目': 
        parentType = nodeType.PROJECT
        parentColor = '#29b397'
        break
      case '管理基金':
        parentType = nodeType.FUND
        parentColor = '#e97767'
        break
      case '分支机构':
        parentType = nodeType.ORG
        parentColor = '#e3972c'
        break
      case '投资':
      default:
        parentType = nodeType.INVEST
        parentColor = '#3b87b2'
        break
    }

    if (node.children) {
      container[node.name + id] = _.map(node.children, (child, i) => {
        const hasChildren = !!child.children
        
        let color = parentColor, type = parentType

        switch (child.name) {
          case '项目': 
            type = nodeType.PROJECT
            color = '#29b397'
            break
          case '管理基金':
            type = nodeType.FUND
            color = '#e97767'
            break

          case '分支机构':
            type = nodeType.ORG
            color = '#e3972c'
            break
          case '投资':
            type = nodeType.INVEST
            color = '#3b87b2'
            break
        }

        if (type === nodeType.ORG) {
          // child.name = child.name.replace(rootName, '')
          // console.log(child.properties)

        }

        const res = { 
          name: child.name, 
          value: 10, 
          level: level + 1, 
          hasChildren,
          // id 会干扰动画
          index: child.value ? child.value.id : id,
          type,
          itemStyle: { color },
        }

        if (!hasChildren) {
          res.symbolSize = leaveSize
          res.label = { fontSize: 12 }
        }


        if (
          child.value && 
          child.value.pro_logo &&
          child.value.pro_logo !== 'None'
        ) {
          res.symbol = `image://${child.value.pro_logo}`
        }
        return res
      })

      generateStruct(node.children, level + 1, id, struct)
    }
  })

  return struct 
}


// const getChildren = (name, level) => {
//   if (level >= STRUCT.length) return null
//   return name in STRUCT[level] ? STRUCT[level][name] : null
// }
const n = '上海迈外迪网络科技有限公司'

const getTree = (struct, name, id) => {
  const current = _.cloneDeep(struct[0])
  const sub = _.cloneDeep(struct.slice(1))
  let children = current[name + id]

 
  if (name === n) {
    console.log(current, children)
  }
  // children = _.filter(children, child => child.index === id)

  children = _.map(children, (child => {
    if (child.name === '上海迈外迪网络科技有限公司') {
      console.log(child)
      console.log(sub)
      console.log(child.name, child.index)
    }
    
    if (child.hasChildren) {
      return _.merge(child, getTree(sub, child.name, child.index))
    }

    return child
  }))
  
  return { name, children }


}

const getTreeData = (level = STRUCT.length) => {
  const tem = STRUCT.slice(0, level - 1)
  const rootKey = _.keys(tem[0])[0]
  const idReg = /\d+$/
  const id = rootKey.match(idReg)[0]
  for (var i = tem.length - 1; i > 0; i--) {
    _.map(tem[i], (children, key) => {
      _.map(tem[i - 1], parents => {
        _.map(parents, parent => {
          if (parent.name + id === key) parent.children = children
        })
      })
    })
  }
  
  console.log(STRUCT, rootKey)
  console.log('------------------')

  const tree = getTree(STRUCT, rootKey.replace(idReg, ''), rootKey.match(idReg)[0])
  console.log(tree)
  console.log('------------------')

  const data = [{ 
    name: rootKey.replace(idReg, '').replace(warpReg, '\n' + '$1'), 
    children: tem[0][rootKey]
  }]
  console.log(data)
  return [tree]
}

export const getTreeOption = (data, deep) => {
  STRUCT = generateStruct([data], 1, data.value.id, [])

  // const res = getTreeData(1)
  // delete data.children[2].children
  // console.log(getTreeData(2))
  const option = _.cloneDeep(opt)
  option.series[0].data = getTreeData(deep)
  return  option
}



export const getChildrenMax = (struct = STRUCT) => {

  const counts = _.map(struct, (obj, i) => ({
    max: _.reduce(_.values(obj), (acc, next) => acc + next.length, 0),
    level: i
  }))
 
  return _.maxBy(counts, c => c.max)
}


let lastMax = 0
export const pushChild = (data) => {

  let parentLevelIndex, parentLevelName, parentIndex
  
  _.findLast(STRUCT, (level, levelIndex) => {
    _.findLast(level, (itemChildren, itemName) => {
      return _.find(itemChildren, (c, i) => {

        const is = c.name === data.name
        if (is) {
          parentLevelIndex = levelIndex
          parentLevelName = itemName
          parentIndex = i
        }
      })
    })
  })

  const parent = STRUCT[parentLevelIndex][parentLevelName][parentIndex]
  parent.hasChildren = true

  let beMerge = _.fill(Array(parentLevelIndex + 1), {})

  beMerge = _.concat(beMerge, generateStruct([data], 1, data.value.id, []))

  STRUCT = _.merge(STRUCT, beMerge)

  const option = _.cloneDeep(opt)
  option.series[0].data = getTreeData()
  
  lastMax = lastMax || getChildrenMax(STRUCT).max

  lastMax += getChildrenMax(beMerge).max

  return { option, deep: STRUCT.length, max: lastMax }
}

export default {
  STRUCT,
  getTreeOption,
  getChildrenMax
}