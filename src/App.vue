<template>
  <div id="app">
    <!-- <TeacherBoard /> -->
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import Sketch from './components/Sketch';

export default {
  name: 'app',
  computed: {
    ...mapState(['darkTheme'])
  },
  mounted() {
    window.scrollTo(0, 1);
  },
  watch: {
    darkTheme: {
      handler: val => {
        document.body.className = val ? 'dark-theme' : 'light-theme';
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss">
@import '~@/assets/styles/app.scss';
</style>
