<script lang="ts" setup>
import { defineOptions } from 'vue'

defineOptions({ name: 'car-access-manage' })
const warningVisible = ref(true)

</script>

<template>
  <div class="car-access-manage">
    <!-- -->
    car-access-manage
  </div>

  <Modal :visible="warningVisible" @close="warningVisible = false"></Modal>

  
</template>

<style lang="postcss">
.car-access-manage {
  @apply;
}
</style>
