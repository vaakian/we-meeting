<template>
  <div :class="{'person': true, 'person__zoom': isZoomed}">
    <div
      :class="{'person__video': true, 'video__reverse':true, 'person__show': showInfoBar}"
      @mouseover.stop="showInfoBar = true"
      @mouseleave.stop="showInfoBar = false"
      @click.stop="showInfoBar=!showInfoBar"
    >
      <div ref="person"></div>
      <div class="person__control">
        <!-- <el-tooltip
          class="item"
          :content="isMuted?'解除禁音':'禁音'"
          :offset="isZoomed?120:10"
          placement="bottom"
        >-->
        <div class="person__control__volume">
          <el-button
            :type="isMuted ? 'primary': 'danger'"
            :icon="isMuted ? 'el-icon-turn-off-microphone':'el-icon-microphone'"
            @click.stop="toggleMute"
            circle
          ></el-button>
          <el-slider
            class="person__control__volume--slider"
            v-model="volume"
            :show-tooltip="false"
            size="medium"
            vertical
            height="100px"
          ></el-slider>
        </div>
        <!-- </el-tooltip> -->
        <!-- <el-tooltip class="item" :content="isZoomed?'关闭全屏':'页内全屏'" placement="bottom"> -->
        <el-button type="success" icon="el-icon-crop" @click="toggleZoomed" circle></el-button>
        <!-- </el-tooltip> -->

        <el-tooltip class="item" content="全屏" placement="bottom">
          <el-button type="success" icon="el-icon-full-screen" @click="toggleFullScreen" circle></el-button>
        </el-tooltip>
      </div>
      <div class="person__name">
        <span v-if="client.peer.type ==='video'">{{client.peer.nick}}</span>
        <span v-else>
          {{client.peer.nick}}
          <span style="clor: #409EFF;">[屏幕共享]</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  props: ['client'],
  data() {
    return {
      isZoomed: false,
      showInfoBar: false,
      volume: 100
    };
  },
  methods: {
    ...mapMutations({
      setShowControls: 'setShowControls'
    }),
    toggleZoomed() {
      this.isZoomed = !this.isZoomed;
    },
    toggleMute() {
      let muted = this.volume == 0;
      this.volume = muted ? 85 : 0;
      // let stream = this.client.peer.stream;
      // stream.getAudioTracks()[0].enabled = !muted;
    },
    toggleFullScreen() {
      const video = this.client.video;
      const displaying =
        video.displayingFullscreen || video.webkitDisplayingFullscreen;
      const requestFullScreen =
        video.requestFullScreen || video.webkitRequestFullScreen;
      const exitFullScreen = video.exitFullScreen || video.webkitExitFullScreen;
      if (displaying) exitFullScreen.call(video);
      else requestFullScreen.call(video);
    }
  },
  mounted() {
    const { peer } = this.client;
    // this.$refs.person.srcObject = this.client.peer.stream;
    this.$refs.person.append(this.client.video);
    // this.$refs.person.play();
    this.client.video.play();

    // 通知加入，加入前2秒不通知，是已存在的用户
    window.$allowJoinMessage &&
      this.$notify({
        dangerouslyUseHTMLString: true,
        message: `<strong style="color: #409EFF"> ${peer.nick}</strong> ${
          peer.type === 'video' ? '加入了会议' : '开启了屏幕共享'
        }`,
        type: 'warning'
      });
  },
  beforeDestroy() {
    const { peer } = this.client;
    this.$notify({
      dangerouslyUseHTMLString: true,
      message: ` <strong style="color: #409EFF"> ${peer.nick}</strong> ${
        peer.type === 'video' ? '离开了会议' : '停止了屏幕共享'
      }`,
      iconClass: 'el-icon-circle-close'
    });
  },
  watch: {
    // 移动端不许点击
    isZoomed(val) {
      this.client.video.play();
      this.setShowControls(!val);
    },
    volume(val) {
      this.client.video.volume = val / 100;
      let stream = this.client.peer.stream;
      if (this.isMuted) {
        // ios端只允许使用禁音
        stream.getAudioTracks()[0].enabled = false;
      } else {
        stream.getAudioTracks()[0].enabled = true;
      }
    }
  },
  computed: {
    isMuted() {
      // 改变真实声音
      return this.volume == 0;
    }
  }
};
</script>

<style lang="scss">
.person {
  position: relative;
  width: 96.2%;
  display: inline-block;
  transition: 0.3s;
  margin: 5px;
  z-index: 0;
  border-radius: 6px;
  overflow: hidden;
  &__show {
    .person__name {
      height: 3em !important;
    }
    .person__control {
      display: block;
      white-space: nowrap;
      width: fit-content;
    }
  }
  &__control {
    position: absolute;
    display: none;
    bottom: 0.5em;
    right: 5px;
    z-index: 1;
    &__volume {
      display: inline-block;
      position: relative;
      margin-right: 10px;
      &:hover &--slider {
        display: inline-block;
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #0a0b0b88;
        padding-top: 10px;
        padding-bottom: 10px;
        border-radius: 5px;
      }
      &--slider {
        display: none;
      }
    }

    .el-button {
      opacity: 0.8;
      &:hover {
        opacity: 1;
      }
    }
  }

  &__zoom {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 10;
    margin: 0 !important;
    border-radius: 0 !important;
    .person__name {
      font-size: 45px !important;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      min-width: 7em;
      text-align: center;
      border-radius: 0 0 25px 25px !important;
    }
    .person__control {
      bottom: 30px;
      z-index: 1;
      left: 50%;
      transform: translateX(-50%);
      @media screen and (max-width: 720px) {
        // ios safari 操作按钮挡住了
      }
      .is-circle {
        height: 90px;
        width: 90px;
        font-size: 30px !important;
      }
    }
    video {
      height: 100vh !important;
      width: 100vw !important;
      background: #222;
    }
  }
  &__video {
    box-shadow: 0 10px 25px rgba(49, 49, 49, 0.2);

    position: relative;
    background: rgb(255, 255, 255);
    background-size: cover;
    .person__name {
      overflow: hidden;
      padding-left: 1.5em;
      padding-right: 1.5em;
      box-sizing: border-box;
      border-radius: 22px 22px 0 0;
      font-weight: 600;
      font-size: 18px;
      position: absolute;
      bottom: 0em;
      color: white;
      background: #0a0b0b88;
      height: 0;
      transition: 0.3s;
      line-height: 3em;
    }
    video {
      display: block;
    }
  }

  @media (min-width: 576px) and (max-width: 767px) {
    width: 47%;
    &:nth-of-type(2n) {
      // margin-right: 0;
    }
    &:nth-of-type(2n + 1) {
      //margin-left: 0;
    }
  }
  @media (min-width: 768px) and (max-width: 991px) {
    width: 32%;
    &:nth-of-type(3n) {
      // margin-right: 0;
    }
    &:nth-of-type(3n + 1) {
      // margin-left: 0;
    }
  }
  @media (min-width: 992px) {
    width: 23.5%;
    &:nth-of-type(4n) {
      //margin-right: 0;
    }
    &:nth-of-type(4n + 1) {
      //margin-left: 0;
    }
  }
}

.video__reverse {
  video {
    // transform: scaleX(-1) !important;
  }
}
</style>