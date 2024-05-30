import 'echarts/lib/component/dataset'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/transform'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/line'

import { objectGet } from '@coloration/kit'

const vX = 'name'
const vY = 'value'


const genAxisStyle = () => ({
  axisTick: { show: false },
  axisLine: {
    lineStyle: {
      color: '#fff',
    },
  },
  splitLine: {
    lineStyle: {
      type: 'dashed',
      color: 'rgba(255, 255, 255, 0.2)'
    }
  }
})

export const renderer = (instance, opt) => {

  const clr = objectGet(['rgba(255, 132, 33, 1)'], opt, 'colors')  
  const option = {
    xAxis: Object.assign(genAxisStyle(), {
      name: objectGet(vX, opt, 'axis', vX)
    }),
    yAxis: Object.assign(genAxisStyle(), {
      name: objectGet(vY, opt, 'axis', vY)
    }),
    color: clr,
    dataset: [{
      source: opt.data,
    }],
    legend: {
      show: true
    },
    label: {
      show: true,
      position: 'top',
      formatter (d) {
        return d.data.name
      },
      color: '#fff'
    },
    series: [{
      symbolSize: (d) => d.value,
      encode: {
        x: 'valueX',
        y: 'valueY',
      },
      type: 'scatter'
    }, 
      // {
      //   type: 'line',
      //   datasetIndex: 0,
      //   symbolSize: 0.1,
      //   symbol: 'circle',
      //   encode: {
      //     x: vX,
      //     y: vY,
      //   },
      //   label: {
      //     show: false,
      //   }
      // }
    ],
  }

  instance.echart.setOption(option)
  return option
}