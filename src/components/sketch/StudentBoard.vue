<template>
  <!-- 工具栏 -->
  <div class="board-bg">
      <p class="board-title">{{nick}}正在使用画板</p>
    <div class="main-board">
      <PicBoard :canvasArr="canvasArr" :canvasIndex="canvasIndex" @changePage="changePage"></PicBoard>
    </div>
  </div>
</template>
<script>
import { fabric } from 'fabric';
// import socket from "../utils/socket"
import boardMixin from './mixins';
import PicBoard from './src/PicBoard';
// import { mapMutations } from 'vuex';

export default {
  name: 'StudentBoard',
  mixins: [boardMixin],
  components: {
    PicBoard
  },

  data() {
    return {
      nick: ''
    };
  },

  mounted() {
    this.init();
    this.addListener();
  },

  methods: {
    init() {
      this.canvasObj = new fabric.Canvas(`c${this.canvasIndex}`, {
        isDrawingMode: false,
        selectable: false,
        selection: false
      });
      this.canvasObj.setHeight(window.innerHeight);
      this.canvasObj.setWidth(window.innerWidth);
      this.$set(this.canvasArr, this.canvasIndex, this.canvasObj);
    },

    addListener() {
      // 接受教师端播放的数据
      window.webrtc.connection.on('message', ({ type, payload }) => {
        if (type == 'sketch') {
          this.nick = payload.nick;
          this.play(payload.sketch);
        }
      });
    },

    // 播放
    play(data) {
      this.canvasObj.loadFromJSON(data, () => {
        this.canvasObj.renderAll();
      });
    }
  }
};
</script>

<style lang="scss">
.board-bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
}
.board-title {
  font-size: 25px;
  text-align: center;
  position: fixed;
  color: white;
  width: 100%;
  top: 5px;
}
.main-board {
  width: 90%;
  height: 90%;
  margin-left: 50%;
  margin-top: 50vh;
  transform: translate(-50%, -50%);
  overflow: hidden;
}
</style>