import 'echarts/lib/component/dataset'
import 'echarts/lib/chart/pie'

import { objectGet } from '@coloration/kit'

export const renderer = (instance, opt) => {

  const clr = objectGet(['orange', 'steelblue', 'pink', 'green', '#cd164e'], opt, 'colors')
  const minAngle = objectGet(10, opt, 'minAngle')
  // const richStyle = clr.reduce((r, c, i) => {
  //   r[i] = {
  //     color: c,
  //     fontSize: 16,
  //     align: 'center',
  //     fontWeight: 'bold'
  //   }
  //   return r
  // }, {
  //   name: {
  //     fontSize: 14,
  //     align: 'center',
  //     marginTop: 4,
  //     padding: [4, 0, 0, 0]
  //   }, 
  // })

  const data = opt.data

  // const sum = data.reduce((s, d) => s + d.value, 0)

  const option = {
    color: clr,
    title: {
        left: 'center',
        top: 20,
        textStyle: {
            color: '#ccc'
        }
    },
    
    series: [
        {
          type: 'pie',
          radius: ['30%', '80%'],
          center: ['50%', '50%'],
          roseType: 'radius',
          itemStyle: {
            borderRadius: 0
          },
          label: {
            show: false
          },
         
          minAngle,
          data,
          labelLine: {
              lineStyle: {
                  color: 'rgba(255, 255, 255)'
              },
              length: 16,
              length2: 28
          },
      },
    ]
}

  instance.echart.setOption(option)
}