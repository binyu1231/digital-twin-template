<script lang="ts" setup>
import { defineOptions } from 'vue'

defineOptions({ name: 'empty-frame' })


</script>

<template>
  <div class="empty-frame">
    <!-- -->
    <slot></slot>
  </div>
</template>

<style lang="postcss">
.empty-frame {
  @apply fixed;
}
</style>
