<template>
  <div :class="{'person': true, 'person__zoom': isZoomed}">
    <div class="person__video video__reverse">
      <div ref="person"></div>
      <div class="person__control">
        <el-tooltip
          class="item"
          effect="light"
          :content="isMuted?'解除禁音':'禁音'"
          placement="right-start"
        >
          <el-button
            :type="isMuted ? 'primary': 'danger'"
            icon="el-icon-headset"
            @click="toggleMute"
            circle
          ></el-button>
        </el-tooltip>
        <el-button type="success" icon="el-icon-crop" @click="toggleZoomed" circle></el-button>
        <el-button type="success" icon="el-icon-full-screen" @click="toggleFullScreen" circle></el-button>
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
export default {
  props: ['client'],
  data() {
    return {
      isZoomed: false,
      isMuted: false
    };
  },
  methods: {
    toggleZoomed() {
      console.log('放大全屏');
      this.isZoomed = !this.isZoomed;
    },
    toggleMute() {
      this.isMuted = !this.isMuted;
      let stream = this.client.peer.stream;
      stream.getAudioTracks()[0].enabled = !this.isMuted;
    },
    toggleFullScreen() {
      const video = this.client.video;
      const displaying =
        video.webkitDisplayingFullscreen || video.displayingFullscreen;
      const requestFullScreen =
        video.webkitRequestFullScreen || video.requestFullScreen;
      const exitFullScreen = video.webkitExitFullScreen || video.exitFullScreen;
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

    // 通知加入
    this.$message({
      dangerouslyUseHTMLString: true,
      message: `<strong style="color: #409EFF"> ${peer.nick}</strong> ${
        peer.type === 'video' ? '加入了会议' : '开启了屏幕共享'
      }`,
      type: 'warning'
    });
  },
  beforeDestroy() {
    const { peer } = this.client;
    this.$message({
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
    }
  }
};
</script>

<style lang="scss">
.person {
  position: relative;
  width: 100%;
  display: inline-block;
  transition: 0.3s;
  margin: 5px;
  z-index: 0;
  &:hover {
    .person__name {
      height: 3.2em;
    }
    .person__control {
      display: inline-block;
    }
  }
  &__control {
    position: absolute;
    display: none;
    bottom: 0.5em;
    right: 5px;
    z-index: 1;
    .el-button {
      opacity: 0.5;
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
    .person__name {
      font-size: 3em;
    }
    .person__control {
      transform: scale(2);
      right: 120px;
      bottom: 80px;
      z-index: 1;
      font-size: 4em;
    }
    video {
      margin-left: -5px; // 抵消person的margin
      height: 100vh !important;
      width: 100vw !important;
      background: #222;
    }
  }
  &__video {
    box-shadow: 0 10px 25px rgba(49, 49, 49, 0.2);
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    background: url('/static/nocam.png') white;
    background-size: cover;
    .person__name {
      padding-left: 2em;
      font-weight: 600;
      position: absolute;
      bottom: 0em;
      width: 100%;
      color: white;
      background: rgba(0, 0, 0, 0.2);
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
      margin-right: 0;
    }
    &:nth-of-type(4n + 1) {
      margin-left: 0;
    }
  }
}

.person__video {
}

.video__reverse {
  video {
    //    transform: scaleX(-1) !important;
  }
}
</style>