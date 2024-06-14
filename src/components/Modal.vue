<script lang="ts" setup>
import { defineOptions } from 'vue'
import { onKeyStroke } from '@vueuse/core'

defineOptions({ name: 'modal' })

withDefaults(defineProps<{
  visible?: boolean
}>(), {
  visible: false
})

const emits = defineEmits<{
  close: []
}>()

onKeyStroke('Escape', handleClose)

function handleClose() {
  emits('close')
}
</script>

<template>
  <div class="modal" v-if="visible">
    <img class="modal-bg" src="/modal-bg.png" alt="">
    <!-- -->
    <Particles class="absolute inset-1 z-2" />
    <div @click="handleClose" class="modal-close-btn"></div>
    <div class="modal-content">

    </div>
  </div>
</template>

<style lang="postcss">
.modal {
  @apply fixed left-20vw top-8vw;
}

.modal-bg {
  @apply w-60vw h-auto relative z-1;
}

.modal-close-btn {
  @apply absolute right-2 top-2 w-10 h-10 cursor-pointer z-5;
}

.modal-content {
  @apply absolute inset-0 z-3;
}
</style>
