<template>
<div class="dia-map">
  <div class="location" v-text="areaName"></div>
  <div class="back" @click="back" v-show="currentIndex != -1"></div>
  <div ref="map" class="chart"></div>
</div>
</template>

<script>
import axios from 'axios'
import { NEED_SET, Chart } from '../charts'

let currentTooltip = ''

const option = {
  backgroundColor: 'transparent',
  tooltip: {
    show: true,
    backgroundColor: 'transparent',
    formatter: () => currentTooltip,
    position: point => {
      point[0] += 20
      point[1] -= 10
      return point
    }
  },
  series: [
  {
    name: 'selected',
    type: 'map',
    zoom: 1.15,
    // selectedMode: 'single',
    
    mapType: NEED_SET,
    label: {
      position: 'top',
      show: true,
      fontSize: 16,
      color: '#e1edef',
    },
    itemStyle: {
      areaColor: '#0f3349',
      borderColor: '#71c2d9',
      borderWidth: 2
    },
    emphasis: {
      label: { color: '#f1f1f1' },
    },
    data: NEED_SET,
  }, 
  ]
}
export default {
  mixins: [ Chart ],
  props: {
    width: Number,
    height: Number,
    onHover: Function,
    onSelect: Function,
    areaLegend: Array,
    areaId: Array,
    mapJsonUrl: String,
    toolTip: String,
    hideLegend: Array
  },
  data () {
    return {
      initSelf: true,
      areaName: '北京',
      currentIndex: -1,
    }
  },
  watch: {
    toolTip (newVal) {
      currentTooltip = this.toolTip
    }
  },

  methods: {
    init () {
      const opt = _.cloneDeep(option)
      opt.series[0].label.formatter = (l) => {
        return _.includes(this.hideLegend, l.name) ? '' : l.name
      }
      opt.series[0].mapType = this.mapJsonUrl
      opt.series[0].data = this.areaLegend.map((city, i) => ({
        name: city, value: this.areaId[i]
      }))
      this.chart.setOption(opt)

      return opt
    },
    back () {
      this.areaName = '北京'
      this.onSelect && this.onSelect(301001)

      this.chart.dispatchAction({
        type: 'mapUnSelect',
        dataIndex: this.currentIndex,
      })

      this.currentIndex = -1
    }
  },
  mounted () {
    axios.get(this.mapJsonUrl)
    .then((res) => res.data)
    .then(mapGeoJson => {
      this.$echarts.registerMap(this.mapJsonUrl, mapGeoJson)
      this.chart = this.$echarts.init(this.$refs.map, 'dark')

      const opt = this.init()

      let currentIndex = 0
      const actionHandler = (params, callback) => {
        const index = params.dataIndex
        if (params.seriesIndex !== 0 || index === this.currentIndex) return
        this.chart.dispatchAction({
            type: 'mapUnSelect',
            seriesIndex: params.seriesIndex,
            dataIndex: this.currentIndex,
        })
        this.chart.dispatchAction({
          type: 'mapSelect',
          seriesIndex: params.seriesIndex,
          dataIndex: index,
        })
        this.currentIndex = index

        this.areaName = params.name

        this.onSelect && this.onSelect(params.value)
      }

      this.chart.on('click', actionHandler)

      let hoverIndex = -1
      this.chart.on('mousemove', params => {
        const index = params.dataIndex
        if (params.seriesIndex !== 0 || index === hoverIndex) return
        hoverIndex = index
        this.onHover && this.onHover(params.value)
      })
    })
   
  }
}
</script>

<style lang="postcss">

.dia-map {
  position: relative;
  background-image: url("../../assets/image/map-bg.png");

  & .chart {
    width: 100%; height: 100%;
  }

  & .back {
    position: absolute; z-index: 1; cursor: pointer;
    right: 0; top: 36px;
    width: 40px; height: 40px;
    background-size: cover;
    background-image: url("../../assets/image/mapicon-back.png");
  }

  & .location {
    position: absolute;
    left: 30px; top: 40px; 
    height: 28px; line-height: 28px; padding-left: 24px;
    font-size: 16px;
    background-repeat: no-repeat;
    background-position: left center;
    background-image: url('../../assets/image/mapicon-location.png');
  }
}



.map-alert-tip {
  width: 427px; height: 145px; bottom: 35px; left: -235px;
  box-sizing: border-box;
  position: absolute;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("../../assets/image/map-alert-bg.png");
  display: flex; align-items: center;  text-align: center;
  justify-content: space-between; padding: 0 61px 33px 38px;
  font-size: 12px;

  & .count {
    font-size: 14px; 
  }

  & .count {
    color: #e6ce2e;
  }

  & .measure {
    color: #84c9d9;
  }
}


.richbg {
  display: none;
}
</style>
