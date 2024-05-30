<template>
<div class="sk-list-view" v-bind="$attrs">
  <div 
    v-for="(item, i) in items"
    :key="i"
    class="sk-list-row__item"
    :style="{ animationDelay: i * 200 + 'ms' }">
    <slot 
      :items="items" 
      :index="i" 
      :isOdd="i % 2 === 0"
      :item="item"></slot>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'i-list-view',
  props: {
    items: {
      type: Array,
      default: () => ([])
    },
  },
  setup () {
  }
})
</script>
<style>
.sk-list-view {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.sk-list-view .sk-list-row__item {
  animation: 10s linear sk-list-view-roll infinite;
}

@keyframes sk-list-view-roll {

  10% {
    transform: rotateX(0deg)
  }

  15% {
    transform: rotateX(90deg)
  }
  15% {
    transform: rotateX(-90deg)
  }

  20% {
    transform: rotateX(0deg)
  }

  100% {
    transform: rotateX(0deg)
  }
}
</style>