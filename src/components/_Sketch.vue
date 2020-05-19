<template>
  <div class="sketch">
    <div class="sketch__canvas">
      <vue-fabric @keyup.delete.native="handleRemove" ref="sketch" :width="500" :height="500"></vue-fabric>
    </div>
    <div class="sketch__toolbar">
      <el-button @click="rotate">a</el-button>
      <el-button
        @click="isDrawingMode = false; sketch.drawArrowLine({left: 20, top: 20,color: randomColor()})"
      >b</el-button>
      <el-button @click="isDrawingMode = !isDrawingMode">c</el-button>
      <el-button @click="handleRemove">asd</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDrawingMode: false
    };
  },
  computed: {
    sketch() {
      return this.$refs.sketch;
    }
  },
  methods: {
    randomColor() {
      return (
        '#' +
        Math.random()
          .toString()
          .substr(4, 6)
      );
    },
    handleRemove() {
      console.log('remove时间');
      this.sketch.removeCurrentObj();
    },
    rotate() {
      // const _vm = this;
      this.isDrawingMode = false;
      this.sketch.createCircle({ left: 20, top: 20 });
      this.sketch.createEqualTriangle({ left: 20, top: 20 });
    }
  },
  watch: {
    isDrawingMode(state) {
      const _vm = this;
      this.sketch.freeDrawConfig({
        isDrawingMode: state,
        color: _vm.randomColor()
      });
    }
  }
};
</script>

<style>
</style>