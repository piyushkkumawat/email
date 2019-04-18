<template>
  <div id="app">
    
    <DragPage />
  </div>
</template>

<script>
import DragPage from './components/DragPage.vue'

export default {
  name: 'app',
  components: {
    DragPage
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
