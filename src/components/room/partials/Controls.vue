<template>
  <ul class="controls">
    <li class="controls__item">
      <a href class="controls__link" v-if="state.muted" @click.prevent="unmuteMe">开麦</a>
      <a href class="controls__link" v-else @click.prevent="muteMe">关麦</a>
    </li>
    <li class="controls__item" v-if="state.paused">
      <a href class="controls__link" @click.prevent="unpauseMe">打开视频</a>
    </li>
    <li class="controls__item" v-else>
      <a href class="controls__link" @click.prevent="pauseMe">关闭视频</a>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  methods: {
    ...mapMutations({
      setMuted: 'setMuted',
      setPaused: 'setPaused'
    }),
    muteMe() {
      window.webrtc.mute();
      this.setMuted(true);
    },

    unmuteMe() {
      window.webrtc.unmute();
      this.setMuted(false);
    },
    pauseMe() {
      window.webrtc.pauseVideo();
      this.setPaused(true);
    },
    unpauseMe() {
      window.webrtc.resumeVideo();
      this.setPaused(false);
      this.setMuted(false);
    }
  },
  computed: {
    ...mapGetters({
      state: 'getState'
    })
  }
};
</script>

<style lang="scss">
.controls {
  position: absolute;
  width: 100%;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #2b9cf2;
  margin: 0;
  padding: 0;
  list-style: none;

  &__item {
    font-weight: 600;
    flex: 1;
    border-right: 1px solid #0e83dc;
  }

  &__link {
    color: #fff;
    display: block;
    text-align: center;
    text-decoration: none;
    padding: 15px 18px;
    height: 100%;
    width: 100%;
  }
}
</style>