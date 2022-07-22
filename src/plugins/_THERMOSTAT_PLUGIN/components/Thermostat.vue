<script>
import SendMessage from '../../_MESSAGE_SENDER/MessageSender'

export default {
  data() {
    return {
      internalDomainObj: undefined,
      is_editing: false,
      is_updating: false,
      timeoutID: 0,
      set_point: 0,
      temp: 0,
      mode: 0,  // Cool = -1, Off = 0, Heat = 1
      fan_speed: 0,
      curr_width: 0,
    }
  },
  methods: {
    send(msg) {
        SendMessage(msg, this.internalDomainObj.target)
        this.is_editing = false
        this.updatingTimeout()
    },
    increment() {
        this.set_point += parseFloat(this.internalDomainObj.step)
        this.refreshEditTimeout()
    },
    decrement() {
        this.set_point -= this.internalDomainObj.step
        this.refreshEditTimeout()
    },
    onUpdate() {
      if (this.curr_width != this.internalDomainObj.bonus_width) {
        document.documentElement.style.setProperty("--thermostat-bonus-width", this.internalDomainObj.bonus_width + "px")
        this.curr_width = this.internalDomainObj.bonus_width
      }
    },
    refreshEditTimeout() {
      this.is_editing = true
      if (this.timeoutID > 0) {
        clearTimeout(this.timeoutID);
      }
      this.timeoutID = setTimeout(() => {
        this.is_editing = false
        this.timeoutID = 0
      }, 10000)
    },
    updatingTimeout() {
      this.is_updating = true
      if (this.timeoutID > 0) {
        clearTimeout(this.timeoutID);
      }
      this.timeoutID = setTimeout(() => {
        this.is_updating = false
        this.timeoutID = 0
      }, 2000)
    }
  },
  mounted() {
    setInterval(this.onUpdate, 1000);
  }
}
</script>

<template>
  <div class="thermostat">
    <h1 class="temp" v-if="this.internalDomainObj.step < 1">{{ Math.round(temp / parseFloat(this.internalDomainObj.step)) * parseFloat(this.internalDomainObj.step) }}</h1>
    <h1 class="temp" v-else>{{ Math.round(temp) }}</h1>
    <div class="offset">
        <button class="arrow" @click="increment()">▲</button>
        <p class="center">{{ set_point }}</p>
        <button class="down arrow" @click="decrement()">▼</button>
        <div>
            <button class="ok" @click="send(set_point)">OK</button>
        </div>
        <h2 class="units">°C</h2>
    </div>
    <h2 class="mode_text" v-if="mode > 0">HEAT</h2>
    <h2 class="mode_text" v-else-if="mode < 0">COOL</h2>
    <h2 class="mode_text" v-else>OFF</h2>
  </div>
</template>