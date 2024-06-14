<template>
  <ChartBar 
    :width="width" 
    :height="height"
    :legend="legend"
    :value="value"
    :color="color"
    :title="title"
    :scrollLoad="scrollLoad"
    :measures="measures"
    :mergeOption="exOption"
    border
  />
</template>

<script>
import _ from 'lodash'
import ChartBar from './ChartBar'
import { calcValueDevide } from './util'
export default {
  props: {
    width: Number, 
    height: Number,
    legend: Array,
    value: Array,
    color: Array,
    scrollLoad: Boolean,
    title: { type: String, default: '' },
    measures: { type: String, default: '' },
    mergeOption: { type: Object, default: null },
  },
  components: { ChartBar },
  computed: {
    exOption () {
      // const minVal = parseInt(_.min(this.value) * 0.85)
      if (this.value.length === 0) return 
      
      const devide = 4                 // 分4段是5个数字
      const { max } = calcValueDevide(this.value, devide)

      return _.merge({
        xAxis: {
          splitLine: { show: false },
          axisLine: { show: false },
          axisLabel: { fontSize: 12, margin: 13 }
        },
        yAxis: { 
          splitLine: { show: false },
          axisLine: { show: false },
          axisLabel: { fontSize: 14, color: '#cbc8c8' },
          scale: true,
          min: 0, 
          max: max,
          interval: max / devide,
        },
        grid: { 
          show: false, 
          borderColor: '#0161b0',
          borderWidth: 1,
          left: '4%', right: '8%', bottom: '10%', containLabel: true },
        series: [{
          barWidth: 12,
          itemStyle: { 
            barBorderRadius: 6,
            borderColor: '#e7ea05',
            borderWidth: 1,
          }, 
        }]
      }, this.mergeOption)
    }
  }
}

{/* <ChartBarBorder 
    :width="420"
    :height="270"
    :legend="instLegend" 
    :value="instValue"
    :color="['transparent']"
    :mergeOption="{
      xAxis: { axisLabel: { 
        fontSize: 12, 
        margin: 13, 
        rotate: 0,
        formatter: l => l.split('').join('\n')
      }},
      yAxis: { axisLabel: { fontSize: 14 }},
      grid: { top: '15%' },
      series: [{
        barWidth: 7,
        //label: { show: true, position: 'top' },
        itemStyle: { 
          borderColor: calcColor(['#1d80c6', '#7d21b9']),
        }, 
      }]
    }"
    scrollLoad
  /> */}
</script>

<style>

</style>
