<template>
<div 
  class="sk-progress-list-item" 
  v-bind="$attrs"
  :style="{ color: currentColor }">
  <div class="sk-progress-list-item__progress"
    :style="{ 
      background: bg,
      width: percent
    }"
   />
  <div class="sk-progress-list-item__content">
    <div class="sk-progress-list-item__sign" />
    <div class="sk-progress-list-item__name"><slot>{{ name }}</slot></div>
    <div v-if="valueVisible" class="sk-progress-list-item__value">
      <Count :end-val="value"/>
    
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
// import { color } from 'd3-color'
import Count from './Count.vue'
export default defineComponent({
  name: 'i-progress-list-item',
  components:{ Count },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
    },
    name: {
      type: String,
      default: '--',
    },
    value: {
      type: [Number],
      default: 1
    },
    color: {
      type: String,
      require: true
    },
    min: {
      type: Number,
      default: 0,
    },
    valueVisible: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const percent = computed(() => {
      const max = props.max || props.value || 1
      const value = props.value / max
      const formatValue = value < props.min ? props.min : value
      return Math.floor(formatValue * 100) + '%'
    })


    const colorList = [
      '#FD2323',
      '#FFE431',
      '#FF7A31',
      '#51DEFF',
      '#FFE431',
    ]

    const currentColor = computed(() => {
      return colorList[props.index % colorList.length]
    })

    const bg = computed(() => {
      // const bg = color(currentColor.value)
      // if (!bg) return currentColor.value
      // bg.opacity = 0.2
      // const start = bg.formatRgb()
      // bg.opacity = 0.6
      // const end = bg.formatRgb()
      return `linear-gradient(to right, ${'#000'}, ${'#000'})`
    })

    return {
      percent, bg, currentColor
    }
  }
})
</script>
<style>
.sk-progress-list-item {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  position: relative;
}


.sk-progress-list-item__sign {
  width: 0;
  height: 0;
  border: 0.4em solid transparent;
  border-left-color: currentColor; 
  border-left-width: 0.6em;
  margin-left: 0.78em;
  margin-right: 1.43em;
}

.sk-progress-list-item__content,
.sk-progress-list-item__progress {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.sk-progress-list-item__content {
  display: flex;
  align-items: center;
}


.sk-progress-list-item__name {
  color: #fff;
  flex: 1;
}

.sk-progress-list-item__value {
  margin-right: 1.5em;
  color: #fff;
}


</style>