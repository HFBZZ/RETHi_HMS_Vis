<script>
import SendMessage from '../../_MESSAGE_SENDER/MessageSender'

export default {
  data() {
    return {
      internalDomainObj: undefined,
      msg: '',
    }
  },
  methods: {
    send(msg) {
      SendMessage(msg, this.internalDomainObj.target)
    }
  }
}
</script>

<template>
  <div>
    <input class="numerical_input_field" v-model="msg" placeholder="00" />
    <button class="button button_hover" @click="send(msg)">{{ internalDomainObj.label }}</button>
  </div>
</template>
