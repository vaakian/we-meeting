<template>
  <div class="home">
      <h1>We Meeting - <em>基于webRTC的多人实时会议系统</em></h1>
    <form action="#" class="join" @submit.prevent="join">
      <label for="room" class="label">房间号</label>
      <input
        type="text"
        name="room"
        id="room"
        class="input"
        v-model.trim="room"
        placeholder="e.g. abc"
      />
      <label for="name" class="label">给自己取一个名字吧</label>
      <input type="text" name="name" id="name" class="input" v-model.trim="name" />
      <button type="submit" class="button button--primary">加入会议</button>
    </form>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import uuid from 'uuid/v4';
import SimpleWebRTC from 'simplewebrtc';

export default {
  name: 'home',
  data() {
    return {
      room: this.$route.query.room || uuid(),
      name: ''
    };
  },
  methods: {
    ...mapMutations({
      setMeName: 'setMeName'
    }),
    join() {
      this.setMeName(this.name);

      window.webrtc = new SimpleWebRTC({
        localVideoEl: '',
        remoteVideosEl: '',
        autoRequestMedia: true,
        nick: this.name,
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
        debug: true
      });

      this.$router.push({
        name: 'room',
        params: {
          room: this.room
        }
      });
    }
  }
};
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.join {
  width: 100%;
  max-width: 400px;
}
</style>