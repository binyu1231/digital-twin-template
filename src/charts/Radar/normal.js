import 'echarts/lib/component/dataset'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/radar'

import { objectGet } from '@coloration/kit'

export const renderer = (instance, opt) => {

  const clr = objectGet(['rgba(255, 132, 33, 1)', 'rgba(0, 255, 240, 1)'], opt, 'colors')  
  const configUniMax = objectGet(false, opt, 'uniMax')
  const configMaxRatio = objectGet(1.2, opt, 'maxRatio')
  const typeTop = objectGet('auto', opt, 'typeTop')
  const typeBottom = objectGet('auto', opt, 'typeBottom')
  const typeLeft = objectGet('auto', opt, 'typeLeft')
  const typeRight = objectGet('auto', opt, 'typeRight')
  const typeIcon = objectGet('rect', opt, 'typeIcon')
  const typeVisiable = objectGet(true, opt, 'typeVisiable')
  // calc indicator max
  const indicatorMap = opt.data.reduce((map, d) => {
    if ((map.get(d.name) || 0) < d.value) {
      map.set(d.name, d.value)
    }
    return map
  }, new Map())

  let max = 0
  if (configUniMax) {
    max = Math.max(...indicatorMap.values()) * configMaxRatio
  }
  
  const indicator = Array.from(indicatorMap.keys()).map(k => {
    const typeMax = (indicatorMap.get(k) || 0) * configMaxRatio
    return {
      name: k,
      max: typeMax < max ? max : typeMax
    }
  })

  

  

  // calc group data
  const groupData = opt.data.reduce((group, d) => {
    const groupArray = group[d.type] || []
    groupArray.push(d.value)
    //set default
    group[d.type] = groupArray

    return group
  }, {})

  const legend = Object.keys(groupData)

  const data = legend.map((name) => ({ name, value: groupData[name] }))

  const series = data.map((d, i) => {
    const color = clr[i]
    return {
      type: 'radar',
      name: legend[i],
      data: [d],
      areaStyle: {
        opacity: 0.4
      },
      label: {
        show: true,
        color
      },
      lineStyle: {
        type: 'dotted'
      },
      zLevel: i
    }
  })

  const option = {
    color: clr,
    legend: {
      data: legend,
      show: typeVisiable,
      icon: typeIcon,
      itemWidth: 12,
      itemHeight: 9,
      textStyle: {
        color: '#fff'
      },
      left: typeLeft,
      top: typeTop,
      right: typeRight,
      bottom: typeBottom
    },
    radar: {
      // shape: 'circle',
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      // axisLabel: {
      //   show: true
      // },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      splitArea: {
        show: false
      },
      name: {
        textStyle: {
          color: '#fff',
        }
      },
      indicator
  },
    series,
  }

  instance.echart.setOption(option)
  return option
}