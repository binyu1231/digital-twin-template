<script lang="ts" setup>
import { defineOptions } from 'vue'

defineOptions({ name: 'operation' })


</script>

<template>
  <div class="operation">
    <!-- -->
    <SubRouter
      class="left-[3rem] top-[8rem]"
      :routes="[
        { name: '智慧办公', eng: 'Smart Office', path: '/park/smart-operation/smart-office' },
        { name: '能耗管理', eng: 'Energy Management', path: '/park/smart-operation/energy-management' },
        { name: '终端安全管理', eng: 'Terminal Security Management', path: '/park/smart-operation/terminal-security-management' },
        { name: '网络安全管理', eng: 'Network Security Management', path: '/park/smart-operation/network-security-management' },
      ]"
    ></SubRouter>
    <RouterView></RouterView>
  </div>
</template>

<style lang="postcss">
.operation {
  @apply;
}
</style>
