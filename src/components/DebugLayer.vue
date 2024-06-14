<script lang="ts" setup>
import { defineOptions } from 'vue'
import { useLocalStorage, useClipboard, useDraggable } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { remToPx, pxToRem } from '../utils'


const tooltipPosition: Record<string, any> = {
  'left-top': { left: 'auto', top: '-2px', right: '-26rem', bottom: 'auto' },
  'left-bottom':  { left: '-2px', top: '-6rem', right: 'auto', bottom: 'auto' },
  'right-top':  { left: '-26rem', top: '-2px', right: 'auto', bottom: 'auto' },
  'right-bottom':  { left: 'auto', top: '-6rem', right: '-2px', bottom: 'auto' },
}

const ICON_SIZE = 30 // px
defineOptions({ name: 'debug-layer' })

withDefaults(defineProps<{
  enable: boolean
}>(), {
  enable: false
})


const info = useLocalStorage('DEBUG_LAYER_STORE', {
  left: 0, top: 0, width: 25, height: 15, visible: false
})

const { copy } = useClipboard()
const windowRef = ref<HTMLElement>()
const expandRef = ref<HTMLElement>()
const  dragExpandRef = ref<HTMLElement>()
const tooltipStyle = ref(Object.assign({}, tooltipPosition['left-top']))
const { x: leftPx, y: topPx } = useDraggable(windowRef, {
  initialValue: {
    x: remToPx(info.value.left),
    y: remToPx(info.value.top),
  },
})

const { x: expandXPx, y: expandYPx, style: expandDrag } = useDraggable(expandRef, {
  initialValue: {
    x: remToPx(info.value.width),
    y: remToPx(info.value.height)
  }
})

const layerStyle = ref({
  left: leftPx.value + 'px',
  top: topPx.value + 'px'
})

const expandStyle = ref({
  left: expandXPx.value - ICON_SIZE + 'px',
  top: expandYPx.value - ICON_SIZE + 'px'
})

const boxStyle = ref({
  width: expandXPx.value + 'px',
  height: expandYPx.value + 'px'
})



watchEffect(() => {
  layerStyle.value.left = leftPx.value + 'px'
  layerStyle.value.top = topPx.value + 'px'
  const halfWidth = document.documentElement.offsetWidth / 2
  const halfHeight = document.documentElement.offsetHeight / 2

  let option = 
    (leftPx.value > halfWidth ? 'right' : 'left')
    + '-'
    + (topPx.value > halfHeight ? 'bottom' : 'top')

  Object.assign(tooltipStyle.value, tooltipPosition[option])
  
})

watch(expandDrag, () => {
  expandStyle.value.left = expandXPx.value - leftPx.value + 'px'
  expandStyle.value.top = expandYPx.value - topPx.value + 'px'

  boxStyle.value.width = Math.max(expandXPx.value - leftPx.value + ICON_SIZE, 0) + 'px'
  boxStyle.value.height = Math.max(expandYPx.value - topPx.value + ICON_SIZE, 0) + 'px'
})

const display = computed(() => {
  const val = info.value
  val.left = pxToRem(layerStyle.value.left)
  val.top = pxToRem(layerStyle.value.top)
  val.width = pxToRem(boxStyle.value.width)
  val.height = pxToRem(boxStyle.value.height)
  return {
    left: val.left + 'rem', 
    top: val.top + 'rem',
    width: val.width + 'rem',
    height: val.height + 'rem',
  }
})

const displayStr = computed(() => {
  const v: any = display.value
  const className = `left-[${v.left}] top-[${v.top}] w-[${v.width}] h-[${v.height}]`
  return className
})

function handleCopyClassName() {
  copy(displayStr.value)
}

function handleCopyJsonStyle() {
  copy(JSON.stringify(display.value))

}

function handleCopyAttrProp() {
  const v: any = display.value
  copy(`left="${v.left}" top="${v.top}" width="${v.width}" height="${v.height}"`)

}

function toggleVisible() {
  info.value.visible = !info.value.visible
}



</script>

<template>
  <div class="debug-layer" v-if="enable" :style="layerStyle">
    <!-- -->
    <div class="visible-btn" @click="toggleVisible()">
      <Icon v-if="info.visible" 
        icon="ant-design:eye-invisible-twotone" />
      <Icon v-else icon="ant-design:bulb-outlined" />
    </div>
    <div 
      class="opt-icon" 
      v-show="info.visible" 
      ref="expandRef"
      :style="expandStyle">
      <Icon ref="dragExpandRef" icon="ant-design:arrows-alt-outlined" />
    </div>
    <div 
      class="opt-box" 
      v-show="info.visible" 
      ref="windowRef"
      :style="boxStyle">
      <div class="opt-features" :style="tooltipStyle">
        <div class="info-display">
        {{ displayStr }}
        </div>
        <div class="flex gap-4 select-none">
          <GlassButton @click="handleCopyClassName">
            Copy Class
          </GlassButton>
          <GlassButton @click="handleCopyJsonStyle">
            Copy JSON
          </GlassButton>
          <GlassButton @click="handleCopyAttrProp">
            Copy Attr
          </GlassButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.debug-layer {
  @apply 
    fixed
    z-10000;
}

.visible-btn {
  @apply 
    absolute
    w-6
    h-6
    rounded-full
    bg-white
    bg-op-30
    flex
    items-center
    justify-center
    z-1
    cursor-pointer
    text-sm
    select-none
    ;
}

.opt-box {
  @apply
    absolute
    left-0
    top-0
    w-100
    h-60
    bg-black
    bg-opacity-40
    border-box
    box-border
    border-[2px]
    border-slate-700
    shadow-inset
    cursor-move
    ;
}

.opt-features {
  @apply
    absolute
    -left-2px
    -bottom-24
    bg-black
    bg-opacity-80
    box-border
    border-[2px]
    border-slate-700
    shadow-inset
    flex
    flex-col
    gap-2
    p-2
    cursor-auto
    
  ;
}

.info-display {
  @apply text-nowrap;
}

.opt-icon {
  @apply 
    absolute
    left-0
    top-0
    text-white
    text-3xl
    origin-center 
    rotate-90
    cursor-nwse-resize
    select-none
    z-2
  ;
}
</style>
