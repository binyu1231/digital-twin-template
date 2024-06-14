
<script setup lang="ts">
// @ts-ignore
import AOS from 'aos'
import { toggleDark, useSystemAccess } from '~/composables'
import { useRouter } from 'vue-router'


const { isSignin } = useSystemAccess()
const router = useRouter()
const isDev = ref(false)



onMounted(() => {
  toggleDark(true)
  AOS.init({
    once: true,
    disable: 'phone',
    duration: 500,
    easing: 'ease-out-cubic',
  })

  if (!isSignin.value) {
    router.replace('/access/signin')
  }

  if (import.meta.env.PROD) {
    // 0.83vw 代表在宽度是1920px的情况下16px的值 即 16 / 1920 * 100
    document.documentElement.style.fontSize = '0.83vw'
  }
  else {
    document.documentElement.style.fontSize = 16 / window.screen.availWidth * 100 + 'vw'
    isDev.value = true
  }
})



</script>
<template>
  <!-- font-sans -->
  <main class="root-element">
    <section class="root-container" ref="containerRef">
      <RouterView />
    </section>
    <DebugLayer :enable="isDev" />
  </main>
</template>
<style lang="postcss">
.root-element {
  @apply
    fixed inset-0;
}

.root-container {
  @apply
    absolute inset-0 z-0;
  ;

}


</style>