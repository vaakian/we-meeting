<template>
  <div class="home-bg">
    <div class="home">
      <Icon />
      <div class="home__content">
        <h1>We Meeting</h1>
        <h2>——基于WebRTC的多人实时会议系统</h2>
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
              />
              <label for="name" class="label">给自己取一个名字吧</label>
              <el-input
                type="text"
                name="name"
                id="name"
                v-model.trim="name"
                placeholder="您在房间内的昵称"
                prefix-icon="el-icon-user"
              />
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
              />
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
import Icon from './Icon';
import { Message } from 'element-ui';
import { randomName } from '../uitls';
// 两个tab：
//    加入房间：有url自动填，无责留空。
//    创建会议：不显示房间号，只有名字，后面自动生成。
export default {
  components: { Icon },
  name: 'home',
  data() {
    const names = [];

    return {
      activeName: 'join',
      room: this.$route.query.room,
      name: randomName()
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
  width: 100vw;
  height: 100vh;
  background: linear-gradient(#cfe7ff, #017dff);
}

.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 80%;
  height: 80vh;
  position: absolute;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  background: white;
  box-shadow: 0 32px 62px 0 rgba(0, 0, 0, 0.3);
  @media screen and (max-width: 800px) {
    width: 90%;
    padding: 20px;
  }
  .button {
    margin-top: 20px;
  }
  .label {
    color: #999;
  }
  &__content {
    @media screen and(min-width: 720px) {
      transform: scale(1.5);
    }
  }
}

.join {
  width: 100%;
  max-width: 400px;
}
</style>