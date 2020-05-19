<template>
  <div class="home-bg">
    <div class="home">
      <Icon />
      <div class="home__content">
        <h1>We Meeting</h1>
        <h3>——基于WebRTC的多人实时会议系统</h3>
        <div ref="homeForm">
          <el-tabs style="margin-top: 20px" v-model="activeName" type="border-card">
            <el-tab-pane name="join">
              <span slot="label">
                <i class="el-icon-place" /> 加入会议
              </span>
              <form action="#" class="join" @submit.prevent="join">
                <span class="home__content__label">房间号</span>
                <el-input
                  type="text"
                  id="room"
                  v-model.trim="room"
                  placeholder="会议房间号"
                  prefix-icon="el-icon-service"
                  size="large"
                  maxlength="36"
                />
                <span class="home__content__label">给自己起个名字吧</span>
                <el-input
                  type="text"
                  name="name"
                  id="name"
                  v-model.trim="name"
                  placeholder="您在房间内的昵称"
                  prefix-icon="el-icon-user"
                  size="large"
                  maxlength="5"
                  minlength="1"
                />
                <VideoSwitch />
                <el-button type="primary" @click="join" class="button">加入会议</el-button>
              </form>
            </el-tab-pane>
            <!-- 创建会议 -->
            <el-tab-pane name="create">
              <span slot="label">
                <i class="el-icon-data-line" /> 创建会议
              </span>
              <form action="#" class="join" @submit.prevent="join">
                <span class="home__content__label">房间号(随机分配)</span>
                <el-input
                  type="text"
                  name="room"
                  id="room"
                  v-model.trim="room"
                  prefix-icon="el-icon-service"
                  size="large"
                  disabled
                />
                <span class="home__content__label">给自己起个名字吧</span>
                <el-input
                  type="text"
                  name="name"
                  id="name"
                  v-model.trim="name"
                  placeholder="您在房间内的昵称"
                  prefix-icon="el-icon-user"
                  size="large"
                />
                <VideoSwitch />
                <el-button type="primary" @click="join" class="button">创建会议</el-button>
              </form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import uuid from 'uuid/v4';
import Icon from '../components/Icon';
import VideoSwitch from '../components/Video-switch';
import { Message } from 'element-ui';
import { randomName } from '../uitls';
// import Adapter from 'webrtc-adapter';
// 两个tab：
//    加入房间：有url自动填，无责留空。
//    创建会议：不显示房间号，只有名字，后面自动生成。
export default {
  components: { Icon, VideoSwitch },
  name: 'home',
  data() {
    return {
      activeName: 'join',
      room: this.$route.query.room,
      name: randomName(),
      value: '',
      denied: false
    };
  },
  methods: {
    ...mapMutations({
      setMeName: 'setMeName'
    }),
    join() {
      if (!this.name) {
        Message.error('请输入您的昵称');
        return;
      }
      if (!this.room) {
        Message.error('请输入会议号，或者创建新的会议');
        return;
      }
      this.setMeName(this.name);
      this.$router.push({
        name: 'room',
        params: {
          room: this.room
        }
      });
    },
    checkIfBrowserSupportWebRTC() {
      const _vm = this;
      if (
        location.protocol === 'http:' &&
        ['127.0.0.1', 'localhost'].indexOf(location.host.split(':')[0]) === -1
      ) {
        _vm.$alert('请通过HTTPs访问本系统', '错误', {
          confirmButtonText: '确定',
          center: true,
          type: 'error'
        });
        _vm.$loading({
          target: _vm.$refs.homeForm,
          icon: 'el-icon-error',
          background: 'rgba(255,255,255, 0.7)'
        });
        return;
      }
      // console.log(Adapter.browserDetails.browser);
      try {
        console.log(navigator.mediaDevices);
        navigator.mediaDevices.getSupportedConstraints();
      } catch (err) {
        this.$message.warning({
          message: err.message,
          duration: 100000
        });
      }
    }
  },
  mounted() {
    this.checkIfBrowserSupportWebRTC();
  },
  watch: {
    activeName(val) {
      if (val === 'create') {
        this.room = uuid();
      } else {
        this.room = this.$route.query.room;
      }
    }
  }
};
</script>

<style lang="scss">
.home-bg {
  min-height: 100vh;
  background: linear-gradient(#cfe7ff, #017dff);
  background-image: linear-gradient(
    -225deg,
    #5d9fff 0%,
    #b8dcff 48%,
    #6bbbff 100%
  );
  //background-image: linear-gradient(-225deg, #22E1FF 0%, #3256a5 48%, #625EB1 100%);
  padding: 10px;
}

.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 550px;
  margin-bottom: 20px;
  min-height: 80vh;
  margin-top: 10vh;
  margin-left: 50%;
  transform: translateX(-50%);
  border-radius: 20px;
  background: white;
  box-shadow: 0 32px 62px 0 rgba(0, 0, 0, 0.3);

  &__content {
    max-width: 550px;
    h1 {
      text-align: center;
      text-shadow: 4px 0px #a9d3ff;
      font-weight: bold;
      background-clip: text;
      font-size: 3.3em;
    }
    h3 {
      color: 444;
      text-align: right;
      font-style: italic;
    }
    @media screen and (max-width: 550px) {
      padding: 15px;
      margin-top: 60px;
    }
    .button {
      margin-top: 20px;
      width: 100%;
    }
    &__label {
      padding: 5px;
      display: inline-block;
      color: #627e9a;
      // background: #f7f5f5;
      border-radius: 0 13px 13px 0;
      margin-top: 10px;
      font-size: 16px;
    }
    @media screen and(min-width: 720px) {
      // width: 80%;
      // transform: scale(1.3);
    }
  }
}

.join {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  font-size: 18px;
}
</style>