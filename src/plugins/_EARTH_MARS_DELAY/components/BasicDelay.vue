<script>
import FormatDateDelay from '../DateFormatter'

export default {
  data() {
    return {
      internalDomainObj: undefined,
    }
  },
  methods: {
    format_delay() {
      return FormatDateDelay(this.internalDomainObj.format, this.internalDomainObj.dateType, this.internalDomainObj.date)
    }
  }
}
</script>

<template>
  <div>
    <p>{{ format_delay() }} </p>
  </div>
</template>
