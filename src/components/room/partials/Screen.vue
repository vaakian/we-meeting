<template>
  <div :class="{'person': true, 'person__zoom': isZoomed}">
    <div class="person__video" @click="toggleZoomed">
      <video ref="person" autoplay></video>
    </div>
    <div class="person__name">
      <span>{{client.peer.nick}}[屏幕共享]</span>
      <p>{{client.peer.stream.id}}</p>
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
    isZoomed(val) {
      this.client.video.controls = val;
    }
  }
};
</script>