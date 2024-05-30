<script lang="ts" setup>
import { defineOptions } from 'vue'

defineOptions({ name: 'demo-root' })


</script>

<template>
  <div class="demo-root">
    <!-- -->
    <router-view></router-view>
  </div>
</template>

<style lang="postcss">
.demo-root {
  background-image: 
    linear-gradient(0.25turn, #456788, rgba(0, 0, 0, 0), #456788),
    url('/park-demo-bg.png');
    
  ;
  @apply
  fixed inset-0 bg-no-repeat bg-contain bg-center;
}
</style>
