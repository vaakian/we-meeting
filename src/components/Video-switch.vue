<template>
  <div class="switcher">
    <div class="switcher__audio">
      <span>开启麦克风</span>
      <el-switch :value="!state.muted" @change="val => setMuted(!val)"></el-switch>
    </div>
    <div class="switcher__video">
      <span>开启摄像头</span>
      <el-switch :value="!state.paused" @change="val => setPaused(!val)"></el-switch>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      state: 'getState'
    })
  },
  methods: {
    ...mapMutations(['setMuted', 'setPaused'])
  }
};
</script>

<style lang="scss">
.switcher {
  display: inline-block;
  margin-left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  margin-top: 10px;
  &__audio,
  &__video {
    display: inline-block;
    color: #409eff;
  }
}
</style>