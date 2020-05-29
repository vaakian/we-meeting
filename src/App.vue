<template>
  <div id="app">
    <!-- <TeacherBoard /> -->
    <router-view />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// import Sketch from './components/Sketch';
import isMobile from 'ismobilejs';
export default {
  name: 'app',
  computed: {
    ...mapState(['darkTheme'])
  },
  methods: {
    ...mapMutations(['setDarkTheme', 'setIsMobile']),
    checkIfIsMobile() {
      this.setIsMobile(isMobile(window.navigator).any);
    },
    handleSystemThemeSwitch() {
      const _vm = this;
      let listeners = {
        dark: mediaQueryList => {
          if (mediaQueryList.matches) {
            _vm.setDarkTheme(1);
          }
        },
        light: mediaQueryList => {
          if (mediaQueryList.matches) {
            _vm.setDarkTheme(0);
          }
        }
      };

      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addListener(listeners.dark);
      window
        .matchMedia('(prefers-color-scheme: light)')
        .addListener(listeners.light);
    }
  },
  mounted() {
    window.scrollTo(0, 1);
    this.handleSystemThemeSwitch();
    this.checkIfIsMobile();
  },
  watch: {
    darkTheme: {
      handler: val => {
        document.body.className = val ? 'dark-theme' : 'light-theme';
        localStorage.setItem('darkTheme', val);
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss">
@import '~@/assets/styles/app.scss';
</style>
