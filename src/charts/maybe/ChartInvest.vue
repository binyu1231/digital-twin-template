<template>
<div class="chart-base">
  <div ref="chart" :style="{ width: width + 'px', height: height + 'px'}"></div>
</div>
</template>

<script>
import _ from "lodash";
import { NEED_SET, calcColor, bgColor } from "./util";
import Chart from "./Chart";




const normalSeries = {
  name: NEED_SET, // legend 什么轮
  itemStyle: { color: NEED_SET }, // 每一轮的颜色
  data: NEED_SET,
  type: "bar",
  stack: "总量", // 决定条形堆叠
  barWidth: 10,
  label: { color: "rgba(255, 255, 255, .6)" }
};

const option = {
  legend: {
    // backgroundColor: 'transparent',
    data: NEED_SET, // legend
    width: '100%',
    bottom: 15,
    right: 10,
    left: 10,
    itemGap: 4,
    itemWidth: 16,
    itemHeight: 8,
    textStyle: { color: "rgba(241, 247, 249, .6)", fontSize: 10 }
  },
  yAxis: {
    data: NEED_SET, // 项目名
    type: "category",
    inverse: true,
    axisLabel: { color: "#bae4ef" },
    axisLine: { lineStyle: { color: "rgba(255, 255, 255, .6)" } },
    axisTick: { show: false }
  },
  series: NEED_SET,
  xAxis: { 
    show: true,
    position: 'top',
    // offset: 10,
    axisLabel: { color: "#bae4ef", /*formatter: value => Math.pow(value, 2)*/ },
    axisLine: { lineStyle: { color: "rgba(255, 255, 255, .6)" }, },
    splitLine: { show: false },
  },
  backgroundColor: bgColor,
  tooltip: { 
    show: true,
    trigger: 'axis',
    axisPointer: {
      lineStyle: {
        color: '#3383e8',
        type: 'dashed'
      }
    },
  },
  grid: {
    left: "6%",
    right: "10%",
    top: "5%",
    bottom: "10%",
    containLabel: true
  }
};
export default {
  mixins: [Chart],
  props: {
    width: Number,
    height: Number,
    legend: Array,
    value: Array,
    color: Array,
    yData: Array,
    title: { type: String, default: "" },
    measures: { type: String, default: "" },
    mergeOption: { type: Object, default: null }
  },
  data () {
    return {
      option: _.merge({}, option)
    };
  },
  methods: {
    init () {
      this.chart = this.$echarts.init(this.$refs.chart, "dark")

      const opt = _.merge({}, this.option, this.mergeOption)
      // 轮次
      opt.legend.data = this.legend
      opt.yAxis.data = this.yData

      opt.tooltip.formatter = l => {
        return `<div style="padding: 8px 14px 8px 10px;">${l[0].name}(万美元)` + _.map(l, (p) => {
          return `<div style="display: flex; align-items: center;">
              <p style="background-color: ${p.color};  width: 20px; height: 8px; border-radius: 4px; margin-right: 4px"><p/>
              <p>${p.seriesName}:&nbsp${p.data.value /*this.value[p.dataIndex][p.seriesIndex]*/}</p>
          </div>`
        }).join('') + '</div>'
      }

      opt.series = this.legend.map((l, i) => {
        const s = _.merge({}, normalSeries)
        s.name = l
        s.itemStyle.color = calcColor(this.color[i], 2)
        // ydata 产业链

        s.data = this.yData.map((col, j) => {

          const val = this.value[j][i]
          // const sqrt = Math.sqrt(val)

          return {
            value: val,
            // 需求修改 label 不显示
            // label: { show: true, position: "top", color: "#fff", formatter: l => val === 0 ? '' : val },
            itemStyle: {
              barBorderRadius:
                i === 0
                  ? [5, 0, 0, 5]
                  : i === this.legend.length - 1 ? [0, 5, 5, 0] : 0
            }
          }
        })
        return s
      });
      this.chart.setOption(opt)
    }
  },
  mounted () {}
};
</script>

<style lang="postcss">
.chart-invest {
  & .tooltip {

  }
}


</style>

<!-- <ChartInvest
    :width="690"
    :height="572"
    :legend="rotation.stage"
    :color="[
        '#643dcc', '#9951ab', '#2761bf', '#2f85fc', '#00a3af', 
        '#47cfde', '#4cce80', '#d39063', '#e6b422', '#fad60f'
      //['#643dcc', '#6865d3', '#6c8dda'],
      //['#557bdc', '#53a5dc', '#50cedc'],
      //['#5ab1cf', '#7ec598', '#a1d860'],
      //['#97c390', '#b2bc76', '#cdb55b'],
      //['#cc9078', '#dc9146', '#ec9214'],
      //['#5ab1cf', '#7ec598', '#a1d860'],
      //['#97c390', '#b2bc76', '#cdb55b'],
      //['#cc9078', '#dc9146', '#ec9214'],
      //['#557bdc', '#53a5dc', '#50cedc'],
    ]" 
    :y-data="rotation.chain"
    :value="rotation.data"
    :scrollLoad="scrollLoad"
  /> -->