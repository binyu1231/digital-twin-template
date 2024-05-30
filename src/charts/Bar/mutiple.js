/* eslint-disable */

import 'echarts/lib/component/dataset'
import 'echarts/lib/component/grid'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
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
  const category = objectGet([], opt, 'category')
  const value = objectGet([], opt, 'value')
  const type = objectGet([], opt, 'type')
  const group = objectGet([], opt, 'group')

  const top = objectGet(60, opt, 'gridTop')
  const right = objectGet('10%', opt, 'gridRight')
  const bottom = objectGet(60, opt, 'gridBottom')
  const left = objectGet('10%', opt, 'gridLeft')

  const xAxisName = objectGet(vX, opt, 'axis', vX)
  const yAxisName = objectGet(vY, opt, 'axis', vY)
  const nameRotate = objectGet(0, opt, 'axis', 'nameRotate')
  const clr = objectGet(['rgba(255, 132, 33, 1)', 'rgba(0, 255, 240, 1)'], opt, 'colors')  
  
  const typeSet = new Set()

  // const data = opt.data.map((d) => {
  //   const type = d.group || 'value'
  //   typeSet.add(d.group)
  //   return ({
  //     name: d.name,
  //     [type]: d.value
  //   })
  // })

  const legend = Array.from(typeSet)

  const barSerieConfig = {
    stack: configStack,
    barWidth: barWidth,
    xAxisIndex: 0,
  }

  const lineSerieConfig = {
    smooth: true,
    areaStyle: {}
  }

  const option = {


 
    legend: {
      show: typeVisible,
      itemWidth: 16,
      itemHeight: 9,
      textStyle: {
        color: '#fff'
      },
      right: typeRight,
      bottom: typeBottom,
      left: typeLeft,
      top: typeTop,
    },
    tooltip: {},
    grid: {
      top, right, bottom, left
    },
    xAxis: [Object.assign(genAxisStyle(), {
      name: xAxisName,
      type: 'category',
      axisLabel: {
        rotate: nameRotate,
      },
        
      data: category,
    })],
    yAxis: Object.assign(genAxisStyle(), {
      type: 'value',
      name: yAxisName,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(255, 255, 255, 0.2)'
        }
      }
    }),
    series: [
      {
        name: group[0],
        type: type[0],
        z: 1,
        smooth: true,
        lineStyle: {
          color: '#FFE900',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: 'rgba(215, 201, 51, 0.8)'
            }, {
                offset: 1, color: 'rgba(0, 0, 0, 0)'
            }],
          },
        },
        
        data: value[0]
      },

      {
        name: group[1],
        type: type[1],
        z: 2,
        
        data: value[1],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: '#FEF28F'
            }, {
                offset: 1, color: '#FF8A00'
            }],
          }
        },
        emphasis: {
          itemStyle: {
            borderWidth: 3
          }
        },
      },
      {
        name: group[2],
        type: type[2],
        z: 3,
        // tooltip: {
        //   valueFormatter: function (value) {
        //     return value + ' ml';
        //   }
        // },
        data: value[2],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: '#9EFFE7'
            }, {
                offset: 1, color: '#00FFC6'
            }],
          }
        }
      },
    ]
  }
  
  
  
  
  
  
  
  
  
  
  
  // {
  //   legend: {
  //     show: typeVisible,
  //     itemWidth: 16,
  //     itemHeight: 9,
  //     textStyle: {
  //       color: '#fff'
  //     },
  //     right: typeRight,
  //     bottom: typeBottom,
  //     left: typeLeft,
  //     top: typeTop,
  //   },
  //   grid: {
  //     top, right, bottom, left
  //   },
  //   xAxis: [Object.assign(genAxisStyle(), {
  //     name: xAxisName,
  //     type: 'category',
  //     axisLabel: {
  //       rotate: nameRotate,
  //     },
        
  //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  //   })],
  //   yAxis: Object.assign(genAxisStyle(), {
  //     type: 'value',
  //     name: yAxisName,
  //     splitLine: {
  //       lineStyle: {
  //         type: 'dashed',
  //         color: 'rgba(255, 255, 255, 0.2)'
  //       }
  //     }
  //   }),
  //   color: clr,
  //   // dataset: [{
  //   //   dimensions: ['name'].concat(legend),
  //   //   source: data
  //   // }],
    
  //   series: legend.map((group) => {
  //     const t = type[group] || 'bar'

  //     return Object.assign(
  //       { 
  //         type: t,
  //         name: group, 
  //         data: Array.from({ length: 20 }).map(() => Math.round(Math.round() * 1000)),
  //       }
  //       , t === 'bar' ? barSerieConfig : lineSerieConfig)
  //   }),
  // }
  instance.echart.setOption(option)
  return option
}