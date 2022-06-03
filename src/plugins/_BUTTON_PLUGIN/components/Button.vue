<script>
import SendMessage from '../../_MESSAGE_SENDER/MessageSender'

export default {
  data() {
    return {
      msg: '',
      saved_msg: ''
    }
  },
  methods: {
    send(msg) {
      this.saved_msg = msg
      SendMessage(msg, "Thermal Set Point")
    }
  }
}
</script>

<template>
  <div class="my_button">
    <input v-model="msg" placeholder="edit me" />
    <button @click="send(msg)">Send</button>
    <p>{{ saved_msg }}</p>
  </div>
</template>