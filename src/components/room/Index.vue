<template>
  <div class="room">
    <div class="video-side">
      <div class="people" id="people">
        <!-- 自己的共享屏幕 -->
        <div class="person" v-show="state.screenSharing">
          <div class="person__video">
            <video autoplay ref="meScreen"></video>
          </div>
          <div class="person__name">
            <span style="color: red">(自己)[屏幕共享]</span>
          </div>
        </div>
        <!-- 自己的摄像头 -->
        <div class="person">
          <div class="person__video">
            <video ref="meVideo" src></video>
          </div>
          <div class="person__name">
            <span style="color: red">(自己)</span>
            {{state.name}}
          </div>
        </div>
        <!-- 视频用户 -->
        <Video
          v-for="client in videoClients"
          :client="client"
          :key="client.peer.id+client.peer.type"
        ></Video>
        <!-- 屏幕用户 -->
        <Screen
          v-for="client in screenClients"
          :client="client"
          :key="client.peer.id+client.peer.type"
        ></Screen>
      </div>
      <Controls />
    </div>
    <div :style="{height: state.showChat ? '80vh': 0}" class="chat-side">
      <Chat />
    </div>
  </div>
</template>

<script>
import Video from './partials/Video';
import Screen from './partials/Screen';
import Controls from './partials/Controls';
import Chat from './partials/Chat';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    Video,
    Screen,
    Controls,
    Chat
  },
  props: {
    room: String
  },
  computed: {
    ...mapGetters({
      state: 'getState',
      videoClients: 'getVideoClients',
      screenClients: 'getScreenClients'
    })
  },
  methods: {
    ...mapMutations({
      addPeer: 'addPeer',
      removePeer: 'removePeer',
      setConnIsReady: 'setConnIsReady',
      setScreenSharing: 'setScreenSharing'
    })
  },
  mounted() {
    // 远程流
    window.webrtc.on('readyToCall', () => {
      console.log('加入房间', this.room);
      window.webrtc.joinRoom(this.room);
      this.setConnIsReady(true);
    });
    // 用户加入离开事件
    window.webrtc.on('videoAdded', (video, peer) => {
      console.log('加入事件', peer.stream.id);
      this.addPeer({ video, peer });
    });
    window.webrtc.on('videoRemoved', (video, peer) => {
      // 自己关闭共享、视频不调用remove
      peer && this.removePeer(peer);
    });
    // 本地视频获取到之后，发送个其他人
    window.webrtc.on('localScreen', stream => {
      console.log('本地视频added', stream);
      this.$refs.meScreen.srcObject = stream;
    });
    window.webrtc.on('localScreenStopped', (...args) => {
      // 外部按钮停止，还需要通知房间，隐藏自己
      console.log('本地视频停止了',{ args });
      window.webrtc.stopScreenShare();
      this.setScreenSharing(false);
    });
    // 本地流
    window.webrtc.on('localStream', stream => {
      console.log('添加本地流');
      let attachMediaStream = require('attachmediastream');
      attachMediaStream(stream, this.$refs.meVideo, {
        autoplay: true,
        mirror: true,
        muted: true
      });
    });
  }
};
</script>

<style lang="scss">
.room {
  height: 100vh;
  position: relative;
  .video-side {
    display: inline-block;
    width: 100%;
    position: relative;
    overflow-y: scroll;
    height: 100%;
    @media screen and (max-width: 550px) {
      width: 100%;
      height: auto;
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .chat-side {
    width: 35%;
    overflow-y: scroll;
    height: 80%;
    display: inline-block;
    position: absolute;
    top: 52px;
    right: 20px;
    background: #eee;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    transition: 0.3s;
    z-index: 20;
    &::-webkit-scrollbar {
      display: none;
    }
    @media screen and (max-width: 550px) {
      width: 90%;
      // height: auto;
      // min-height: 200px;
    }
  }
}

.people {
  display: flex;
  flex-wrap: wrap;
  vertical-align: baseline;
  width: 100%;
  padding: 5px;
  padding-top: 60px;
}

video {
  width: 100%;
}

.person {
  position: relative;
  width: 100%;
  display: inline-block;
  &__video {
    background-color: #ccc;
    margin-bottom: 10px;
    box-shadow: 0 10px 25px rgba(49, 49, 49, 0.2);
    border-radius: 3px;
  }

  &__name {
    text-align: center;
    font-weight: 600;
  }

  @media (min-width: 576px) and (max-width: 767px) {
    width: 49%;
    &:nth-of-type(2n) {
      margin-right: 0;
    }
    &:nth-of-type(2n + 1) {
      margin-left: 0;
    }
  }
  @media (min-width: 768px) and (max-width: 991px) {
    width: 32%;
    &:nth-of-type(3n) {
      margin-right: 0;
    }
    &:nth-of-type(3n + 1) {
      margin-left: 0;
    }
  }
  @media (min-width: 992px) {
    width: 23.5%;
    &:nth-of-type(4n) {
      margin-right: 0;
    }
    &:nth-of-type(4n + 1) {
      margin-left: 0;
    }
  }
}
</style>