<template>
  <div class="home-bg">
    <div class="home">
      <Icon />
      <div class="home__content">
        <h1>We Meeting</h1>
        <h3>——基于WebRTC的多人实时会议系统</h3>
        <el-tabs style="margin-top: 20px" v-model="activeName" type="border-card">
          <el-tab-pane label="加入会议" name="join">
            <form action="#" class="join" @submit.prevent="join">
              <label for="room" class="label">房间号</label>
              <el-input
                type="text"
                name="room"
                id="room"
                v-model.trim="room"
                placeholder="会议房间号"
                prefix-icon="el-icon-service"
                size="large"
                maxlength="36"
              />
              <label for="name" class="label">给自己取一个名字吧</label>
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
          <el-tab-pane label="创建会议" name="create">
            <form action="#" class="join" @submit.prevent="join">
              <label for="room" class="label">房间号(随机生成)</label>
              <el-input
                type="text"
                name="room"
                id="room"
                v-model.trim="room"
                prefix-icon="el-icon-service"
                size="large"
                disabled
              />
              <label for="name" class="label">给自己取一个名字吧</label>
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
</template>

<script>
import { mapMutations } from 'vuex';
import uuid from 'uuid/v4';
import Icon from '../components/Icon';
import VideoSwitch from '../components/Video-switch';
import { Message } from 'element-ui';
import { randomName } from '../uitls';

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
      value: ''
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
    }
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
  padding: 20px;
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
  h1 {
    text-align: center;
    text-shadow: 4px 0px #a9d3ff;
    font-weight: bold;
    background-clip: text;
    font-size: 2.3em;
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
  .label {
    color: #999;
  }
  &__content {
    max-width: 550px;
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