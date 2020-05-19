<template>
  <div class="room">
    <div class="video-side">
      <div
        class="people"
        :style="{'padding-top': state.showControls ? '120px': '10px'}"
        id="people"
      >
        <!-- 自己的共享屏幕 -->
        <div class="person person__show" v-show="state.screenSharing">
          <div class="person__video">
            <video autoplay ref="meScreen"></video>
            <div class="person__name">
              <span style="color: red">(自己)[屏幕共享]</span>
            </div>
          </div>
        </div>

        <!-- 自己的摄像头 -->
        <div v-show="chatable" class="person">
          <div class="person__video person__show">
            <video ref="meVideo" src></video>
            <div class="person__name">
              <span style="color: red">(自己)</span>
              {{state.name}}
            </div>
          </div>
        </div>
        <!-- 视频用户 -->
        <Video
          v-for="client in videoClients"
          :client="client"
          :key="client.peer.id+client.peer.type"
        ></Video>
        <!-- 屏幕用户 -->
        <Video
          v-for="client in screenClients"
          :client="client"
          :key="client.peer.id+client.peer.type"
        ></Video>
      </div>
    </div>
    <Controls v-if="chatable" />
    <template v-if="state.isSketching">
      <TeacherBoard v-if="state.showTeacherBoard" />
      <StudentBoard v-else />
    </template>
  </div>
</template>

<script>
import Video from './partials/Video';
import TeacherBoard from '../../components/sketch/TeacherBoard';
import StudentBoard from '../../components/sketch/StudentBoard';
import Controls from './partials/Controls';
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
import SimpleWebRTC from 'xwj-simplewebrtc';
import { enumerateDevices } from '../../uitls';
export default {
  components: {
    Video,
    Controls,
    TeacherBoard,
    StudentBoard
  },
  props: {
    room: String
  },
  data() {
    return {
      chatable: false
    };
  },
  computed: {
    ...mapGetters({
      state: 'getState',
      videoClients: 'getVideoClients',
      screenClients: 'getScreenClients',
      sketchClients: 'getSketchClients'
    }),
    ...mapState({ sketchStream: 'draw/stream' })
  },
  methods: {
    ...mapMutations({
      addPeer: 'addPeer',
      removePeer: 'removePeer',
      setConnIsReady: 'setConnIsReady',
      setScreenSharing: 'setScreenSharing',
      setShowTeacherBoard: 'setShowTeacherBoard',
      setIsSketching: 'setIsSketching',
      setShowControls: 'setShowControls'
    }),
    initMedia(media) {
      // 远程流
      window.webrtc = new SimpleWebRTC({
        localVideoEl: '',
        remoteVideosEl: '',
        autoRequestMedia: false,
        adjustPeerVolume: true,
        nick: this.state.name,
        url: 'https://mohan.z-os.cn',
        peerConnectionConfig: {
          iceServers: [
            {
              url: 'stun:116.63.153.127'
            },
            {
              url: 'turn:116.63.153.127',
              secret: 'xwj',
              username: 'xwj',
              credential: 'xwj'
            }
          ]
          // iceTransports: 'relay'
        },
        media,
        debug: false
      });
      // 请求摄像头
      window.webrtc.startLocalVideo();
      // 请求准备完成，进入房间, readyToCall
      window.webrtc.on('readyToCall', () => {
        console.log('加入房间', this.room);
        window.webrtc.joinRoom(this.room);
        this.setConnIsReady(true);
        this.chatable = true;
      });
      window.webrtc.on('sketchStream', stream => {
        console.log('接收到了画布', stream);
      });
      // 用户加入离开事件
      window.webrtc.on('videoAdded', (video, peer) => {
        console.log('加入事件', { peer });
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
        console.log('本地视频停止了', { args });
        window.webrtc.stopScreenShare();
        this.setScreenSharing(false);
      });

      // 本地流
      window.webrtc.on('localStream', stream => {
        console.log('添加本地流');
        let attachMediaStream = require('xwj-attachmediastream');
        // 关闭本地流声音 避免回音
        stream.getAudioTracks()[0].enabled = false;
        attachMediaStream(stream, this.$refs.meVideo, {
          autoplay: true,
          mirror: true,
          muted: true
        });
      });
      window.webrtc.connection.on('message', ({ type }) => {
        // 显示学生观看画板
        if (type === 'sketch') this.startWatchSketch();
        else if (type === 'exitSketch') this.exitSketch();
      });
    },
    ...mapActions(['startWatchSketch', 'exitSketch', 'startSketch'])
  },
  mounted() {
    enumerateDevices().then(constraints => {
      let { video, audio } = constraints;
      let media;
      if (video && audio) {
        console.log('摄像头、麦克风都有');
        media = {
          video: {
            // width: { max: 1080, min: 720 },
            // height: { max: 720, min: 480 },
            width: 640,
            height: 480,
            frameRate: { ideal: 7, max: 10 }
          },
          audio: true
        };
      } else if (audio) {
        // 只有麦克风
        console.log('只有麦克风');
        media = { video: false, audio: true };
      } else if (video) {
        // 只有视频
        console.log('只有摄像头');
        media = {
          video: {
            width: 640,
            height: 480,
            frameRate: { ideal: 7, max: 10 }
          },
          audio: false
        };
      } else {
        console.log('摄像头、麦克风都无');
        // 都无
        media = { video: false, audio: true };
      }
      console.log({ media });
      this.initMedia(media);
    });

    window.$globaLoadingInstance = this.$loading({
      lock: true,
      text: '会议初始化中…',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.8)'
    });
    // 最长十秒
    setTimeout(() => {
      window.$globaLoadingInstance.close();
    }, 10000);

    // 刷新前，退出画板
    window.onbeforeunload = () => {
      this.exitSketch();
    };
  },
  watch: {
    chatable(val) {
      if (val) {
        // 刚加入不允许提示用户加入
        window.$allowJoinMessage = false;
        setTimeout(() => {
          window.$allowJoinMessage = true;
        }, 2000);
        // 关闭全局加载
        window.$globaLoadingInstance.close();
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    window.webrtc.leaveRoom();
    window.webrtc.stopLocalVideo();
    window.webrtc.stopScreenShare();
    next();
  }
};
</script>

<style lang="scss">
.room {
  min-height: 100vh;
  position: relative;
  // background: linear-gradient(#cfe7ff, #cee7f8);
  // background-image: linear-gradient(-225deg, #7de2fc 0%, #b9b6e5 100%);
  background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);
  background-image: linear-gradient(to top, #6a85b6 0%, #bac8e0 100%);
  //background: white;
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
  transition: 0.3s;
}

video {
  width: 100%;
}
</style>