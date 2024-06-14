<template>
<div class="chart-base">
  <div ref="chart" :style="{ width: width + 'px', height: height + 'px' }"></div>
</div>
</template>

<script>
import { NEED_SET, calcColor, bgColor } from './util'
import Chart from './Chart'
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
    axisPointer: {
      lineStyle: {
        color: '#3383e8',
        type: 'dashed'
      }
    }
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
    type: 'line',
    symbolSize: 6,
    // itemStyle: { barBorderRadius: 3 }, 
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
  },

  data () {
    return {
      option: _.merge({}, option)
    }
  },
  methods: {
    init () {
      this.chart = this.$echarts.init(this.$refs.chart, 'dark')
      const opt = _.merge({}, this.option, this.mergeOption)
      opt.xAxis.data = this.legend
      
      const optColor = this.color.map(c => calcColor(c))

      opt.title.text = this.title
      opt.yAxis.name = this.measures
      opt.series[0].lineStyle = { color: optColor[0] }
      opt.series[0].data = this.value.map((val, i) => ({
        value: val,
        itemStyle: { color: optColor[0] }
      }))
      
      this.chart.setOption(opt)
    }
  },
  mounted () {
    
  }
}
</script>

<!-- <ChartLine
            :width="750"
            :height="300"
            :legend="analyCurrentLegend" 
            :color="['#91e1f8']"
            :value="analyCurrentValue"
            :measures="this.indicatorOpts[this.analyIndex].measure"
            :merge-option="{
              legend: { width: 220 },
              grid: { top: 50, bottom: '10%' }
            }"
          /> -->