<template>
<div class="analy-compant-force">
  <p class="tip">注：每个点代表{{ companyPerDot }}家公司</p>
  <div ref="graphforce" class="chart"></div>
</div>
</template>

<script>
import { chartUtil, Chart } from '../../charts'
import _ from 'lodash'

const { NEED_SET } = chartUtil



const colors = [
  '#84a2d4', '#83ccd2', '#00a3af', '#2ca9e1', '#0061dc',
  '#4c6cb3', '#706caa', '#884898', '#a8c97f', '#3eb370'
]

const option = {
  backgroundColor: 'transparent',
  legend: {
    bottom: 50,
    itemWidth: 13,
    itemHeight: 13,
    data: NEED_SET,
    textStyle: { fontSize: 12, color: '#cecbcb' }
  },
  cursor: 'default',
  series: [{
      type: 'graph',
      layout: 'force',
      animation: false,
      label: {
        show: false
      },
      // silent: true, // 交互
      symbolSize: 12,
      grid: { top: 5, containLabel: true },
      draggable: true,
      data: NEED_SET,
      categories: NEED_SET,
      force: {
          // initLayout: 'circular'
          // repulsion: 20,
          edgeLength: 5,
          repulsion: 30,
          gravity: 0.12
      },
      links: NEED_SET,
      itemStyle: {
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowBlur: 10
      },
      lineStyle: { width: 0 }
  }]
}

export default {
  mixins: [ Chart ],
  props: {
    legend: Array,
    value: Array
  },
  data () {
    return {
      companyPerDot: 100
    }
  },
  methods: {
    init () {
      this.chart = this.chart || this.$echarts.init(this.$refs.graphforce, 'dark')
      const categories = this.legend.map((l, i) => ({ name: l, itemStyle: { color: colors[i]} }))
      const companyNum = _.sum(this.value) + ''
      
      const headNum = parseInt(companyNum[0])
      const numLength = companyNum.length - 3
      
      // len = len < 0 ? 0 : len
      this.companyPerDot = Math.pow(10, numLength) * Math.ceil(headNum / 2)
      this.companyPerDot = this.companyPerDot <= 1 ? 1 : this.companyPerDot

      let data = _.map(this.value, (number, i) => {
        return _.map(new Array(Math.ceil(number/this.companyPerDot)), (_, j) => ({
          id: `${i}|${j}`,
          name: this.legend[i], // 移上去显示的名字
          value: 1,
          category: this.legend[i],
        }))
      })

      data = _.flatten(data) // 减少以及嵌套
      const cache = {}
      let links = []
      data.map(d => {
        if (d.category in cache) links.push({source: cache[d.category], target: d.id })
        else {
          cache[d.category] = d.id
        }
      })

      const dataLength = data.length
      let randomLinks = _.map(new Array(parseInt(dataLength / 10)), ($, i) => {
        const source = data[_.random(dataLength - 1)].id
        const target = data[_.random(dataLength - 1)].id
        return {source, target }
      })


      links = _.concat(links, randomLinks)

      const opt = _.cloneDeep(option)
      opt.series[0].data = data
      opt.series[0].links = links
      opt.series[0].categories = categories
      opt.legend.data = this.legend.map(l => ({  name: l, icon: 'circle' }))
      
      this.chart.setOption(opt)
    }
  },
  mounted () {
  }
}
</script>

<style lang="postcss">
.analy-compant-force {
  width: 100%;
  height: 100%;
  display: flex; flex-direction: column;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("../../../assets/image/analy-company-bg.png");
  & .chart {
    flex: 1;
  }

  & .tip {
    font-size: 12px;
    padding: 27px 23px 0;
    margin-bottom: -45px;
  }
}
</style>
