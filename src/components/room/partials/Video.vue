<template>
  <div :class="{'person': true, 'person__zoom': isZoomed}">
    <div class="person__video video__reverse">
      <div ref="person"></div>
      <div class="video__control">
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
      message: `<strong style="color: #409EFF">${peer.nick}</strong> ${
        peer.type === 'video' ? '加入了会议' : '开启了屏幕共享'
      }`,
      type: 'warning'
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
  transition: 0.3s;
  margin: 5px;
  z-index: 0;
}
.person__zoom {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 10;
  .person__name {
    font-size: 3em;
  }
  .video__control {
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
.person__video {
}
.video__control {
  position: absolute;
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

.video__reverse {
  video {
    //    transform: scaleX(-1) !important;
  }
}
</style>