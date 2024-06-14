<template>
<div class="chart-base">
<div ref="chart" :style="{ width: width + 'px', height: height + 'px' }"></div>
</div>
</template>

<script>
import { parse16Color, NEED_SET, bgColor } from './util'
import Chart from './Chart'
import _ from 'lodash'

const option = {
  backgroundColor: bgColor,
  radar: {
    indicator: NEED_SET,
    center: ["50%", "50%"],
    radius: 85,
    startAngle: 90,
    splitNumber: 4,
    shape: "circle",
    name: {
      show: false,
      textStyle: {
        fontSize:12,
        color: "#93e1f8"
      }
    },
    // nameGap: '30',
    splitArea: {
      areaStyle: {
        color: 'transparent',
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowBlur: 10
      }
    },
    axisLine: { lineStyle: { color: "#2369a2" } },
    splitLine: { lineStyle: { color: "#2369a2" } }
  },
  series: {
    type: "radar",
    itemStyle: { color: '#ffb800' },
    data: [{
        value: NEED_SET,
        areaStyle: { color: parse16Color('#ffb800', .5) },
    }]
  }
}

export default {
  mixins: [ Chart ],
  props: {
    width: Number, 
    height: Number,
    legend: Array,
    value: Array,
    color: Array,
    max: Number,
    suffix: { type: String, default: '' },
    title: { type: String, default: '' },
    measures: { type: String, default: '' },
    mergeOption: { type: Object, default: null },
  },

  methods: {
    init () {
      this.chart = this.chart || this.$echarts.init(this.$refs.chart, 'dark')

      this.zRender = this.zRender || this.chart.getZr()
      this.chart.clear() // 必须先清除chart 否则后面 setOption 无效
      this.zRender.clear() // 清除上一次残留的百分比数据
      
      const opt = _.merge({}, option, this.mergeOption)
      
      // 配置雷达坐标轴的最大值 但是坐标轴文字是在下面写的
      opt.radar.indicator = this.legend.map(() => ({ max: this.max }))
      
      // 中间区域部分
      opt.series.data[0].value = this.value
      this.chart.setOption(opt)

      // 坐标文字，百分比需要单独写
      const coordSys = this.chart.getModel().getSeriesByIndex(0).coordinateSystem
      
      const offsetRadius = [108, 140, 180, 180, 140]
      const offsetY = [0, 23, -55, -55, 23]
      _.forEach(this.value, (val, i) => {
        // 把极坐标转换成像素点
        // 先做半径偏移，算完像素后再在y上加减
        const point = coordSys.coordToPoint(offsetRadius[i], i) // r, index
        
        point[1] += offsetY[i]

        this.zRender.add(new this.$echarts.graphic.Text({
          style: {            
            x: point[0],
            y: point[1] - 18,
            text: this.legend[i], //val + this.suffix, // 这个是缀 eg: '%'
            textAlign: 'center', 
            fontSize: 12,
            textFill: '#93e1f8', 
          }
        }))
        
        this.zRender.add(new this.$echarts.graphic.Text({
          style: {            
            x: point[0],
            y: point[1],
            text: val + this.suffix, // 这个是缀 eg: '%'
            textAlign: 'center', 
            fontSize: 12,
            textFill: '#fff', 
          }
        }))
      })
    }
  },
  mounted () {

    // console.log()
  }
}
</script>

<style>
</style>
<!-- <ChartRadar
      :width="410"
      :height="320"
      :legend="strengthLegend.map(l => l.name)"
      :color="['#ff7778']"
      suffix="%"
      :max="100"
      :value="strengthValue"
    /> -->