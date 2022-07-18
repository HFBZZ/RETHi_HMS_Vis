<script>
import SendMessage from '../../_MESSAGE_SENDER/MessageSender'

export default {
  data() {
    return {
      internalDomainObj: undefined,
      set_point: 0,
      is_editing: false,
    }
  },
  methods: {
    send(msg) {
        SendMessage(msg, this.internalDomainObj.target)
        this.is_editing = false
    },
    increment() {
        this.set_point += 0.5
        this.is_editing = true
    },
    decrement() {
        this.set_point -=0.5
        this.is_editing = true
    }
  },
}
</script>

<template>
  <div class="thermostat">
    <h1 class="temp">22</h1>
    <div class="offset">
        <button class="arrow" @click="increment()">▲</button>
        <p class="center">{{ set_point }}</p>
        <button class="down arrow" @click="decrement()">▼</button>
        <div>
            <button class="ok" @click="send(set_point)">OK</button>
        </div>
    </div>
  </div>
</template>