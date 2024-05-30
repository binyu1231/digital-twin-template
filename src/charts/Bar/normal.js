import 'echarts/lib/component/dataset'
import 'echarts/lib/component/grid'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/legend'

import { objectGet } from '@coloration/kit'

const vX = 'name'
const vY = 'value'


const genAxisStyle = () => ({
  axisTick: { show: false },
  axisLine: {
    show: true,
    lineStyle: {
      color: 'rgba(255, 255, 255, 0.8)',
    },
  },
})

export const renderer = (instance, opt) => {

  const configStack = objectGet(false, opt, 'stack')
  const barWidth = objectGet(10, opt, 'barWidth')
  const typeLeft = objectGet('auto', opt, 'typeLeft')
  const typeRight = objectGet('auto', opt, 'typeRight')
  const typeTop = objectGet('auto', opt, 'typeTop')
  const typeBottom = objectGet('auto', opt, 'typeBottom')
  const typeVisible = objectGet(true, opt, 'typeVisible')

  const top = objectGet(60, opt, 'gridTop')
  const right = objectGet('10%', opt, 'gridRight')
  const bottom = objectGet(60, opt, 'gridBottom')
  const left = objectGet('10%', opt, 'gridLeft')

  const xAxisName = objectGet(vX, opt, 'axis', vX)
  const yAxisName = objectGet(vY, opt, 'axis', vY)
  const nameRotate = objectGet(0, opt, 'axis', 'nameRotate')
  const clr = objectGet(['rgba(255, 132, 33, 1)', 'rgba(0, 255, 240, 1)'], opt, 'colors')  
  
  const typeSet = new Set()

  const data = opt.data.map((d) => {
    const type = d.type || 'value'
    typeSet.add(type)
    return ({
      name: d.name,
      [type]: d.value
    })
  })

  const legend = Array.from(typeSet)
  legend.sort()

  const option = {
    legend: {
      show: typeVisible,
      itemWidth: 12,
      itemHeight: 9,
      textStyle: {
        color: '#fff'
      },
      right: typeRight,
      bottom: typeBottom,
      left: typeLeft,
      top: typeTop,
      icon: 'rect'
    },
    grid: {
      top, right, bottom, left
    },
    xAxis: [Object.assign(genAxisStyle(), {
      name: xAxisName,
      type: 'category',
      axisLabel: {
        rotate: nameRotate,
      },
        
      // data: categories,
    })],
    yAxis: Object.assign(genAxisStyle(), {
      name: yAxisName,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(255, 255, 255, 0.2)'
        }
      }
    }),
    color: clr,
    dataset: [{
      dimensions: ['name'].concat(legend),
      source: data
    }],
    
    series: legend.map(() => ({ 
      type: 'bar',
      stack: configStack,
      barWidth: barWidth,
      xAxisIndex: 0
    })),
  }
  instance.echart.setOption(option)
  return option
}