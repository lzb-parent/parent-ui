<template>
  <div :class="`zcountDown d-flex ${title?'justify-between':'justify-start'}`">
    <van-count-down :class="`van-count-down_${size} ${textPrimary?'text-primary':'text-white'}`" :time="timeLongBetween" @finish="$emit('finish')">
      <template #default="timeData">
        <span v-if="timeData.days" :class="`${blockClass} ${textPrimary?'bg_white':'bg_primary'} block `">{{ timeData.days }}</span>
        <span v-if="timeData.days" :class="`${textPrimary?'text-white':'text-primary'}`">{{ $t('天') }} </span>
        <span :class="`${blockClass} ${textPrimary?'bg_white':'bg_primary '} block`">{{ appendZero(timeData.hours) }}</span>
        <span class="text-primary ">:</span>
        <span :class="`${blockClass} ${textPrimary?'bg_white':'bg_primary '} block`">{{ appendZero(timeData.minutes) }}</span>
        <span class="text-primary">:</span>
        <span :class="`${blockClass} ${textPrimary?'bg_white':'bg_primary '} block`">{{ appendZero(timeData.seconds) }}</span>
<!--        <slot :class="`${textPrimary?'text-white':'text-primary'}`"></slot>-->
<!--        <span :class="`${textPrimary?'text-white':'text-primary'} ml-1`">{{$t('秒')}}</span>-->
      </template>
    </van-count-down>
    <div class="h4" v-if="title">{{ title }}</div>
  </div>
</template>

<script>

export default {
  name: "zcountDown",
  props: {
    size: {
      default: 'normal'
    },
    title: {},
    targetDate: {},
    textPrimary: {},
    blockClass: {
      default:''
    },
  },
  data() {
    return {}
  },
  computed: {
    timeLongBetween() {
      if (!this.targetDate) {
        return 0
      }
      let timeLong = this.readDate(this.targetDate).getTime() - new Date().getTime();
      return Math.max(timeLong, 0)
    }
  },
  created() {
  },
  methods: {
    appendZero(num){
      return num > 9 ? num : ('0'+num)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
