import 'echarts/lib/chart/graph'
import 'echarts/lib/component/legend'
// @ts-ignore
import { RadialGradient } from 'echarts/lib/util/graphic'
import { objectGet } from '@coloration/kit'
import { color } from '../color'
export const renderer = function (instance, opt) {

  const symbolBackground = objectGet('rgba(0, 0, 0, 0)', opt, 'symbolBackground')
  const links = objectGet([], opt, 'links')
  const colors = objectGet(color, opt, 'colors')
  const layout = objectGet('force', opt, 'layout')
  const repulsion = objectGet(1000, opt, 'repulsion')
  const typeVisible = objectGet(true, opt, 'typeVisible')
  // const clrDark = clr || colorDark


  const types = Array.from(opt.data.reduce((set, item) => {
    set.add(item.type)
    return set
  }, new Set())).map(name => ({ name }))

  const data = opt.data.map((item) => {

    const index = types.findIndex(t => t.name === item.type)
    return {
      ...item,
      symbolSize: item.value,
      category: index,
      // label: {
      //   show: item.name === item.type
      // },
      itemStyle: {
        color: new RadialGradient(0.4, 0.3, 1, [{
          offset: 1,
          color: symbolBackground
        }, {
          offset: 0.6,
          color: colors[index]
        }, {
          offset: 1,
          color: colors[index]
        }]),
      },
      emphasis: {
        itemStyle: {
          show: true,
          borderWidth: 4,
          borderColor: colors[index]
        },
        label: {
          show: true,
          color: colors[index],
          textBorderColor: 'rgba(255, 255, 255, 1)',
          textBorderWidth: 4,
        }
      }
    }
  })

  const option = {
    color: colors,
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    legend: {
      show: typeVisible,
      textStyle: {
        color: '#fff'
      },
      icon: 'circle',
      left: 'right'
    },
    series: [
      {
        type: 'graph',
        // layout: 'circular',
        layout,
        roam: 'move',
        force: {
          repulsion,
          // edgeLength: 10
        },
        circular: {
          rotateLabel: true
        },
        itemStyle: {
          shadowColor: 'rgba(255, 255, 255, 0.4)',
          borderWidth: 4,
          shadowBlur: 4,
          // shadowColor: clrDark[0],
          // color: new RadialGradient(0.4, 0.3, 1, [{
          //   offset: 0,
          //   color: symbolBackground // '#073564'
          // }, {
          //   offset: 1,
          //   color: clr[0]
          // }]),
        },
        emphasis: {
          itemStyle: {
            // borderColor: clr[4],
            // color: new RadialGradient(0.4, 0.3, 1, [{
            //   offset: 0,
            //   color: symbolBackground
            // }, {
            //   offset: 1,
            //   color: clr[4]
            // }]),
          },
          label: {
            fontSize: 20
          }
          // focus: 'adjacency',
          // lineStyle: {
          //   width: 10
          // }
        },
        label: {
          show: true,
          color: '#fff',
          // position: 'right',
          fontSize: 12,
          textBorderColor: 'rgba(0, 0, 0, 0.8)'
        },
        data,
        links,
        categories: types,
        lineStyle: {
          // color: 'source',
          // curveness: 0.3
        }
      }
    ]
  }

  // console.log('@@@@@', opt.data, opt.links)

  instance.echart.setOption(option)
}
