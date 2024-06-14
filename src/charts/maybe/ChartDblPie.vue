<template>
<div>
  <div ref="doughnut" :style="{ width: width + 'px', height: height + 'px' }"></div>
</div>
</template>

<script>
import _ from 'lodash'
import { Chart, chartUtil } from '../charts'
const { NEED_SET } = chartUtil
import { splitThousand } from '../../util/tool'

let selectedIndex = 0
const cicleCenter = ['50%', '43%']

const option = {
  backgroundColor: 'transparent',
  legend: {
    bottom: 0,
    itemWidth: 12,
    itemHeight: 12,
    borderRadius: 6,
    textStyle: { color: '#ccc' },
    data: NEED_SET,
  },
  color: NEED_SET, // [[ 1, 2 ], [3]] => [1,2,3]
  series: [{
    type:'pie',
    radius: ['27%', '40%'],
    center: cicleCenter,
    label: { show: false },
    selectedOffset: 0,
    data: NEED_SET,
  },{
    type:'pie',
    radius: ['50%', '65%'],
      center: cicleCenter,
    label: { formatter: l => splitThousand(l.value) },
    data: NEED_SET,
  }]
}

export default {
  mixins: [ Chart ],
  props: {
    width: Number, 
    height: Number,
    legend: Array,
    color: Array,
    innerValue: Array,
    outerValue: Array
  },
  watch: {
    ['innerValue'] () {
      this.init()
    },
    ['outerValue'] () {
      this.init()
    },
  },
  methods: {
    init () {
      this.chart = this.$echarts.init(this.$refs.doughnut, 'dark')
    
      const opt = _.merge({}, option)
      opt.legend.data = _.flatten(this.legend).map(l => ({ name: l, icon: 'circle' }))
      opt.color = _.flatten(this.color)
      
      opt.series[0].data = this.innerValue.map((val, i) => ({
        name: this.legend[0][i],
        value: Math.sqrt(val) 
      }))

      opt.series[1].data = this.outerValue.map((val, i) => ({
        name: this.legend[1][i], 
        value: val
      }))

      this.chart.setOption(opt)
    }
  },
  mounted () {
    

    // this.chart.on('click', (params) => {
    //   if (params.seriesIndex === 0 && !params.data.selected) {
    //     selectedIndex = params.dataIndex
    //     renderChart()
    //   }
    // })
  }
}
</script>
