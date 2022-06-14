<script>
import SendMessage from '../../_MESSAGE_SENDER/MessageSender'

export default {
  data() {
    return {
      internalDomainObj: undefined,
      checked: false,
    }
  },
  methods: {
    toggle_and_send() {
      this.checked = !this.checked;
      SendMessage(this.checked, this.internalDomainObj.target)
    }
  }
}
</script>

<template>
  <div>
    <input type="checkbox" v-on:click="toggle_and_send()"/>
    <label>{{ internalDomainObj.label }}</label>
  </div>
</template>
