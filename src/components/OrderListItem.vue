<template>
<div 
  class="sk-order-list-item" 
  v-bind="$attrs"
  :style="{ color: currentColor }"
  :class="{ odd: odd, active: active, white: true }">
  <div class="sk-order-list-item__order">
    <Count :end-val="order"></Count>
  </div>
  <div class="sk-order-list-item__name"><slot>{{ name }}</slot></div>
</div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import Count from './Count.vue'

export default defineComponent({
  name: 'i-order-list-item',
  components: { Count },
  props: {
    order: {
      type: Number,
      default: 1,
    },
    name: {
      type: String,
      default: '--',
    },
    value: {
      type: [Number],
      default: 0
    },
    trendup: {
      type: Boolean,
      default: true
    },
    odd: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    //
    const color = [
      '#FD2323',
      '#FFE431',
      '#FF7A31',
      '#51DEFF',
      '#FFE431',
    ]

    const currentColor = computed(() => {
      return color[((props.order || 1) - 1) % color.length]
    })

  

    return {
      currentColor
    }
  }
})
</script>
<style>
.sk-order-list-item {
  display: flex;
  width: 100%;
  height: 2.3vw;
  padding: 0 0 0 1.1vw;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.sk-order-list-item:before {
  content: "";
  position: absolute;
  width: 0.6vw;
  height: 100%;
  background-color: currentColor;
  box-shadow: 0 0 10px currentColor;
  left: -0.3vw;
  border-radius: 0.3vw;
  top: 0;
}


.sk-order-list-item.odd {
  
  background: rgba(7, 230, 239, 0.3);
}

.sk-order-list-item__order {
  width: 1.3vw;
  height: 1.3vw;
  border-radius: 50%;
  background-color: #00C9D1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5vw;
  font-weight: bold;
}

.sk-order-list-item__order span {
  color: #fff;
}



.sk-order-list-item__name {
  color: #fff;
  flex: 1;
}
</style>