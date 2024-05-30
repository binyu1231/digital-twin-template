import 'echarts/lib/component/dataset'
import 'echarts/lib/chart/pie'

import { objectGet } from '@coloration/kit'

export const renderer = (instance, opt) => {

  const clr = objectGet(['orange', 'steelblue', 'pink', 'green', '#cd164e'], opt, 'colors')
  const minAngle = objectGet(10, opt, 'minAngle')
  const richStyle = clr.reduce((r, c, i) => {
    r[i] = {
      color: c,
      fontSize: 16,
      align: 'center',
      fontWeight: 'bold'
    }
    return r
  }, {
    name: {
      fontSize: 14,
      align: 'center',
      marginTop: 4,
      padding: [4, 0, 0, 0]
    }, 
  })

  const data = opt.data

  const sum = data.reduce((s, d) => s + d.value, 0)

  console.log('opt.data', opt)
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
          radius: '45%',
          center: ['50%', '50%'],
          minAngle,
          data,
          label: {
              color: 'rgba(255, 255, 255)',
              formatter (p) {
                return [
                  `{${p.dataIndex}|${p.value}}`,
                  `{name|${p.name}}`,
                ].join('\n')
              },
              rich: richStyle,
              alignTo: 'labelLine'
          },
          labelLine: {
              lineStyle: {
                  color: 'rgba(255, 255, 255)'
              },
              length: 16,
              length2: 28
          },
          itemStyle: {
            color: 'transparent',
          },
      },
      {
        type: 'pie',
        radius: '45%',
        center: ['50%', '50%'],
        data: data,
        minAngle,
        label: {
            color: 'rgba(255, 255, 255)',
            position: 'inner',
            fontWeight: 'bold',
            fontSize: 14,
            formatter (p) {
              return (p.value / sum * 100).toFixed(2) + '%'
            }
        },
        itemStyle: {
          borderWidth: 0,
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
    },
    ]
}

  instance.echart.setOption(option)
}