<template>
<div class="graphforce" :class="fullscreen && 'fullscreen'">
  <span v-if="fullscreen" @click="expend" class="close"></span>
  <span v-else @click="expend" class="expand"></span>
  <div ref="graphforce" class="chart"></div>

  <div class="bottom-bar">
    <div class="left">
      <div>
        <span>弱</span>
        <i></i>
        <span>强</span>
      </div>
      <span>专利强度</span>
    </div>
    <div v-show="hasScaled">
      <svg width="160" height="30" style="margin-bottom: 6px;">
        <path stroke="white" fill="none" d="M 0 0, A 5 1 0 0 0, 160 15"/>
      </svg>
      <span>关系</span>
    </div>
    <div class="right">
      <div>
        <span>少</span>
        <i style="font-size: 13px;"></i>
        <i style="font-size: 19px;"></i>
        <i style="font-size: 26px;"></i>
        
        <span>多</span>
      </div>
      <span>专利数量</span>
    </div>
  </div>
</div>
</template>

<script>
import { chartUtil } from '../../charts'
import 'echarts'
import _ from 'lodash'
import * as d3 from 'd3'
import { generateForceSerie } from './force'

const colorStart = [125, 179, 202]
const colorEnd = [14, 95, 129]
const range = _.zipWith(colorStart, colorEnd, (a, b) => a - b)
const getColor = (ratio) => {
  const color = _.zipWith(colorStart, _.map(range, n => parseInt(ratio * n)), (a, b) => a - b)
  return color

}

const rootName = 'ROOT'
const scaleRatio = 50
// 生成结构，使所有项都包含到 ROOT 中
const formart = d3.stratify().parentId((d, i) => i === 0 ? '' : rootName)
const showFalse = { show: false }
const axisDefault = { 
  axisLine: showFalse,
  axisTick: showFalse,
  axisLabel: showFalse,
  splitLine: showFalse
}

const option = {
  backgroundColor: 'transparent',
  xAxis: axisDefault,
  yAxis: axisDefault,
  tooltip: { show: false },
  // visualMap: [{
  //   orient: 'horizontal',
  //   id: 'CHART_VISUALMAP',
  //   left: 5,
  //   bottom: 45,
  //   min: 0,
  //   max: 100,
  //   realtime: false,
  //   inRange: { color: ['#a4e1f0',  '#73b8cc',  '#418ea7', '#287794', '#0e5f81' ] },
  //   text:['强','弱'],           // 文本，默认为数值文本
  //   calculable: false,   // 显示拖拽用的手柄
  //   itemWidth: 10, // 条的高度
  //   itemHeight: 130,           // 条的宽度
  //   hoverLink: false,
  // }],
  series: [{
    type: 'custom',
    left: 10,
    renderItem: chartUtil.NEED_SET,
    encode: {
        tooltip: 0,
        itemName: 2
    },
    data: chartUtil.NEED_SET
  }]
}

export default {
  data () {
    return {
      
      fullscreen: false,

      option: {},
      techData: null,
      maxScore: 0,
      hasScaled: false,
      lastScaleIdx: -1,
      rootData: {},
      scaleCenter: [],
    }
  },
  props: {
    areaId: [String, Number],
    chainId: [String, Number]
  },

  watch: {
    areaId () { this.init() },
    chainId () { this.init() }
  },
  methods: {
    expend () {
      this.fullscreen = !this.fullscreen
      this.$nextTick(() => {
        // 全屏只更新底层的圆 不更新上面的技术人员cicle
        this.chart.resize()
        this.renderData(this.lastScaleIdx)
        if (this.techData) {
          this.chart.setOption(this.renderForce(this.option, this.techData))
        }
      })
    },
    init () {
      const params = { areaId: this.areaId, chainId: this.chainId }
      
      return this.$ask('/industryanalysis/technologychain/patentgraph', params)
      .then(data => {

        this.option = {}
        this.techData = null
        this.maxScore = 0
        this.hasScaled = false
        this.lastScaleIdx = -1
        this.rootData = {}
        this.scaleCenter = []
        
        const raw = _.concat(
          { id: rootName, value: '' }, // 最外层的圈
          _.map(data, d => {
            const score = d.patentScore
            if (score > this.maxScore) this.maxScore = score
            return { 
              id: d.instName, value: '' + d.patentNum, value2: score
            }
          })
        )
        
        this.rootData = formart(raw).sum(d => d.value)
        this.hasScaled = false // 重置缩放
        this.renderData()
        
      })
    },
    renderData (scaleIdx) {
        // 选中放大
      if (scaleIdx !== undefined) {
        const scaleChild = this.rootData.children[scaleIdx - 1]
        scaleChild.value = parseInt(scaleChild.value) * scaleRatio + '' 


        if (this.hasScaled) {
          const lastScaleChild = this.rootData.children[0]
          lastScaleChild.value = parseInt(lastScaleChild.value) / scaleRatio + '' 
        }

        this.lastScaleIdx = 1
        this.hasScaled = true
      }
      
      this.rootData.sort((a, b) => b.value - a.value) // 不排序随机画， 排序大的在中间

      // console.log(this.rootData)
      // const maxDepth = 2
      const seriesData = this.rootData.descendants().map(node => [ node.value, node.depth, node.id ])
      // const pieces = _.map(Array(maxDepth), (un, i) => ({value: i, label: 'Level ' + i}))

      const opt = _.cloneDeep(option)
      

      // opt.visualMap.pieces = pieces
      opt.series[0].data = seriesData
      opt.series[0].renderItem = this.renderItem

      // if (techSeries) opt.series[1] = techSeries
      // else {
      //   this.chart.clear()
      // }

      this.chart.clear()
      this.chart.setOption(opt)
      this.option = opt
      return Promise.resolve(opt)
    },

    renderForce (opt, data) {
      
      const serie = generateForceSerie(data)
      if (serie === null) {
        // 防止全屏化重新渲染
        this.techData = null
        return
      }
      const [x, y, r] = this.scaleCenter
      const reduceR = Math.sqrt(r) + 50
      serie.left = x - r + reduceR
      serie.top = y - r + reduceR
      serie.width = serie.height = (r - reduceR) * 2

      opt.series[1] = serie
      this.chart.setOption(opt)
      this.techData = data
      this.option = opt
    },
    // echarts custom renderItem
    
    renderItem(params, api) {
      // const isScaleItem = this.hasScaled && params.dataIndex === 1
      const context = params.context

      if (!context.layout) {
    
        d3.pack()
        .size([api.getWidth() - 2, api.getHeight() - 2])
        .padding(3)(this.rootData) //指定相邻结点之点的间距(近似值).
        context.layout = {}
        this.rootData.descendants().forEach((node, i) => {
          // 第0个是最外层的隐藏圆
          // 第一个是应该放大的圈
          if (i === 1 && this.hasScaled) {
            this.scaleCenter = [node.x, node.y, node.r]
          }

          context.layout[node.id] = {
            x: node.x,
            y: node.y,
            r: node.r,
            value2: node.data.value2,
            isLeaf: node.id !== rootName
          }
        })
      }

      const nodePath = api.value(2)
      const itemLayout = context.layout[nodePath]

      let nodeName = ''
      const textFont = api.font({ fontSize: 12, fontFamily: 'Arial' })

      // 切显示文字
      if (itemLayout.isLeaf && itemLayout.r > 10) {
        nodeName = nodePath.substring(0, Math.round(itemLayout.r / 6)) //echarts.format.truncateText(nodePath, itemLayout.r, textFont, '.');
      }
      const rgb = 'rgba(' + getColor(itemLayout.value2 / this.maxScore).join(',')

      const color = {
            type: "radial", x: 0.5, y: 0.5, r: 0.5,
            colorStops: [
              { offset: 0, color: rgb + ', 0.2)' }, 
              { offset: 0.2, color: rgb + ', 0.3)' }, 
              { offset: 0.8, color: rgb + ', 0.7)' }, 
              { offset: 1, color: rgb + ', 1)' }
            ],
            globalCoord: false // 缺省为 false
        }
      return {
        type: 'circle',
        shape: { cx: itemLayout.x, cy: itemLayout.y, r: itemLayout.r },
        z2: api.value(1) * 2,
        style: api.style({
          stroke: itemLayout.isLeaf ? '#3f778e' : 'transparent',
          lineWidth: 2,
          text: nodeName,
          textFont: textFont,
          textPosition: 'inside',
          fill:itemLayout.isLeaf ? 
            color :
              'transparent'
        }),
        // styleEmphasis: api.style({
        //   text: nodeName,
        //   textPosition: 'inside',
        //   textFont: textFont,
        //   stroke: 'rgba(0,0,0,0.5)',
        //   lineWidth: 3
        // })
      }
    },
  },
  mounted () {
    this.chart = this.chart || this.$echarts.init(this.$refs.graphforce, 'dark')
    this.init()
    .then(() => {
      this.chart.on('click',  (params) => {
        // console.log(params.dataIndex, this.lastScaleIdx)
        if (params.seriesIndex === 1) return 

        if (this.lastScaleIdx === params.dataIndex) {
          // empty
        }
        else {
          this.renderData(params.dataIndex)
          .then(lastOption => {
            this.$ask('/industryanalysis/technologychain/patentgraphdetail', { instName: params.name})
            .then(data => this.renderForce(lastOption, data))
          })
        }
        
        
        
      })
    })
  }
}
</script>

<style lang="postcss">
.graphforce {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex; flex-direction: column;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("../../../assets/image/galaxy-bg.png");
 
  & .chart {
    position: absolute; width: 100%; height: 100%;
  }
  & .tip {
    font-size: 12px;
    padding: 27px 23px 0;
    margin-bottom: -45px;
  }

  & .close {
    position: absolute; cursor: pointer;
    right: 200px; top: 20px; 
    width: 40px; height: 40px;
    z-index: 300;

    background-size: cover;
    background-image: url("../../../assets/image/mapicon-back.png");
  }

  & .expand {
    position: absolute; cursor: pointer;
    right: 20px; top: -28px; width: 20px; height: 20px;
    background-image: url("../../../assets/image/icon-fullscreen.png");
  }

  &.fullscreen {
    position: fixed; z-index: 200;
    left: 0; top: 0; right: 0; bottom: 0;
    background-size: cover;

    & .bottom-bar {
      right: 20px; left: auto;
      width: 160px;
      flex-direction: column;
      justify-content: flex-end;

      & > * {
        margin-top: 30px;
      }
    }
    
  }
  & .bottom-bar {
    position: absolute; z-index: 2; bottom: 0; left: 0; right: 0;
    display: flex; justify-content: space-between; align-items: flex-end;
    font-size: 12px; margin-bottom: 25px;

    & > div {
      width: 180px; display: flex; flex-direction: column;
      align-items: center;

      & div { 
        width: 120px; margin-bottom: 6px;
        display: flex; align-items: center; justify-content: space-between;
      }
    }
  
    & .left {
      & div {
         width: 160px; 
      }

      & i {
        width: 120px; height: 6px;
        background-image: linear-gradient(-86deg, 
        #0e5f81 0%, 
        #287794 25%, 
        #418ea7 49%, 
        #73b8cc 75%, 
        #a4e1f0 100%);
      }
    }
    & .right {
      & i {
        width: 1em; height: 1em; border-radius: 50%; display: block;
        background-color: #b3eefa;
      }
    }
  }
}
</style>
