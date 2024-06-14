<script lang="ts" setup>
import { defineOptions } from 'vue'

defineOptions({ name: 'is-shell' })
withDefaults(
    defineProps<{
        variables?: Record<string, any>
    }>(),
    {
        variables: () => ({})
    }
);


</script>

<template>
  <slot v-bind="variables"></slot>
</template>
