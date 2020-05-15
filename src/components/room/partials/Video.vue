<template>
  <div :class="{'person': true, 'person__zoom': isZoomed}">
    <div class="person__video video__reverse" @click="toggleZoomed">
      <video autoplay ref="person"></video>
    </div>
    <div class="person__name">
      <span>{{client.peer.nick}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['client'],
  data() {
    return {
      isZoomed: false
    };
  },
  methods: {
    toggleZoomed() {
      console.log('放大全屏');
      this.isZoomed = !this.isZoomed;
    }
  },
  mounted() {
    this.$refs.person.srcObject = this.client.peer.stream;
  },
  watch: {
    // 移动端不许点击
    isZoomed(val) {
      this.client.video.controls = val;
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
  position: absolute !important;
  top: 0;
  left: -5px; // 抵消person的margin

  z-index: 10;
  video {
    height: 95vh !important;
    width: 100vw !important;
    background: #222;
  }
}
.video__reverse {
  video {
    transform: scaleX(-1) !important;
  }
}
</style>