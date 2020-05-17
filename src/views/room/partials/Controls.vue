<template>
  <div class="controls" :style="{'top': state.showControls ? '10px':'-60px'}">
    <el-menu
      default-active="1-4-1"
      active-text-color="#409eff"
      class="controls__menu"
      mode="horizontal"
      :collapse="false"
    >
      <el-row>
        <!-- 电脑端 -->
        <el-col :xs="0" :sm="20" :md="20" :lg="20" :xl="20">
          <el-menu-item style="padding-left: 8px; margin-bottom: 2px">
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
          <el-dropdown trigger="click" style="margin: 6px 0 0 10px;">
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
    <div :class="{'controls__fold':true, 'controls__folded': !state.showControls}">
      <el-button
        class="controls__fold__btn"
        :icon="state.showControls ? 'el-icon-top':'el-icon-bottom'"
        :type="state.showControls ? 'danger': 'primary'"
        @click="setShowControls(!state.showControls)"
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
  computed: {
    ...mapGetters({
      state: 'getState',
      messages: 'getMessages'
    })
  },
  methods: {
    ...mapMutations({
      setMuted: 'setMuted',
      setPaused: 'setPaused',
      setScreenSharing: 'setScreenSharing',
      setShowChat: 'setShowChat',
      setShowControls: 'setShowControls'
    }),
    muteMe() {
      this.setMuted(true);
    },

    unmuteMe() {
      this.setMuted(false);
    },
    pauseMe() {
      this.setPaused(true);
    },
    unpauseMe() {
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
  watch: {
    'state.muted': {
      handler: val => {
        console.log('执行了！！！');
        if (val) window.webrtc.mute();
        else window.webrtc.unmute();
      },
      immediate: true
    },
    'state.paused': {
      handler: val => {
        console.log('也执行了！！');
        if (val) window.webrtc.pauseVideo();
        else window.webrtc.resumeVideo();
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss">
@import '../../../assets/styles/controls';
</style>