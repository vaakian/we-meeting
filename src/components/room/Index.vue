<template>
  <div class="room">
    <div class="video-side">
      <div class="people" id="people">
        <div class="person">
          <div class="person__video">
            <video ref="me" src></video>
          </div>
          <div class="person__name">
            <span style="color: red">(自己)</span>
            {{state.name}}
          </div>
        </div>
        <Person v-for="client in clients" :client="client" :key="client.peer.id"></Person>
      </div>
      <Controls />
    </div>
    <div class="chat-side">
      <Chat />
    </div>
  </div>
</template>

<script>
import Person from './partials/Person';
import Controls from './partials/Controls';
import Chat from './partials/Chat';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    Person,
    Controls,
    Chat
  },
  props: {
    room: String
  },
  computed: {
    ...mapGetters({
      state: 'getState',
      clients: 'getClients'
    })
  },
  methods: {
    ...mapMutations({
      addPeer: 'addPeer',
      removePeer: 'removePeer',
      setConnIsReady: 'setConnIsReady'
    })
  },
  mounted() {
    // 远程流
    window.webrtc.on('readyToCall', () => {
      window.webrtc.joinRoom(this.room);
      this.setConnIsReady(true);
      window.webrtc.on('videoAdded', (video, peer) => {
        this.addPeer({ video, peer });
      });

      window.webrtc.on('videoRemoved', (video, peer) => {
        this.removePeer(peer);
      });
    });
    // 本地流
    window.webrtc.on('localStream', stream => {
      console.log('天机本地流');
      let attachMediaStream = require('attachmediastream');
      attachMediaStream(stream, this.$refs.me, {
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
  height: 100%;
  position: relative;
  .video-side {
    display: inline-block;
    width: 65%;
    border: 1px solid;
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
    height: 100vh;
    display: inline-block;
    position: relative;
    &::-webkit-scrollbar {
      display: none;
    }
    @media screen and (max-width: 550px) {
      width: 100%;
      height: auto;
      min-height: 200px;
    }
  }
}

.people {
  display: flex;
  flex-wrap: wrap;
  vertical-align: baseline;
  width: 100%;
  padding: 40px;
}

video {
  width: 100%;
}

.person {
  position: relative;
  margin: 0 1% 60px 1%;
  width: 100%;

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
    width: 2  .5%;
    &:nth-of-type(4n) {
      margin-right: 0;
    }
    &:nth-of-type(4n + 1) {
      margin-left: 0;
    }
  }
}
</style>