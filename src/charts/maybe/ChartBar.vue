<template>
<div class="chart-base">
  <div ref="chart" :style="{ width: width + 'px', height: height + 'px' }"></div>
</div>
</template>

<script>
import { NEED_SET, calcColor, calcValueDevide, bgColor } from './util'
import Chart from './Chart'
import _ from 'lodash'


/* only style in opt, set data in mounted hook */
const option = {
  title: {
    left: 'center',
    textStyle: { fontSize: 16, fontWeight: 'normal' }
  },
  tooltip: {
    show: true,
    padding: [15, 25],
    trigger: 'axis',
    axisPointer: { lineStyle: { color: '#3383e8', type: 'dashed' } },
    z: 1
  },
  backgroundColor: bgColor,
  xAxis: {
    type: 'category',
    data: NEED_SET,
    axisTick: { show: false, },
    axisLine: { lineStyle: { color: '#171e31' } },
    axisLabel: { rotate: -45 }
  },
  yAxis: {
    type: 'value',
    axisTick: { show: false, },
    axisLine: { lineStyle: { color: '#171e31' } },
    splitLine: { lineStyle: { type: 'solid', color: '#171e31' } },
    nameTextStyle: { padding: [0, 25, 0, 0] },
  },
  grid: { left: '6%', right: '10%', bottom: '5%', containLabel: true },
  series: [{
    type: 'bar',
    barWidth: 10,
    itemStyle: { barBorderRadius: 3 }, 
    z: 3,
    data: NEED_SET
  }]
}
export default {
  mixins: [ Chart ],
  props: {
    width: Number, 
    height: Number,
    legend: Array,
    value: Array,
    color: Array,
    title: { type: String, default: '' },
    measures: { type: String, default: '' },
    mergeOption: { type: Object, default: null },
    border: { type: Boolean, default: false }
  },

  data () {
    return {
      option: _.merge({}, option)
    }
  },

  methods: {
    init () {
      this.chart = this.$echarts.init(this.$refs.chart, 'dark')
      this.zRender = this.zRender || this.chart.getZr()

      if (this.border) {
        this.zRender.clear()
        this.chart.clear()
      }

      const opt = _.merge({}, this.option, this.mergeOption)
      opt.xAxis.data = this.legend
      
      const optColor = this.color.map(c => calcColor(c))

      opt.title.text = this.title
      opt.yAxis.name = this.measures
      opt.series[0].data = this.value.map((val, i) => ({
        value: val,
        itemStyle: { color: i >= optColor.length ? optColor[0] : optColor[i] }
      }))

      this.chart.setOption(opt)

      if (!this.border) return
      
      
      const devide = 4                 // 分4段是5个数字
      const { max } = calcValueDevide(this.value, devide)

      const coordSys = this.chart.getModel().getSeriesByIndex(0).coordinateSystem
      
      const maxIdx = this.value.length - 1
      
      const pxPoints = _.map(
        [
          [0, max], [0, max], [0, 0], 
          [maxIdx, 0], [maxIdx, max], [maxIdx, max]
        ],
        point => coordSys.dataToPoint(point)
      )

      // let lastBarWidth = 0
      let dblBarWidth = opt.series[0].barWidth * 2
      // 条目太少需要撑开宽度
      if (this.value.length < 4) {
        // lastBarWidth = dblBarWidth
        dblBarWidth = 150 / this.value.length
      }
      
      pxPoints[0][0] += dblBarWidth  // 左上右点
      pxPoints[1][0] -= dblBarWidth  // 左上点
      pxPoints[2][0] -= dblBarWidth  // 左下点

      pxPoints[3][0] += dblBarWidth  // 右下点
      pxPoints[4][0] += dblBarWidth  // 右上点
      pxPoints[5][0] -= dblBarWidth  // 右上左点

      if (this.value.length < 4) {
        pxPoints[0][0] -= dblBarWidth  // 左上右点
        pxPoints[5][0] += dblBarWidth // 右上左点 
      }

      // [0, 0] [0, _.max(this.value)] [this.value.length - 1, 0] [this.value.length - 1, _.max(this.value)]

      var polyline = new this.$echarts.graphic.Polyline({
        style: { stroke: '#0161b0', lineWidth: 1 },
        shape: { points: pxPoints }
      });

      this.zRender.add(polyline)
    },

  },
  mounted () {
    
  }
}
</script>

<!-- <ChartBar title="融资金额"
        scrollLoad
        :width="500"
        :height="340"
        :legend="goodIndustry.legend" 
        :color="goodIndustry.color"
        :value="goodIndustry.investMoney"
        measures="万美元"
        :mergeOption="{ yAxis: { nameTextStyle: { padding: [0, 49, 0, 0] }}}"/> -->