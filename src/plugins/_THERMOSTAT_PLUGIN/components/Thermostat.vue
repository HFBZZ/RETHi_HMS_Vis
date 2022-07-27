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
      decimal_places: 0,
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
        this.set_point = ((Math.round(this.set_point / this.internalDomainObj.step) + 1) * this.internalDomainObj.step).toFixed(this.decimal_places)
        this.refreshEditTimeout()
    },
    decrement() {
        this.set_point = ((Math.round(this.set_point / this.internalDomainObj.step) - 1) * this.internalDomainObj.step).toFixed(this.decimal_places)
        this.refreshEditTimeout()
    },
    onUpdate() {
      if (this.curr_width != this.internalDomainObj.bonus_width) {
        document.documentElement.style.setProperty("--thermostat-bonus-width", this.internalDomainObj.bonus_width + "px")
        this.curr_width = this.internalDomainObj.bonus_width
      }
    },
    // Resets the timeout to be 10 seconds any time the up or down arrow is pressed
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
    // A timeout so that the set point doesn't appear to flicker, but instead retains the artificial value for 2 seconds until the real value arrives back from MCVT
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
    setInterval(this.onUpdate, 1000); // Runs onUpdate every 1000 ms
  }
}
</script>

<template>
  <div class="thermostat">
    <h1 class="temp" v-if="internalDomainObj.step < 1">{{ (Math.round(temp / internalDomainObj.step) * internalDomainObj.step).toFixed(decimal_places) }}</h1>
    <h1 class="temp" v-else>{{ Math.round(temp).toFixed(decimal_places) }}</h1>
    <div class="offset">
        <button class="arrow" @click="increment()">▲</button>
        <p class="center">{{ set_point }}</p>
        <button class="down arrow" @click="decrement()">▼</button>
        <div>
            <button class="ok" @click="send(set_point)">OK</button>
        </div>
        <h2 class="units">{{ internalDomainObj.units }}</h2>
    </div>
    <h2 class="mode_text" v-if="mode > 0">HEAT</h2>
    <h2 class="mode_text" v-else-if="mode < 0">COOL</h2>
    <h2 class="mode_text" v-else>OFF</h2>
  </div>
</template>