<template>
<div class="chart-base">
  <div ref="chart" :style="{ width: width + 'px', height: height + 'px'}"></div>
</div>
</template>

<script>
import _ from 'lodash'
import { NEED_SET, calcColor, bgColor } from './util'
import Chart from './Chart'

const option = {
  title: {
    left: 'center',
    textStyle: { fontSize: 16, fontWeight: 'normal' }
  },
  tooltip: { 
    padding: [15, 25],
    trigger: 'axis',
    axisPointer: {
      lineStyle: {
        color: '#3383e8',
        type: 'dashed'
      }
    },
  },
  backgroundColor: bgColor,
  xAxis: {
    type: 'value',
    position: 'top',
    axisTick: { },
    splitNumber: 3,
    axisLine: { lineStyle: { color: 'white' }, },
    splitLine: { show: false },
  },
  yAxis: {
    type: 'category',

    axisTick: { alignWithLabel: true },
    inverse: true,
    data: NEED_SET,
    axisLine: { lineStyle: { color: 'white' } }
  },
  grid: { left: '6%', right: '15%', bottom: '13%', containLabel: true },
  series: [{
    type: 'bar',
    barWidth: 10,
    itemStyle: { barBorderRadius: 3, },
    data: NEED_SET,
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
    afterMerge: Function
  },
  data () {
    return {
      option: _.merge({}, option)
    }
  },
  methods: {
    init () {
      this.chart = this.$echarts.init(this.$refs.chart, 'dark')

      const optColor = this.color.map(c => calcColor(c, 2))
      const opt = _.merge({}, this.option, this.mergeOption)

      opt.title.text = this.title
      opt.yAxis.data = this.legend
      opt.series[0].data = this.value.map((val, i) => ({
        value: val,
        itemStyle: { color: i >= optColor.length ? optColor[0] : optColor[i] }
      }))

      if (this.afterMerge) this.afterMerge(opt)

      this.chart.setOption(opt)
    }
  },
  mounted () {
    
  }
}


</script>

<!-- <ChartBarY 
  :width="400"
  :height="411"
  measure="笔"
  :legend="chainlinkName" 
  :color="[['#1d81c8','#60d0f5']]/* 蓝色 */"
  :value="chainlink.financeNum"
  :merge-option="{
    yAxis: { 
      axisTick: { show: false },
    },
    grid: { top: '4%', right: '8%', bottom: '7%' },
    series: [{
      stack: 'chart',
      barWidth: 6,
    }]
  }"
  :after-merge="opt => {
    const value = chainlink.financeNum
    // 背景
    opt.series.unshift({
      type: 'bar',
      itemStyle: {
        color: 'transparent',
        borderColor: calcColor('#1d81c8'),
        barBorderRadius: 2
      },
      barWidth: 6,
      barGap:'-100%',
      data: _.fill(new Array(value.length), _.max(value)),
      animation: false,
      
    })
  }"
  scrollLoad
/> -->