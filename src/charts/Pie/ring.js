import 'echarts/lib/component/dataset'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/pie'


import { objectGet } from '@coloration/kit'

export const renderer = (instance, opt) => {

  const clr = objectGet(['orange', 'steelblue', 'pink', 'green', '#cd164e'], opt, 'colors')
  const title = objectGet('', opt, 'title')
  const titleFontSize = objectGet(14, opt, 'titleFontSize')
  const fontSize = objectGet(12, opt, 'fontSize')
  const ringSize = objectGet('30%', opt, 'ringSize')
  const ringOuterSize = objectGet('50%', opt, 'ringOuterSize')
  const isRose = objectGet(false, opt, 'isRose')
  const labelVisible = objectGet(false, opt, 'labelVisible')
  const labelDivider = objectGet('/', opt, 'labelDivider')
  const left = objectGet('auto', opt, 'left')
  const right = objectGet('auto', opt, 'right')
  const top = objectGet('auto', opt, 'top')
  const bottom = objectGet('auto', opt, 'bottom')
  const typeLeft = objectGet('auto', opt, 'typeLeft')
  const typeRight = objectGet('auto', opt, 'typeRight')
  const typeTop = objectGet('auto', opt, 'typeTop')
  const typeBottom = objectGet('auto', opt, 'typeBottom')
  const typeWidth = objectGet('auto', opt, 'typeWidth')
  const labelSuffix = objectGet('', opt, 'labelSuffix')

  const richStyle = clr.reduce((r, c, i) => {
    r[i] = {
      color: c,
      fontSize,
      align: 'center',
      verticalAlign: 'top',
      lineHeight: 36,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 3,
      shadowBlur: 1,
      shadowColor: c,
      shadowOffsetX: 0,
      shadowOffsetY: 1
    }
    return r
  }, {})

  const total = opt.data.reduce((t, item) => item.value + t, 0)

  const data = opt.data.map((d, i) => {

    const labelConfig = {
      distanceToLabelLine: 0,
      color: 'rgba(255, 255, 255)',
      postion: 'top',
      distance: 10,
      formatter(p) {
        
        const ratio = total === 0 ? 0 : p.value * 100 / total
        return [
          // `{${p.dataIndex}|${p.name} ${p.value}}`,
          `{${p.dataIndex}|${ratio.toFixed(2)}%${labelDivider}${d.displayValue || p.value}${labelSuffix}}`,
        ].join('\n')
      },
      rich: richStyle,
    }
    return {
      ...d,
      label: Object.assign({ show: labelVisible }, labelConfig),
      labelLine: {
        length: 30,
        length2: 0,
      },
      emphasis: {
        label: Object.assign({ show: true }, labelConfig),
        labelLine: {
          lineStyle: {
            color: clr[i]
          }
        }
      }
    }
  })

  const option = {
    color: clr,
    title: {
      text: title,
      left: 'center',
      top: 'center',
      textStyle: {
        fontSize: titleFontSize,
        color: '#fff'
      }
    },

    legend: {
      show: true,
      icon: 'circle',
      textStyle: {
        color: '#fff',
        fontSize
      },
      left: typeLeft,
      top: typeTop,
      right: typeRight,
      bottom: typeBottom,
      width: typeWidth
    },

    series: [{
      type: 'pie',
      radius: [ringSize, ringOuterSize],
      center: ['50%', '50%'],
      roseType: isRose,
      data,
      left,
      top,
      right,
      bottom
    }]
  }

  instance.echart.clear()
  instance.echart.setOption(option)
  instance.echart.dispatchAction({
    type: 'highlight',
    dataIndex: 0,
  })

  return option
}