<template>
  <van-grid
      class="zgrid"
      v-if="size"
      :column-num="columnNum || Math.min(size,sizeMax)"
      :border="false"
  >
    <template v-for="(data,index) in datas">
      <van-grid-item :key="index" :text="data.text" :icon="data.icon" >
        <slot :data="data" :index="index"></slot>
<!--        <template v-for="(s, slotName) in $slots" >-->
<!--&lt;!&ndash;          <template v-slot:[slotName]="$slots[slotName]">&ndash;&gt;-->
<!--&lt;!&ndash;                 <slot :name="slotName" :data="data"></slot>&ndash;&gt;-->
<!--&lt;!&ndash;               </template>&ndash;&gt;-->
<!--        </template>-->
        <!-- 透传所有的 slot -->
<!--            <template v-for="(_, slotName) in $slots" :slot="slotName" v-if="slotName !== 'default'" v-slot:[slotName]="$slots[slotName]">-->
<!--              <slot :name="slotName"></slot>-->
<!--            </template>-->
<!--            <template v-if="$slots.default">-->
<!--              <slot></slot>-->
<!--            </template>-->
      </van-grid-item>
    </template>
  </van-grid>
</template>

<script>

import mixinScope from "../js/mixin/MixinScope";
import BannerIcon from "../ui-vant/bannerIcon.vue";

export default {
  name: 'zgrid',
  computed: {
    size() {
      return this.datas && this.datas.length
    },
  },
  mixins: [mixinScope],
  components: {BannerIcon},
  props: {
    datas: {},
    columnNum: {default: null},
    sizeMax: {default: 4},
  },
  created() {
  },
}
</script>
