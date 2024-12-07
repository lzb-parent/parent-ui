<template>
  <span v-if="!ObjectUtil.isEmpty(value)"><span :class="`zcurrency-currency ${currencyClass}`">{{ currency }}</span><span :class="`zcurrency-number ${numberClass}`">{{ formatMoney(value) }} </span></span>
</template>
<script>

import ObjectUtil from '../js/utils/ObjectUtil'

export default {
  name: 'Zcurrency',
  props: {
    currencyClass: { default: () => '' },
    numberClass: { default: () => '' },
    value: {},
  },
  data() {
    return {
      ObjectUtil,
      returnValue: null,
    }
  },
  computed: {
  },
  watch: {
    value(newVal) {
      this.returnValue = newVal
    },
    returnValue(newVal) {
      this.$emit('input', newVal)
    }
  },
  created() {

  },
  methods: {
    formatMoney(money, digitNumber = 2) {
      // return money
      if (money == null) {
        money = 0
      }
      if (!this.isNumber(money)) {
        return money
      }
      if (money === parseInt(money)) {
        digitNumber = 0
      }
      money = parseFloat(money)
      if (this.currency === 'VND' || this.currency === '₫') {
        money.toFixed(0).toString().replace(/\d(?=(?:\d{3})+\b)/g, '$&.')
        return money
      }
      if (this.currency === '₱' || this.currency === '₱ ') {
        // money.toFixed(0).toString().replace(/\d(?=(?:\d{3})+\b)/g, '$&.')
        return money.toFixed(digitNumber)
      }
      money = money.toFixed(digitNumber).toString().replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
      if (this.currency.toUpperCase() === 'USDT' || this.currency.toUpperCase() === 'TRX') {
        return money
      }
      return money
    },
  }
}
</script>
<style scoped>
</style>
