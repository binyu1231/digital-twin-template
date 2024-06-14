<template>
<div class="chart-base">
  <div ref="chart" :style="{ width: width + 'px', height: height + 'px'}"></div>
</div>
</template>

<script>
import _ from 'lodash'
import {  NEED_SET, bgColor } from './util'
import Chart from './Chart'

const normalSerie = {
  center: NEED_SET,
  color: NEED_SET,
  label: NEED_SET,
  data: NEED_SET,
  type: 'pie',
  labelLine: { length: 8, length2: 5 },
  // hoverAnimation: false,
  radius: NEED_SET,
}

const option = {
  backgroundColor: bgColor,
  // tooltip: { 
  //   show: true,
  //   formatter: l => {
  //     console.log(l)
  //     return l.value
  //   }
  // },  
  grid: { left: '6%', top: 0, right: 20, bottom: '10%', containLabel: true },
  legend: {
    width: '100%',
    bottom: 10,
    itemWidth: 12,
    itemHeight: 12,
    selectedMode: 'multiple',
    textStyle: { fontSize: 10, color: '#f5f5f5' },
    data: NEED_SET
  },
  series: NEED_SET
}

export default {
  mixins: [ Chart ],
  props: {
    width: Number, 
    height: Number,
    row: Number,
    col: Number,
    legend: Array,
    value: Array,
    color: Array,
    radius: { type: Array, default: null },
    category: Array,
    suffix: { type: String, default: null },
    calcRatio: Boolean,
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
    getCenterX (i) {
      return i % this.col / this.col + 1 / (this.col + 2)
    },
    getCenterY (i) {
      return (Math.floor(i / this.col)) / (this.row + 0.5) + 1 / (this.row + 3)
    },
    init () {
      this.chart = this.chart || this.$echarts.init(this.$refs.chart, 'dark')
      
      this.zRender = this.zRender || this.chart.getZr()
      this.chart.clear()
      this.zRender.clear()
      const opt = _.merge({}, this.option, this.mergeOption)

      opt.legend.data = this.legend.map(l => ({ name: l, icon: 'circle' }))
      opt.series = this.category.map((org, i) => {
        const serie = _.merge({}, normalSerie)

        let totalValue = 0
        if (this.calcRatio) {
          totalValue = _.sum(this.value[i])
        }

        serie.center = [ this.getCenterX(i) * 100 + '%', this.getCenterY(i) * 100 + '%' ]
        serie.color = this.color
        serie.label = { formatter: l => this.suffix ? (l.value + this.suffix) : l.value  }
        serie.radius = this.radius || ['16%', '20%']
        serie.data = this.value[i].map((item, j) => ({
          value: item.value,
          name: item.name
        }))

        return serie
      })

      this.chart.setOption(opt)


      const zrWidth = this.zRender.getWidth()
      const zrHeight = this.zRender.getHeight()
      const fontSize = 12
      const newTexts = this.category.map((org, i) => (new this.$echarts.graphic.Text({
        style: {            
          x: this.getCenterX(i) * zrWidth,
          y: this.getCenterY(i) * zrHeight - fontSize / 2 + 2,
          text: org,
          textAlign: 'center', 
          fontSize: fontSize,
          textFill: '#f5f5f5f5', 
        }
      })))
      .map(this.zRender.add.bind(this.zRender))
    }
  },
  mounted () {
    
  }
}
</script>

<style scoped>
</style>
<!-- <ChartPieMult 
    :width="width"
    :height="height"
    :row="row"
    :col="col"
    :radius="radius"
    :legend="scientific.chain"
    :category="scientific.org"
    :color="[
      '#643dcc', '#9951ab', '#2761bf', '#2f85fc', '#00a3af', 
      '#47cfde', '#4cce80', '#d39063', '#e6b422', '#fad60f'
      // '#e047a2', '#e2d048', '#e17e45', '#a03443', '#67b746', '#9346e2', '#44cfe4'
    ]"
    :value="scientific.data"
    suffix="%"
    :scrollLoad="scrollLoad"
  /> -->