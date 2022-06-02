<script>
export default {
  data() {
    return {
      msg: '',
      saved_msg: ''
    }
  }
}
</script>

<template>
  <div class="my_button">
    <input v-model="msg" placeholder="edit me" />
    <button @click="saved_msg=msg">Send</button>
    <p>{{ saved_msg }}</p>
  </div>
</template>