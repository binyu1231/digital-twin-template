<script lang="ts" setup>
import { defineOptions } from 'vue'

defineOptions({ name: 'sub-router' })

interface SubRoute {
  name: string
  eng: string
  icon: string
  path: string
}

withDefaults(defineProps<{
  routes: SubRoute[]
}>(), {
  
})

</script>

<template>
  <EmptyFrame class="sub-router">
    <!-- -->
    <Particles class="absolute inset-0 z-1" />
    <div class="absolute z-2 flex flex-col gap-8 ">
        <RouterLink class="sub-route" v-for="route in routes" :to="route.path" v-slot="{ isActive }">
        <img v-if="isActive" src="/sub-router-btn-active.png" alt="" class="btn-bg">
        <img v-else src="/sub-router-btn.png" alt="" class="btn-bg">
        <div class="sub-route-content" :class="{ active: isActive }">
          <img class="sub-route-icon" :src="route.icon || '/route-icon-user.svg'" alt="">
          <div class="-mt-1">
            <div>{{ route.name }}</div>
            <div class="text-nowrap">{{ route.eng || 'unsetting' }}</div>
          </div>
        </div>
      </RouterLink>
    </div>

  </EmptyFrame>
</template>

<style lang="postcss">
.sub-router {
  @apply fixed h-140 w-100 pt-16;
}

.sub-route {
  @apply 
    relative 
    flex 
    text-white 
    gap-2 
    h-18 
    pl-4
    h-20
    ;
}

.sub-route.router-link-active {
  @apply;
}


.btn-bg {
  @apply;
}

.sub-route-icon {
  @apply w-6 h-6 mr-10;
}

.sub-route-content {
  letter-spacing: 0.125rem;
  font-size: 0.75rem;
  @apply absolute inset-0 left-15 top-5 flex;
}
.sub-route-content.active {
  --text-light: #67e8f9;
  
  text-shadow: 
    0 0 2px var(--text-light),
    0 0 4px var(--text-light);
}
</style>
