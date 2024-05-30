<script lang="ts" setup>
import { defineOptions } from 'vue'

defineOptions({ name: 'col-title' })


</script>

<template>
  <div class="col-title">
    <!-- -->
    <img src="../assets/images/col-title-bg.png"/>
    <div class="col-title-content" v-bind="$attrs">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="postcss">
.col-title {
  @apply
    relative
    px-3
    py-2;
}

.col-title img {
  @apply
 
  ;
}

.col-title-content {
  --text-light: #67e8f9;
  text-shadow: 
    0 0 2px var(--text-light),
    0 0 4px var(--text-light);
  @apply
    absolute
    inset-0
    z-1
    pl-10
    pt-1.5
    
  ;
}
</style>
