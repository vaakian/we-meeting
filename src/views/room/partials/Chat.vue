<template>
  <div class="chat">
    <!-- 聊天内容 -->
    <ul class="chat__content" ref="chatContent">
      <li class="chat__content__empty" v-if="messages.length === 0">还没有任何消息哦~</li>
      <li v-else v-for="(message, key) in messages" :key="key+message">
        <!-- 自己 -->
        <div class="chat__content__self" v-if="message.self">
          <div class="chat__content__left">
            <p class="chat__content__head">
              <span class="chat__content__nick">{{message.nick}}</span>
              <span class="chat__content__time">{{currentTime()}}</span>
            </p>
            <div class="chat__content__text">
              <p v-html="message.content"></p>
            </div>
          </div>
          <div class="chat__content__right">
            <div :style="{background: avatarColor(message.nick)}" class="avatar">{{message.nick[0]}}</div>
          </div>
        </div>
        <!-- 其他人 -->
        <div v-else>
          <div class="chat__content__left">
            <div :style="{background: avatarColor(message.nick)}" class="avatar">{{message.nick[0]}}</div>
          </div>
          <div class="chat__content__right">
            <p class="chat__content__head">
              <span class="chat__content__nick">{{message.nick}}</span>
              <span class="chat__content__time">{{currentTime()}}</span>
            </p>
            <div class="chat__content__text">
              <p v-html="message.content"></p>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <!-- 发送、输入 -->
    <div :gutter="10" justify="space-between" type="flex" class="chat__operation">
      <el-input
        v-model="messageContent"
        @keyup.ctrl.enter.native="sendMessage"
        :rows="2"
        type="textarea"
        :maxlength="256"
        resize="none"
      />
      <el-tooltip effect="dark" content="按 ctrl+enter 发送" placement="bottom">
        <el-button
          type="primary"
          @click="sendMessage"
          size="large"
          circle
          icon="el-icon-s-promotion"
        ></el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import MD5 from 'js-md5';
export default {
  props: ['nohandler'],
  data() {
    return {
      messageContent: ''
    };
  },
  computed: {
    ...mapGetters({
      messages: 'getMessages',
      state: 'getState',
      connIsReady: 'getConnIsReady',
      nick: 'getName'
    })
  },
  methods: {
    ...mapMutations({
      addMessage: 'addMessage'
    }),
    sendMessage() {
      const _vm = this;
      if (_vm.messageContent === '') {
        this.$message.warning({ message: '不允许发送空消息', offset: 70 });
        return;
      }
      if (_vm.connIsReady) {
        let message = {
          nick: _vm.nick,
          content: _vm.messageContent
            .replace(/\n/gi, '<br/>')
            .replace(/script/gi, 'em')
        };
        console.log('准备发送消息！');
        window.webrtc.sendToAll('chat', message);
        message.self = true;
        _vm.addMessage(message);
      } else {
        this.$message.error({ message: '未连接到服务器！', offset: 70 });
      }
      // 清空
      _vm.messageContent = '';
    },
    receiveMessage(message) {
      this.$message({
        dangerouslyUseHTMLString: true,
        iconClass: 'el-icon-message',
        message: `<span style="color: #4095f0"> ${message.nick}</span> 发来一条消息`,
        offset: 70
      });
      this.addMessage(message);
    },
    contetnSrollBottom() {
      let div = this.$refs.chatContent;
      div.scrollTop = div.scrollHeight;
    },
    currentTime() {
      const date = new Date();
      const hour = date.getHours();
      const min = date.getMinutes();
      return `${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}`;
    },
    avatarColor(nick) {
      return '#' + MD5(nick).substr(8, 6);
    }
  },
  updated() {
    this.contetnSrollBottom();
  },
  mounted() {
    if (this.nohandler) return;
    const _vm = this;
    const handleMessage = ({ type, payload }) => {
      if (['candidate', 'answer', 'endOfCandidates'].indexOf(type) === -1)
        console.log('收到消息', { type, payload });
      _vm.contetnSrollBottom();
      if (type === 'chat') this.receiveMessage(payload);
    };
    window.webrtc.connection.on('message', handleMessage);
  },
  watch: {
    'state.showChat'() {
      this.contetnSrollBottom();
    }
  }
};
</script>

<style lang="scss" scoped>
$contentWidth: calc(100% - 140px);
.chat {
  height: 55vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .avatar {
    width: 60px;
    height: 60px;
    background: #eee;
    border-radius: 50%;
    line-height: 60px;
    text-align: center;
    font-size: 25px;
    color: white;
  }
  &__content {
    &__empty {
      background-color: #f3f3f3;
      text-align: center;
      font-size: 16px;
      padding: 10px 0;
    }
    li {
      overflow: hidden;
      zoom: 1;
    }
    overflow-y: scroll;
    padding-bottom: 20px;
    &::-webkit-scrollbar {
      display: none;
    }
    &__self {
      float: right;
      text-align: right;
      width: 100%;
      .chat__content__left {
        min-width: none;
        max-width: $contentWidth;
      }
      .chat__content__right {
        max-width: none;
      }
      .chat__content__text {
        background: #4095f0;
        color: white;
        text-align: left;
      }
      .chat__content__head {
        text-align: right;
      }
    }
    &__left,
    &__right {
      display: inline-block;
      max-width: $contentWidth;
      text-align: left;
    }
    &__left {
      word-break: break-all;
    }
    &__right {
      vertical-align: top;
      margin-left: 10px;
      margin-bottom: 10px;
    }
    &__time {
      font-size: 13px;
      padding-left: 5px;
      padding-right: 5px;
    }
    &__nick {
      color: #4095f0;
      font-weight: bold;
    }
    &__text {
      background: #f3f3f3;
      padding: 10px 10px;
      border-radius: 5px;
      img {
        max-width: 100%;
      }
    }
    @media screen and (max-width: 450px) {
    }

    &::-webkit-scrollbar {
      display: auto;
    }
  }
  &__operation {
    padding: 15px 8px;
    padding-right: 0;
    background: #f3f3f3;
    width: 100%;
    border-radius: 5px;
    .el-textarea {
      width: calc(100% - 60px);
      display: inline-block;
    }
    button {
      margin: 10px;
      display: inline-block;
    }
  }
}
</style>