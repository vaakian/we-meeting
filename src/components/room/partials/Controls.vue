<template>
  <ul class="controls">
    <li class="controls__item" v-if="state.muted">
      <a href class="controls__link" @click.prevent="unmuteMe">开麦</a>
    </li>
    <li class="controls__item controls__off" v-else>
      <a href class="controls__link" @click.prevent="muteMe">关麦</a>
    </li>

    <li class="controls__item" v-if="state.paused">
      <a href class="controls__link" @click.prevent="unpauseMe">打开视频</a>
    </li>
    <li class="controls__item controls__off" v-else>
      <a href class="controls__link" @click.prevent="pauseMe">关闭视频</a>
    </li>

    <li class="controls__item controls__off" v-if="state.screenSharing">
      <!-- <a href class="controls__link" @click.prevent="stopScreenShare">关闭共享</a> -->
      <a href class="controls__link disabled" @click.prevent>屏幕共享</a>
    </li>
    <li class="controls__item" v-else>
      <a href class="controls__link" @click.prevent="shareScreen">屏幕共享</a>
    </li>

    <li class="controls__item controls__off" v-if="state.showChat">
      <a href class="controls__link" @click.prevent="closeChat">收起聊天</a>
    </li>
    <li class="controls__item" v-else>
      <a href class="controls__link" @click.prevent="openChat">打开聊天</a>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  methods: {
    ...mapMutations({
      setMuted: 'setMuted',
      setPaused: 'setPaused',
      setScreenSharing: 'setScreenSharing',
      setShowChat: 'setShowChat'
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
    },
    shareScreen() {
      window.webrtc.shareScreen(event => {
        if (event && event.code === 0) {
          console.log('拒绝了摄像头授权');
          window.webrtc.stopScreenShare();
          this.setScreenSharing(false);
        } else {
          console.log('分享屏幕', { event });
          this.setScreenSharing(true);
        }
      });
    },
    stopScreenShare() {
      // window.webrtc.stopScreenShare();
      // this.setScreenSharing(false);
      // console.log('关闭屏幕', this.state);
      // console.log('')
    },
    closeChat() {
      this.setShowChat(false);
    },
    openChat() {
      this.setShowChat(true);
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
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #2b9cf2;
  margin: 0;
  padding: 0;
  list-style: none;
  z-index: 20;
  &__off {
    background: red;
  }
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
  .disabled {
    background: #999;
    color: #ccc;
  }
}
</style>