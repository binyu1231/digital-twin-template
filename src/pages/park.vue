<script lang="ts" setup>
import { defineOptions } from 'vue'
import { DTM } from '~/DT'

defineOptions({ name: 'demo-root' })
const canvasRef = ref<HTMLCanvasElement>()

onMounted(async () => {
  if(!canvasRef.value) return

  DTM.init(canvasRef.value)
  const dtm = DTM.instance
  await dtm.loadLandscape()
  await dtm.test()
})
</script>

<template>
  <canvas ref="canvasRef" class="park-viewer"></canvas>
  <div class="demo-root">
    <!-- -->
    <header class="root-header">
      <img src="/logo.png" class="w-[24rem] h-auto fixed -top-2" alt="">
      <div class="platform-name">
        智慧园区数字化综合展示平台
      </div>

      <div class="root-router">
        <RouterLink class="root-btn" to="/park/overview">
          园区总览
        </RouterLink>
        <RouterLink class="root-btn" to="/park/digital-park">
          数字园区
        </RouterLink>
        <RouterLink class="root-btn" to="/park/smart-operation">
          智慧运维
        </RouterLink>
      </div>
    </header>
    <router-view></router-view>
  </div>
</template>

<style lang="postcss">
.demo-root {
  @apply
  fixed z-3;
}

.root-header {
  background-image: url('/header-bg.png');
  @apply fixed left-0 right-0 top-0 h-30 bg-cover;
}

.platform-name {
  --text-light: #67e8f9;
  letter-spacing: 2px;
  text-shadow: 
    0 0 2px var(--text-light),
    0 0 4px var(--text-light);

  left: 48.5rem;
  @apply
    fixed

    font-900  
    text-2xl
    pt-3
  ;
}

.root-router {
  @apply
    fixed left-[83.5rem] top-2 flex gap-10;
}

.root-btn {
  background-image: url('/router-btn.png');
  letter-spacing: 1px;
  @apply
    w-33 h-11  bg-cover flex items-center justify-center
  ;
}

.root-btn.router-link-active {
  background-image: url('/router-btn-active.png');
  letter-spacing: 2px;
  --text-light: #67e8f9;
  
  text-shadow: 
    0 0 2px var(--text-light),
    0 0 4px var(--text-light);
}

.park-viewer {
  @apply fixed inset-0 w-100vw h-100vh z-2;
}
</style>
