<!-- display the log when event happens, such as user join/leave, share screen, message -->
<template>
  <div class="users" :style="{'display': state.showControls? 'block':'none'}">
    <el-popover placement="bottom" title="会议成员" width="170" trigger="click">
      <el-input class="users__kw" v-model="nickKeyword" placeholder="搜索成员"></el-input>
      <ul class="users__container">
        <li class="users__user" v-for="({peer}, index) in kwClients" :key="index">
          <div
            :style="{background: hashColor(peer.nick)}"
            class="users__user__avatar"
          >{{peer.nick[0]}}</div>
          <div class="users__user__nick">{{peer.nick}}</div>
        </li>
      </ul>
      <el-tooltip slot="reference" content="会议成员" placement="bottom">
        <el-button type="primary" icon="el-icon-user" circle></el-button>
      </el-tooltip>
    </el-popover>

    <el-tooltip content="退出会议">
      <el-button
        @click="handleExitMeeting"
        style="margin-left: 5px"
        icon="el-icon-close"
        type="danger"
        circle
      ></el-button>
    </el-tooltip>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { hashColor } from '../../../uitls';
export default {
  data() {
    return {
      nickKeyword: ''
    };
  },
  computed: {
    ...mapGetters({
      otherClients: 'getVideoClients',
      myNick: 'getName',
      state: 'getState',
      room: 'getRoom'
    }),

    kwClients() {
      const { myNick, nickKeyword, otherClients } = this;
      const clients = [{ peer: { nick: myNick } }, ...otherClients];
      if (nickKeyword === '') return clients;
      else
        return clients.filter(
          ({ peer }) => peer.nick.indexOf(nickKeyword) !== -1
        );
    }
    // clients() {
    //   return [
    //     { peer: { nick: '熊维建' } },
    //     { peer: { nick: '马化腾' } },
    //     { peer: { nick: '两千多' } },
    //     { peer: { nick: '非标' } },
    //     { peer: { nick: '华刘飞' } },
    //     { peer: { nick: '熊维建' } },
    //     { peer: { nick: '马化腾' } },
    //     { peer: { nick: '两千多' } },
    //     { peer: { nick: '非标' } },
    //     { peer: { nick: '华刘飞' } },
    //     { peer: { nick: '熊维建' } },
    //     { peer: { nick: '马化腾' } },
    //     { peer: { nick: '两千多' } },
    //     { peer: { nick: '非标' } },
    //     { peer: { nick: '华刘飞' } },
    //     { peer: { nick: '熊维建' } },
    //     { peer: { nick: '马化腾' } },
    //     { peer: { nick: '两千多' } },
    //     { peer: { nick: '非标' } },
    //     { peer: { nick: '华刘飞' } }
    //   ];
    // }
  },
  methods: {
    hashColor,
    handleExitMeeting() {
      this.$confirm('确认退出会议?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this);
        this.$router.push({ path: `/?room=${this.room}` });
      });
    }
  }
};
</script>

<style lang="scss">
$userlistHeight: 45px;

.users {
  position: absolute;
  top: 15px;
  right: 15px;
  &__kw {
    margin-bottom: 5px;
  }
  &__container {
    max-height: 55vh;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  @media screen and(max-width:768px) {
    display: none;
  }
  &__user {
    list-style-type: none;
    font-size: 20px;

    margin-bottom: 10px;
    //border-bottom: 1px dashed rgba(92, 92, 92, 0.2);
    background: #f3f3f3;
    border-radius: 22.5px 22.5px 22.5px 22.5px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 4px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
    margin-right: 5px;
    &__avatar {
      width: $userlistHeight !important;
      height: $userlistHeight !important;
      line-height: $userlistHeight !important;
      display: inline-block;
      border-radius: 50%;
      text-align: center;
      font-size: 20px;
      color: white;
    }
    &__nick {
      display: inline-block;
      vertical-align: top;
      line-height: $userlistHeight;
      padding-left: 5px;
      color: #6f686d;
    }
  }
}
</style>