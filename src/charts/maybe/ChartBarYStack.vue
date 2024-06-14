<template>
<div class="chart-base">
  <div ref="chart" :style="{ width: width + 'px', height: height + 'px'}"></div>
</div>
</template>

<script>
import _ from "lodash";
import { NEED_SET, calcColor, bgColor } from "./util";
import Chart from "./Chart";

const option = {
  title: {
    left: "center",
    textStyle: { fontSize: 16, fontWeight: "normal" }
  },
  legend: {
    bottom: 10,
    itemWidth: 20,
    itemHeight: 6,
    textStyle: {
      color: "#cecbcb",
      fontSize: 12
    }
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
    type: "value",
    position: "top",
    axisTick: {},
    splitNumber: 3,
    axisLine: { lineStyle: { color: "white" } },
    splitLine: { show: false }
  },
  yAxis: {
    type: "category",
    inverse: true,
    axisTick: { show: false /* alignWithLabel: true */ },
    data: NEED_SET,
    axisLine: { lineStyle: { color: "white" } }
  },
  grid: {
    left: "15%",
    top: "7%",
    right: "20%",
    bottom: "15%",
    containLabel: true
  },
  series: NEED_SET
};
export default {
  mixins: [Chart],
  props: {
    width: Number,
    height: Number,
    legend: Array,
    value: Array,
    color: Array,
    category: Array,
    title: { type: String, default: "" },
    measures: { type: String, default: "" },
    mergeOption: { type: Object, default: null },
    afterMerge: Function
  },
  data() {
    return {
      option: _.merge({}, option)
    };
  },
  methods: {
    init() {
      this.chart = this.$echarts.init(this.$refs.chart, "dark");

      const optColor = this.color.map(c => calcColor(c, 2));
      const opt = _.merge({}, this.option, this.mergeOption);

      opt.title.text = this.title;
      opt.legend.data = this.legend;
      opt.yAxis.data = this.category;

      opt.series = this.value.map((vals, i) => ({
        type: "bar",
        stack: "总量",
        barWidth: 6,
        name: this.legend[i],
        color: calcColor(this.color[i], 2),
        data: vals
      }));

      if (this.afterMerge) this.afterMerge(opt);

      this.chart.setOption(opt);
    }
  },
  mounted() {}
};
</script>

<!-- <ChartBarYStack 
      :width="400"
      :height="400"
      :legend="['发明专利', '实用新型', '外观设计']"
      :color="[
        ['#e4d245', '#f4ea9a'], 
        ['#25ad6b','#29eba5'],
        ['#1d81c8','#60d0f5'],
      ]"
      :value="coreMemberValue"
      :category="coreMemberNames" 
      scrollLoad
    /> -->