<template>
  <div id="app">
    <!-- <TeacherBoard /> -->
    <router-view />
  </div>
</template>

<script>
// import Sketch from './components/Sketch';

export default {
  name: 'app',
  mounted() {
    window.scrollTo(0, 1);
  }
};
</script>

<style lang="scss">
@import '~@/assets/styles/app.scss';
</style>
