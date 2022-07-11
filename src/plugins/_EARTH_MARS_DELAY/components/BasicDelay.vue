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
      if (this.internalDomainObj.showSys == true) {
        // Calculate Mars-Earth Angle

        // Move Mars to the correct angle
        document.documentElement.style.setProperty('--mars-top', '100px');
        document.documentElement.style.setProperty('--mars-left', '0px');
      }
      // Format and return the textual delay
      return FormatDateDelay(this.internalDomainObj.format, this.internalDomainObj.dateType, this.internalDomainObj.date)
    }
  }
}
</script>

<template>
  <div>
    <p>{{ format_delay() }} </p>
    <div v-if="this.internalDomainObj.showSys == true">
    <div>
      <svg height="220" width="220">
        <circle cx="110" cy="110" r="100" stroke="gray" stroke-width="2" fill="none" />
        <circle cx="110" cy="110" r="75" stroke="gray" stroke-width="2" fill="none" />
      </svg>
      <img :src="require('./earth.png')" class="planet_earth"/>
      <img :src="require('./mars.png')" class="planet_mars"/>
      <img :src="require('./sun.png')" class="sun"/>
    </div>
  </div>
  </div>
</template>
