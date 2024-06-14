<template>
<div class="chart-base">
  <div ref="chart" :style="{ width: width + 'px', height: height + 'px' }"></div>
</div>
</template>

<script>
import { Chart, chartUtil  } from '../charts'
import { splitThousand } from '../../util/tool'
const { NEED_SET, bgColor } = chartUtil

const pieCenter = ['50%', '43%']

const option = {
  backgroundColor: bgColor,
  // 图例样式
  legend: {
    bottom: 0,
    itemWidth: 14,
    itemHeight: 14,
    borderRadius: 7,
    textStyle: { fontSize: 12, color: '#f1f1f1' },
    data: NEED_SET
  },
  color: NEED_SET,
  series: [{
    type:'pie',
    radius: ['50%', '65%'],
    center: pieCenter,
    label: { fontSize: 14, formatter: l => splitThousand(l.value)  }, // legend 转为 value
    labelLine: { length: 10 },
    data: NEED_SET
  }]
}
// const generateOpt = (legend, value, color) => ()

export default {
  mixins: [ Chart ],
  props: {
    width: Number, 
    height: Number,
    legend: Array,
    value: Array,
    color: Array,
    title: String
  },
  methods: {
    init () {
      this.chart = this.chart || this.$echarts.init(this.$refs.chart, 'dark')

      const total = _.sum(this.value)
      this.$refs.chart.style.opacity = total
      

      if (total === 0) return

      const opt = _.cloneDeep(option)

      opt.legend.data = this.legend.map(l => ({ name: l, icon: 'circle' }))
      opt.color = this.color
      opt.series[0].data = this.legend.map((l, i) => {

        const value = this.value[i]
        const isntZero = value !== 0 

        return {
          value: value, 
          name: l,
          label: { show: isntZero },
          labelLine: { 
            show: isntZero,
            emphasis: { show: isntZero }
          }
        }
      })
      
      if (this.title) {
        opt.title = {
          text: this.title,
          left: 'center',
          top: '39%',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
          }
        }
      } 
      this.chart.setOption(opt)
    }
  },
  mounted () {

    
  }
}
</script>

<style scoped>
.chart {
  width: 500px;
  height: 500px;
}
</style>

<!-- <ChartPie 
          :width="350" 
          :height="232"
          :legend="['国家级','市级','其他']"
          :value="park"
          :color="['#7fd8ee', '#8abc48', '#4e92db']" /> -->