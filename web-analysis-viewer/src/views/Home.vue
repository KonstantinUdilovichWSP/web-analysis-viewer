<template >
  <div class="home" style="background-color: red">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <VtkView msg="VtkViewer" style="height: 500px"/>
  </div>
</template>

<script>
import { ref, unref, onMounted, onBeforeUnmount, watchEffect } from 'vue';
// @ is an alias to /src
import VtkView from '@/components/VtkView.vue'


export default {
  name: 'Home',
  components: {
    VtkView
  }
}
</script>
