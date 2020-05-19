<template>
  <div @click.self.prevent.stop="exitSketching" class="board-bg">
    <p class="board-title">你正在使用画板</p>
    <div class="main-board">
      <!-- 左侧工具栏 -->
      <LeftTools @uploadFile="uploadFile" @handleTools="handleTools"></LeftTools>

      <!-- 上方工具栏 -->
      <TopTools @handleTools="handleTools"></TopTools>

      <!-- 主画图区 -->
      <PicBoard :canvasArr="canvasArr" :canvasIndex="canvasIndex" @changePage="changePage"></PicBoard>
    </div>
  </div>
</template>
<script>
import { fabric } from 'fabric';
import boardMixin from './mixins';
import TopTools from './src/TopTools';
import PicBoard from './src/PicBoard';
import LeftTools from './src/LeftTools';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'TeacherBoard',

  components: {
    PicBoard,
    LeftTools,
    TopTools
  },

  mixins: [boardMixin],

  data() {
    return {
      drawingObject: null, // 当前绘制对象
      isDrawing: false,
      textObject: null
    };
  },

  mounted() {
    this.initKeyboardEvent();
    this.initCanvas();
    // 通知
    this.broadCastNotify();
    // 有用户加入，通知他正在画画 (如果是自己在画)
    window.webrtc.on('createdPeer', () => {
      if (this.state.isSketching && this.state.showTeacherBoard) this.broadCastNotify();
    });
  },
  beforeDestroy() {
    this.exitSketching();
    this.setShowControls(true);
  },
  computed: {
    ...mapGetters({
      state: 'getState'
    }),
    isFreeDrawing() {
      return this.type === 'free';
    }
  },

  methods: {
    broadCastNotify() {
      this.sendEvent();
      // 第二次是画画
      setTimeout(() => this.sendEvent(), 250);
    },
    ...mapMutations(['setIsSketching', 'setShowControls']),
    initCanvas() {
      this.addCanvas();
      this.initEvent();
    },
    exitSketching() {
      // 退出画布
      window.webrtc.sendToAll('exitSketch', false);
      this.setIsSketching(false);
    },
    initEvent() {
      this.canvasObj.on({
        'mouse:down': this.mouseDown,
        'mouse:up': this.mouseUp,
        'mouse:move': this.mouseMove,
        'object:added': this.objectAdded,
        'object:rotating': this.objectRotating,
        'object:scaling': this.objectScaling,
        'object:moving': this.objectMoving,
        'object:modified': this.objectModified,
        'selection:created': this.selectionCreated
      });
    },

    initKeyboardEvent() {
      document.addEventListener('keydown', ({ keyCode }) => {
        const isUpArrow = keyCode === 38;
        const isDownArrow = keyCode === 40;
        if (isUpArrow || isDownArrow) {
          const index = isUpArrow ? this.canvasIndex - 1 : this.canvasIndex + 1;
          this.changePage(this.canvasArr[index], index);
        }
      });
    },

    uploadFile(e) {
      // 设置图片
      const addImage = data => {
        const imgObj = new Image();
        imgObj.src = data;
        imgObj.onload = () => {
          const image = new fabric.Image(imgObj);
          this.canvasObj.centerObject(image);
          this.canvasObj.add(image);
          this.canvasObj.renderAll();
        };
      };
      // 设置背景
      const addBackground = data => {
        fabric.Image.fromURL(data, img => {
          this.canvasObj.setBackgroundImage(
            img,
            this.canvasObj.renderAll.bind(this.canvasObj),
            {
              scaleX: this.canvasObj.width / img.width,
              scaleY: this.canvasObj.height / img.height
            }
          );
        });
      };
      const reader = new FileReader();
      reader.onload = event => {
        const data = event.target.result;
        (this.type === 'background' ? addBackground : addImage)(data);
      };
      reader.readAsDataURL(e.target.files[0]);
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
.main-board {
  width: 90%;
  height: 90%;
  margin-left: 50%;
  margin-top: 50vh;
  transform: translate(-50%, -50%);
  svg {
    //max-width: 100%;
    // max-height: 100%;
    width: 100%;
    height: 100%;
    max-width: 65px;
    max-height: 65px;
    position: relative;
  }
  .slide-fade-enter-active {
    transition: all 0.5s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.5s;
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    opacity: 0;
    transform: translateX(-10px);
  }
}
</style>
