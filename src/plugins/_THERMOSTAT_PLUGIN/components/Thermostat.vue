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
      heat_cool_dir: 0,  // Cool = -1, Heat = 1
      fan_speed: 0,
      text_color: 'rgb(0, 255, 0)'
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
    getColor() {
      if (this.heat_cool_dir > 0) {
        this.text_color = 'rgb(255,' + ((1 - this.heat_cool_dir) * 255) + ',' + ((1 - this.heat_cool_dir) * 255) + ')'; // HEATING
      }
      else {
        this.text_color = 'rgb(' + ((1 + this.heat_cool_dir) * 255) + ',' + ((1 + this.heat_cool_dir) * 255) + ',255)'; // COOLING
      }
      document.documentElement.style.setProperty('--temp-text-color', this.text_color);
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
    setInterval(this.getColor, 1000)
  }
}
</script>

<template>
  <div class="thermostat">
    <h1 class="temp">{{ temp }}</h1>
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