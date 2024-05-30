<script lang="ts" setup>
import { defineOptions } from 'vue'
defineOptions({ name: 'card' })


</script>

<template>
  <div class="card" v-bind="$attrs">
    <span></span>
    <span></span>
    <span class="rotate-180"></span>
    <span class="rotate-180"></span>
    <!-- -->
    <div class="card-contant">
      <slot />
    </div>
  </div>
</template>

<style lang="postcss">
.card {
  --border-light-w: 1px;
  --border-light: #20b8ef;
  border-color: rgb(62, 134, 234);

  background-color: rgba(40, 93, 130, 0.54);
  @apply fixed bg-skyblue-300 bg-op-30 border-bg-skyblue-100 border box-border;
}

.card>span {
  @apply absolute z-1 inset-0 box-border origin-center overflow-hidden before:content-empty before:absolute before:bg-[#50dfdb];
}

.card>span:nth-child(1)::before,
.card>span:nth-child(3)::before {
  animation: border-horizontal-animate 4s linear infinite;
  background: linear-gradient(to right, transparent, var(--border-light));
  @apply w-full h-[--border-light-w];
}

.card>span:nth-child(2)::before,
.card>span:nth-child(4)::before {
  animation: border-vertical-animate 4s linear infinite;
  background: linear-gradient(to top, transparent, var(--border-light));
  @apply h-full w-[--border-light-w];
}

.card-contant {
  @apply absolute inset-0 z-2;
}



@keyframes border-horizontal-animate {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

@keyframes border-vertical-animate {
  0% {
    transform: translateY(0%);
  }

  50% {
    transform: translateY(-100%);

  }

  50.1% {
    transform: translateY(100%);
  }

  100% {
    transform: translateY(0%);
  }

}
</style>
