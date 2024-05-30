<script lang="ts" setup>
import { defineOptions } from 'vue'
import { barMultipleRenderer, pieRingRenderer } from '../../charts'
import { getVisitorDetail, getVisitors } from '../../api'
defineOptions({ name: 'demo-warning' })

const visitors = ref<any[]>([])
const person = ref({})
onMounted(async () => {
  // getVisitors().then((v) => {
  //   visitors.value = v
  // })
  visitors.value = await getVisitors()
  person.value = await getVisitorDetail('x')
  
})
</script>

<template>
  <div class="demo-warning">
    <!-- -->
    <Card class="left-[1rem] top-[4.8rem] w-[24.9rem] h-[61.1rem]">
      <Particles class="absolute inset-0 z-0" />
      <ColTitle>
        车辆出入分布
      </ColTitle>
      <div class="h-80">
        <VizCanvas :renderer="barMultipleRenderer" :option="{
          category: ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衡州市', '舟山市', '舟山市', '丽水市'],
          value: [
            [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2].map(n => n * 10),
            [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
          ],
          group: ['行政村总数', '设备覆盖数', '设备通响数'],
          type: ['line', 'bar', 'bar'],
          typeTop: '10%',
          typeRight: '10%',
          axis: {
            name: '',
            value: '',
            nameRotate: -30,
          },
        }" />
      </div>
      <div class="h-70">
        <VizCanvas 
          :renderer="pieRingRenderer"
          :option="{
            data: [
              { value: 100, name: '杭州市' },
              { value: 20, name: '宁波市' },
              { value: 60, name: '温州市' },
            ],
          }"  
        ></VizCanvas>
      </div>

    </Card>
    <Card class="left-[96.6rem] top-[4.8rem] w-[22.6rem] h-[61.1rem]">
      <div class="absolute inset-4  top-9">
        <DecoGrid />
      </div>
      <ColTitle>
        应急测试001
      </ColTitle>
      <ListView
        class="px-2 py-1"
        :items="[
          { name:'应急测试001', date: '2022/3/14 17:31:46' },
          { name:'应急测试005', date: '2022/3/14 17:31:46' },
          { name:'应急测试006', date: '2022/3/14 17:31:46' },
          { name:'应急测试007', date: '2022/3/14 17:31:46' },
          { name:'应急测试008', date: '2022/3/14 17:31:46' },
          { name:'应急测试008', date: '2022/3/14 17:31:46' },
          { name:'应急测试008', date: '2022/3/14 17:31:46' },
          { name:'应急测试008', date: '2022/3/14 17:31:46' },
          ]"
      >
      <template v-slot="d">
        <div style="height: 1.7vw; margin-bottom: 0.4vw; font-size: 0.7vw">
          <ProgressListItem  :index="d.index" :max="100" :value="d.item.value" :name="d.item.name" />
        </div>
      </template>
    </ListView>
    </Card>
    <Card class="left-[73.3rem] top-[4.8rem] w-[22.6rem] h-[3.9rem]">
      <div class="flex h-full items-center">
        <div class="text-xl flex-1 text-center">
          设备总数 
          <GradientColorText class="font-900">
            <Count :end-val="1143"/>
          </GradientColorText>
        </div>
        <div class="text-xl flex-1 text-center">
          设备总数 
          <GradientColorText class="font-900">
            <Count :end-val="786"/>
          </GradientColorText>
        </div>
      </div>
    </Card>

    <Card class="left-[73.3rem] top-[9.5rem] w-[22.6rem] h-[40rem]">
      <ColTitle>
        访客名单
      </ColTitle>
      <ListView
        class="px-2 py-1"
        :items="visitors"
      >
        <template v-slot="{ item, index, isOdd }">
          <OrderListItem :order="index + 1" :odd="isOdd">
            <div class="pr-2 text-sm text-nowrap">
              <div class="flex justify-between items-center">
                <span class="text-sky-300">{{ item.name }}</span> 
                <span class="text-orange-200">{{ item.website }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-indigo-200">{{ item.phone }}</span>
                <span class="hover:underline text-red-300 cursor-pointer">查看详情</span>
              </div>
            </div>
          </OrderListItem>
          
        </template>
      </ListView>
    </Card>
  </div>
</template>

<style lang="postcss">
.demo-warning {
  @apply;
}
</style>
