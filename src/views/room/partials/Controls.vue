<template>
  <div :class="{'controls': true, 'controls-hide': !state.showControls}">
    <el-menu
      default-active="1-4-1"
      active-text-color="#409eff"
      class="controls__menu"
      mode="horizontal"
      :collapse="false"
    >
      <el-row>
        <!-- 电脑端 -->
        <el-col :xs="0" :sm="18" :md="18" :lg="18" :xl="18">
          <el-menu-item style="padding-left: 8px; margin-bottom: 2px">
            <div>
              <el-button
                icon="el-icon-microphone"
                type="danger"
                v-if="!state.muted"
                @click="muteMe"
                round
              >关麦克风</el-button>
              <el-button
                icon="el-icon-turn-off-microphone"
                type="primary"
                v-else
                @click="unmuteMe"
                round
              >开麦克风</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                icon="el-icon-camera"
                type="danger"
                v-if="!state.paused"
                @click="pauseMe"
                round
              >关摄像头</el-button>
              <el-button icon="el-icon-camera" type="primary" v-else @click="unpauseMe" round>开摄像头</el-button>
              <br />
              <!-- 分行 -->
              <el-button
                icon="el-icon-monitor"
                type="danger"
                v-if="state.screenSharing"
                @click="stopScreenShare"
                round
              >取消共享</el-button>
              <el-button
                icon="el-icon-monitor"
                type="primary"
                v-else
                @click="shareScreen"
                :disabled="isMobile"
                round
              >屏幕共享</el-button>
              <!-- 画板 -->
              <el-divider direction="vertical"></el-divider>
              <el-button
                icon="el-icon-edit"
                type="primary"
                @click="startSketch"
                :disabled="state.isSketching || isMobile"
                round
              >实时画板</el-button>
            </div>
          </el-menu-item>
        </el-col>

        <!-- 移动端操作按钮 -->
        <el-col class="controls__mobile" :xs="11" :sm="0" :md="0" :lg="0" :xl="0">
          <el-dropdown trigger="click" style="margin: 6px 0 0 10px;">
            <el-button type="primary" icon="el-icon-phone-outline" round>视频操作</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  icon="el-icon-microphone"
                  type="danger"
                  v-if="!state.muted"
                  @click="muteMe"
                  round
                >关麦克风</el-button>
                <el-button
                  icon="el-icon-turn-off-microphone"
                  type="primary"
                  v-else
                  @click="unmuteMe"
                  round
                >开麦克风</el-button>
              </el-dropdown-item>
              <el-divider></el-divider>
              <el-dropdown-item>
                <el-button
                  icon="el-icon-camera"
                  type="danger"
                  v-if="!state.paused"
                  @click="pauseMe"
                  round
                >关摄像头</el-button>
                <el-button icon="el-icon-camera" type="primary" v-else @click="unpauseMe" round>开摄像头</el-button>
              </el-dropdown-item>
              <!-- <el-divider></el-divider>
              <el-button
                icon="el-icon-edit"
                type="primary"
                @click="startSketch"
                :disabled="state.isSketching"
                round
              >实时画板</el-button>-->
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <!-- 移动端分享 -->
        <el-col :xs="4" :sm="0" :md="0" :lg="0" :xl="0">
          <el-menu-item index="5">
            <el-popover
              slot="title"
              popper-class="controls__tool"
              placement="bottom"
              title="分享会议"
              trigger="click"
            >
              <Share />
              <div slot="reference">
                <i class="el-icon-share"></i>
                <el-badge slot="title" is-dot>
                  <span>分享</span>
                </el-badge>
              </div>
            </el-popover>
          </el-menu-item>
        </el-col>
        <!-- 聊天、分享 -->
        <el-col :xs="7" :sm="6" :md="6" :lg="6" :xl="6" style="float: right">
          <el-menu-item index="3" class="controls__pc__share">
            <el-popover
              slot="title"
              popper-class="controls__tool"
              placement="bottom"
              title="分享会议"
              trigger="click"
            >
              <Share />
              <div slot="reference">
                <i class="el-icon-share"></i>
                <el-badge slot="title" is-dot>
                  <span>分享</span>
                </el-badge>
              </div>
            </el-popover>
          </el-menu-item>
          <el-menu-item index="4">
            <el-popover popper-class="controls__chat" placement="bottom" title="聊天" trigger="click">
              <div slot="reference">
                <i class="el-icon-chat-dot-round"></i>
                <el-badge
                  @click.native="setShowChat(!state.showChat)"
                  slot="title"
                  :value="messages.length"
                  :max="99"
                >
                  <span>聊天</span>
                </el-badge>
              </div>

              <Chat />
            </el-popover>
          </el-menu-item>
        </el-col>
      </el-row>
      <el-divider class="controls__divider" style="margin: 0;"></el-divider>
      <UserList class="users__mobile" />
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
import Share from '../../../components/Share';
import UserList from './User-list';
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  components: { Chat, Share, UserList },
  computed: {
    ...mapGetters({
      state: 'getState',
      messages: 'getMessages'
    }),
    ...mapState(['isMobile'])
  },
  methods: {
    ...mapMutations({
      setMuted: 'setMuted',
      setPaused: 'setPaused',
      setScreenSharing: 'setScreenSharing',
      setShowChat: 'setShowChat',
      setShowControls: 'setShowControls'
    }),
    ...mapActions(['startSketch']),
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
      window.webrtc.shareScreen({ video: true, audio: true }, event => {
        if (event) {
          if (event.code === 0) {
            this.$notify.error({ message: '您取消了屏幕共享' });
            window.webrtc.stopScreenShare();
            this.setScreenSharing(false);
          } else if (event.stack) {
            this.$notify.error({
              message: `${event.name} -> ${event.message}`
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
        if (val) window.webrtc.mute();
        else window.webrtc.unmute();
      },
      immediate: true
    },
    'state.paused': {
      handler: val => {
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