<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
};
</script>

<style lang="scss">
@import '~@/assets/styles/app.scss';
* {
  margin: 0;
  padding: 0;
}
body {
  background: #eee;
}
#app {
  background: white;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}
</style>
