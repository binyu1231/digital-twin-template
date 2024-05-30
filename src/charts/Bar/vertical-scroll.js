import 'echarts/lib/component/dataset'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/grid'

import { objectGet } from '@coloration/kit'

const vX = 'value'
const vY = 'name'


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
  const xAxisName = objectGet(vX, opt, 'axis', vX)
  const yAxisName = objectGet(vY, opt, 'axis', vY)
  const pageSize = objectGet(-1, opt, 'pageSize')
  const fontSize = objectGet(12, opt, 'fontSize')
  const labelVisible = objectGet(false, opt, 'labelVisible')
  const clr = objectGet(['rgba(255, 132, 33, 1)', 'rgba(0, 255, 240, 1)'], opt, 'colors')
  const gridLeft = objectGet('auto', opt, 'gridLeft')
  const gridRight = objectGet('auto', opt, 'gridRight')
  const gridTop = objectGet('auto', opt, 'gridTop')
  const gridBottom = objectGet('auto', opt, 'gridBottom')
  const axisXVisiable = objectGet(true, opt, 'axisXVisiable')

  const typeSet = opt.data.reduce((set, d) => {
    const type = d.type || 'value'
    set.add(type)
    return set
  }, new Set())

  const legend = Array.from(typeSet)
  
  const names = Array.from(opt.data.reduce((set, d) => {
    set.add(d.name)
    return set
  }, new Set()))

  const max = names.reduce((n, name) => {
    const value = opt.data.filter(item => item.name === name)
    .reduce((acc, item) => {
      return configStack ? acc + item.value : Math.max(acc, item.value)
    }, 0)
    return Math.max(value, n)
  }, 0)

  const option = {
    legend: {
      show: legend.length > 1,
      data: legend,
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
    //   data: legend
    },
    grid: {
      left: gridLeft,
      right: gridRight,
      top: gridTop,
      bottom: gridBottom
    },
    xAxis: [Object.assign(genAxisStyle(), {
      name: xAxisName,
      show: axisXVisiable,
      type: 'value',
      max: max,
      // data: categories,
      splitLine: {
        show: false
      },
      position: 'top',
      axisLabel: {
        fontSize,
        // show: labelVisible,
      },
      axisTick: {
        show: true
      }
    })],
    yAxis: [Object.assign(genAxisStyle(), {
      name: yAxisName,
      type: 'category',
      data: names,
      nameLocation: 'end',
      inverse: true,
      axisLabel: {
        fontSize,
        // formatter (value: any) {
        //   return value === activeName ? `{a|${value}}` : value
        // },
        // rich: {
        //   a: {
        //     color: '#FFC948',
        //     fontSize: fontSize
        //   }
        // }
      },
      // offset: '-10%'
    })],
    color: clr,
    // dataset: [{
    //   dimensions: ['name'].concat(legend),
    //   source: data
    // }],

    series: legend.map((l) => ({
      type: 'bar',
      name: l,
      stack: configStack,
      barWidth: barWidth,
      xAxisIndex: 0,
      label: {
        show: labelVisible,
        position: 'right',
        color: '#fff',
        fontSize
      },
      data: opt.data.filter((item) => item.type === l)
    })),

    dataZoom: (pageSize === -1 || (opt.data.length / legend.length <= pageSize)) ? null : [{
      type: 'inside',
      yAxisIndex: 0,
      // startValue: 0,
      // endValue: 10,

      minValueSpan: pageSize,
      maxValueSpan: pageSize,
      moveOnMouseWheel: true,
      zoomOnMouseWheel: false
    }, {
      type: 'slider',
      show: true,
      yAxisIndex: 0,
      top: 0,
      right: 0,
      bottom: 0,
      dataBackground: {
        lineStyle: { width: 0 },
        areaStyle: { opacity: 0 },
      },
      selectedDataBackground: {
        lineStyle: { width: 0 },
        areaStyle: { opacity: 0 },
      },
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      fillerColor: clr[0],
      borderColor: 'transparent',
      width: 2,
      handleSize: 0,
      showDetail: false,
      // start: 0,
      // startValue: 0,
      // endValue: pageSize,
      moveOnMouseWheel: true,
      zoomOnMouseWheel: false,
      moveOnMouseMove: true
    }]
  }
  instance.echart.setOption(option)
  return option
}
