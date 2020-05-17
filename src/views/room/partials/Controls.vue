<template>
  <div class="controls" :style="{'top': showControl ? '10px':'-60px'}">
    <el-menu default-active="1-4-1" class="controls__menu" mode="horizontal" :collapse="false">
      <el-row>
        <!-- 电脑端 -->
        <el-col :xs="0" :sm="20" :md="20" :lg="20" :xl="20">
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
        <el-col :xs="0" :sm="4" :md="4" :lg="4" :xl="4">
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
        <el-col class="controls__mobile" :xs="12" :sm="0" :md="0" :lg="0" :xl="0">
          <el-dropdown trigger="click" style="margin: 9px 0 0 10px;">
            <el-button type="primary" icon="el-icon-phone-outline" round>视频操作</el-button>
            <el-dropdown-menu slot="dropdown">
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
              <!-- <el-divider></el-divider>
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
              </el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :xs="12" :sm="0" :md="0" :lg="0" :xl="0">
          <el-menu-item style="float: right" index="6">
            <el-popover popper-class="controls__chat" placement="bottom" title="聊天" trigger="click">
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
          </el-menu-item>
        </el-col>
      </el-row>
    </el-menu>

    <!-- 收起、放下按钮 -->
    <div :class="{'controls__fold':true, 'controls__folded': !showControl}">
      <el-button
        class="controls__fold__btn"
        :icon="showControl ? 'el-icon-top':'el-icon-bottom'"
        :type="showControl ? 'success': 'primary'"
        @click="showControl = !showControl"
        circle
      ></el-button>
    </div>
  </div>
</template>

<script>
import Chat from './Chat';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: { Chat },
  data() {
    return {
      showControl: true
    };
  },
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
            this.$message.error({ message: '您取消了屏幕共享', offset: 70 });
            window.webrtc.stopScreenShare();
            this.setScreenSharing(false);
          } else if (event.stack) {
            this.$message.error({
              message: `${event.name} -> ${event.message}`,
              offset: 70
            });
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
  // top -65px;
  transition: 0.3s;
  position: absolute;
  width: 100%;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 98%;
  max-width: 650px;
  border-radius: 13px;
  z-index: 20;
  .el-button.is-round {
    border-radius: 13px !important;
  }
  &:hover &__fold {
    display: inline-block;
    bottom: -44px;
  }
  &__fold {
    width: 100%;
    transition: 0.3s;
    position: absolute;
    bottom: 0;
    z-index: -1;
    &__btn {
      transform: translateX(-50%);
      margin-left: 50% !important;
    }
  }
  &__folded {
    bottom: -44px;
  }
  &__chat {
    width: 600px;
    @media screen and(max-width: 620px) {
      width: 98vw;
    }
  }
  &__menu {
    border-radius: 13px;
    overflow: hidden;
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