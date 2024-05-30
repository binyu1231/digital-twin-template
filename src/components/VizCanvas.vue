

<script>
/* eslint-disable */
import { defineComponent, onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import { noop, debounce, numberMax } from '@coloration/kit'
import { init } from 'echarts/lib/echarts'

export default defineComponent({
  name: 'i-viz-canvas',
  props: {
    renderer: {
      type: Function,
      default: noop
    },
    option: {
      type: Object,
      default: () => ({
        data: [],
        config: null,
        exOption: null
      })
    },
    isEhart: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3,
    }
  },
  setup (props, context) {
    const { root } = context
    const { isEhart, autoplay, interval } = props
    const canvasElement = ref(null)
    let timer = 0
    let instance = null

    function tick (index = -1) {
      if (autoplay && isEhart && instance) {
        
        const chartOption = instance.getOption()
        const series = chartOption.series || []
        const maxDataLength = Math.max(...series.map(s => s.data.length || 0))

        series.map((s, i) => {
          instance.dispatchAction({
            type: 'downplay',
            seriesIndex: i,
            dataIndex: index
          })

          instance.dispatchAction({
            type: 'highlight',
            seriesIndex: i,
            dataIndex: (index + 1) % maxDataLength
          })
        })

        index = (index + 1) % maxDataLength

        clearTimeout(timer)
        timer = setTimeout(() => {
          tick(index)
        }, interval * 1000)
        // instance.dispatchAction()
      }
    }

    const resize = debounce(30, function () {
      if (!instance) return
      instance.resize()
      context.emit('resize', { echart: instance, element: canvasElement.value }, props.option)
    })

    const render = debounce(30, () => {
      if (!canvasElement.value || (props.isEhart && !instance)) return
      nextTick(() => {
        props.renderer({ echart: instance, element: canvasElement.value }, props.option)
        
        tick()
      })
    })
    

    onMounted(() => {
      instance = isEhart ? init(canvasElement.value) : null

      const obj = { echart: instance, element: canvasElement.value }
      window.addEventListener('resize', resize)
      
      context.emit('mounted', obj, props.option)
      render()


      
    })
    
    watch(() => props.renderer, render)
    watch(() => props.option, render)

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resize)
      clearTimeout(timer)
    })

    return {
      canvas: canvasElement
    }
  }
})
</script>
<template>
  <div 
    v-bind="$attrs"
    ref="canvas" 
    class="i-viz-canvas" />
</template>
<style>
.i-viz-canvas {
  /* window 下会出滚动条 */
  overflow: hidden;
  width: 100%;
  height: 100%;
  flex: 1;
}

/* 防止选中echarts tooltip */
.i-viz-canvas > div:nth-child(0) {
  width: 100% !important;
  height: 100% !important;
}
</style>
