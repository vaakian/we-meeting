<template>
  <div class="controls">
    <el-menu default-active="1-4-1" class="controls__menu" mode="horizontal" :collapse="false">
      <el-row>
        <!-- 电脑端 -->
        <el-col :xs="0" :sm="12" :md="12" :lg="12" :xl="12">
          <el-menu-item>
            <div>
              <el-button
                icon="el-icon-headset"
                type="danger"
                v-if="!state.muted"
                @click="muteMe"
                round
              >关闭麦克风</el-button>
              <el-button icon="el-icon-headset" type="primary" v-else @click="unmuteMe" round>打开麦克风</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                icon="el-icon-camera"
                type="danger"
                v-if="!state.paused"
                @click="pauseMe"
                round
              >关闭摄像头</el-button>
              <el-button icon="el-icon-camera" type="primary" v-else @click="unpauseMe" round>打开摄像头</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                icon="el-icon-monitor"
                type="danger"
                v-if="state.screenSharing"
                @click="stopScreenShare"
                round
              >取消屏幕共享</el-button>
              <el-button
                icon="el-icon-monitor"
                type="primary"
                v-else
                @click="shareScreen"
                round
              >屏幕共享</el-button>
            </div>
          </el-menu-item>
        </el-col>
        <el-col :xs="0" :sm="12" :md="12" :lg="12" :xl="12">
          <el-menu-item style="float: right; margin-right: 20px" index="4">
            <el-popover
              slot="title"
              popper-class="controls__chat"
              placement="bottom"
              title="聊天"
              trigger="click"
              @click.native="setShowChat(!state.showChat)"
            >
              <Chat />
              <div slot="reference">
                <i class="el-icon-message"></i>
                <el-badge slot="title" :value="messages.length" :max="99">
                  <span>聊天</span>
                </el-badge>
              </div>
            </el-popover>
          </el-menu-item>
        </el-col>
        <!-- 移动端 -->
        <el-col class="controls__mobile" :sm="0" :md="0" :lg="0" :xl="0">
          <el-dropdown trigger="click" style="float: right; margin: 10px;">
            <el-link type="primary">
              下拉菜单
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-link>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-popover
                  popper-class="controls__chat"
                  placement="bottom"
                  title="聊天"
                  trigger="click"
                >
                  <Chat :nohandler="true" />
                  <div slot="reference">
                    <i class="el-icon-message"></i>
                    <el-badge
                      @click.native="setShowChat(!state.showChat)"
                      slot="title"
                      :value="messages.length"
                      :max="99"
                    >
                      <span>聊天</span>
                    </el-badge>
                  </div>
                </el-popover>
              </el-dropdown-item>
              <el-divider></el-divider>
              <el-dropdown-item>
                <el-button
                  icon="el-icon-headset"
                  type="danger"
                  v-if="!state.muted"
                  @click="muteMe"
                  round
                >关闭麦克风</el-button>
                <el-button
                  icon="el-icon-headset"
                  type="primary"
                  v-else
                  @click="unmuteMe"
                  round
                >打开麦克风</el-button>
              </el-dropdown-item>
              <el-divider></el-divider>
              <el-dropdown-item>
                <el-button
                  icon="el-icon-camera"
                  type="danger"
                  v-if="!state.paused"
                  @click="pauseMe"
                  round
                >关闭摄像头</el-button>
                <el-button
                  icon="el-icon-camera"
                  type="primary"
                  v-else
                  @click="unpauseMe"
                  round
                >打开摄像头</el-button>
              </el-dropdown-item>
              <el-divider></el-divider>
              <el-dropdown-item>
                <el-button
                  icon="el-icon-monitor"
                  type="danger"
                  v-if="state.screenSharing"
                  @click="stopScreenShare"
                  round
                >关屏幕共享</el-button>
                <el-button
                  icon="el-icon-monitor"
                  type="primary"
                  v-else
                  @click="shareScreen"
                  round
                >开屏幕共享</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-menu>
  </div>
</template>

<script>
import Chat from './Chat';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: { Chat },
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
        if (event) {
          if (event.code === 0) {
            this.$message.error('您取消了屏幕共享');
            window.webrtc.stopScreenShare();
            this.setScreenSharing(false);
          } else if (event.stack) {
            this.$message.error(`${event.name} -> ${event.message}`);
            this.setScreenSharing(false);
          }
        } else {
          this.setScreenSharing(true);
        }
      });
    },
    stopScreenShare() {
      window.webrtc.stopScreenShare();
      this.setScreenSharing(false);
    }
  },
  computed: {
    ...mapGetters({
      state: 'getState',
      messages: 'getMessages'
    })
  }
};
</script>

<style lang="scss">
.controls {
  position: absolute;
  width: 100%;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 98%;
  max-width: 650px;
  border-radius: 13px;
  overflow: hidden;
  z-index: 20;
  .el-button.is-round {
    border-radius: 13px !important;
  }
  &__chat {
    width: 600px;
    @media screen and(max-width: 620px) {
      width: 98vw;
    }
  }
  &__mobile {
  }
  .el-menu-item .is-round i {
    color: white;
  }
  .el-badge__content {
    top: 15px !important;
  }
  &__off {
    background: red;
  }
  &__item {
    font-weight: 600;
    flex: 1;
    padding: 10px;
    border-right: 1px solid #0e83dc;
  }

  &__link {
    color: #fff;
    display: block;
    text-align: center;
    text-decoration: none;
    height: 100%;
    width: 100%;
  }
  .disabled {
    background: #999;
    color: #ccc;
  }
}
</style>