<template>
  <div class="amountColumnDesc d-flex flex-column">
    <slot>
      <div :class="`text-primary ${primaryClass}`">{{ amount }}</div>
    </slot>
    <div :class="`mt-1 ${labelClass||''}`" v-if="label">{{ label }}</div>
  </div>
</template>

<script>


export default {
  name: 'amountColumnDesc',
  props: {
    label: {},
    amount: {},
    primaryClass: {default:()=>''},
    labelClass: {default:()=>''},
  },
}
</script>
