<template>
<div>
  <div ref="areastack" :style="{ width: width + 'px', height: height + 'px' }"></div>
</div>
</template>

<script>
import _ from 'lodash'
import { chartUtil, Chart } from '../charts'
const { NEED_SET, calcColor } = chartUtil

const normalSerie = {
  name: NEED_SET, // legend
  data: NEED_SET, // 数据
  color: NEED_SET, // 线上点的颜色
  areaStyle: { color: NEED_SET }, // 线下区域的颜色
  lineStyle: { color: NEED_SET, width: 3 }, // 线的颜色
  type:'line',
  symbolSize: 6,
  itemStyle: {
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowBlur: 2
  },
  smooth: true,
}

const option = {
  series : NEED_SET, // 图表详情 详见 normalSerie
  legend: { bottom: 0, right: 13, data: NEED_SET }, // legend
  xAxis : {
    type : 'category',
    boundaryGap : false,
    data : NEED_SET,          // x轴坐标名称
    axisTick: { show: false },
    axisLine: { lineStyle: { color: '#171e31' } }
  },
  yAxis : {
    name: NEED_SET,           // y轴度量衡
    type : 'value',
    nameGap: 20,
    boundaryGap: ['0%', '20%'],
    axisTick: { show: false },
    splitLine: { lineStyle: { type: 'solid', color: '#171e31' } },
    axisLine: { lineStyle: { color: '#171e31' } },
    nameTextStyle: { padding: [0, 25, 0, 0] },
  },
  title: { 
    left: 'center', 
    textStyle: { fontSize: 16, fontWeight: 'normal' }
  },
  backgroundColor: 'transparent',
  tooltip : { trigger: 'axis' },
  grid: { left: '3%', right: '4%',top: '25%', bottom: '20%', containLabel: true },
}
export default {
  mixins: [ Chart ],
  props: { 
    width: Number, 
    height: Number,
    legend: Array,
    value: Array,
    color: Array, // 第一个取点和线的颜色，第二个之后是区域的颜色
    xData: Array,
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
      this.chart = this.$echarts.init(this.$refs.areastack, 'dark')
      const opt = _.merge({}, this.option, this.mergeOption)

      opt.title.text = this.title
      opt.legend.data = this.legend
      opt.xAxis.data = this.xData
      opt.yAxis.name = this.measures
      opt.series = this.legend.map((l, i) => _.merge({}, normalSerie, {
        name: l,
        color: this.color[i][0],
        lineStyle: { color: this.color[i][0] },
        areaStyle: { color: calcColor(this.color[i].slice(1)) },
        data: this.value[i],
      }))

   
      this.chart.setOption(opt)
    }
  },


  mounted () {
    
  }
}
</script>

<!-- <ChartArea title="融资笔数发展趋势" 
        :width="500"
        :height="320"
        :legend="trend.legend"
        :color="trend.color"
        :value="trend.investNum"
        :x-data="trend.categories"
        measures="笔"
        scrollLoad /> -->