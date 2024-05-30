<script lang="ts" setup>
import { defineOptions } from 'vue'

defineOptions({ name: 'deco-grid' })


</script>

<template>
  <div class="deco-grid">
    <div class="h-[200%] animate-endless">
      <div
        class="absolute inset-0 [background:_repeating-linear-gradient(transparent,_transparent_48px,_theme(colors.white)_48px,_theme(colors.white)_49px)] blur-[2px] opacity-20">
      </div>
      <div
        class="absolute inset-0 [background:_repeating-linear-gradient(transparent,_transparent_48px,_theme(colors.indigo.500)_48px,_theme(colors.indigo.500)_49px)]">
      </div>
      <div
        class="absolute inset-0 [background:_repeating-linear-gradient(90deg,transparent,_transparent_48px,_theme(colors.white)_48px,_theme(colors.white)_49px)] blur-[2px] opacity-20">
      </div>
      <div
        class="absolute inset-0 [background:_repeating-linear-gradient(90deg,transparent,_transparent_48px,_theme(colors.indigo.500)_48px,_theme(colors.indigo.500)_49px)]">
      </div>
    </div>
  </div>
</template>

<style lang="postcss">.deco-grid {
  @apply 
    absolute 
    inset-0 
    transform 
    translate-x-0% 
    -translate-y-0% 
    pointer-events-none  
    overflow-hidden 
    [mask-image:_radial-gradient(black, _transparent_60%)];
}</style>
