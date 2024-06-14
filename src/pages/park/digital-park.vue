<script lang="ts" setup>
import { defineOptions } from 'vue'

defineOptions({ name: 'digital-park' })


</script>

<template>
  <div class="digital-park">
    <!-- -->
    <SubRouter
      class="left-[3rem] top-[8rem]"
      :routes="[
        { name: '视频监控', eng: 'Video Monitoring', path: '/park/digital-park/video-monitoring' },
        { name: '人员通行管理', eng: 'Person Access Manage', path: '/park/digital-park/person-access-manage' },
        { name: '车辆通行管理', eng: 'Car Access Manage', path: '/park/digital-park/car-access-manage' },
        { name: '设备监控', eng: 'Equipment Monitoring', path: '/park/digital-park/equipment-monitoring' },
      ]"
    ></SubRouter>
    <RouterView></RouterView>
  </div>
</template>

<style lang="postcss">
.digital-park {
  @apply;
}
</style>
