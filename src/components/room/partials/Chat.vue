<template>
  <div class="chat">
    <h1 style="text-align: center">文字聊天</h1>
    <div class="chat-content" ref="chatContent">
      <p v-for="(message, key) in messages" :key="key+message">
        <span style="font-weight: bold">{{message.nick}}</span>:
        <em>{{message.content}}</em>
      </p>
    </div>
    <div class="chat-operation">
      <textarea v-model="messageContent" type="text" />
      <button @click="sendMessage">发送消息</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
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
        console.log('请输入消息！');
        return;
      }
      if (_vm.connIsReady) {
        let message = {
          nick: _vm.nick,
          content: _vm.messageContent
        };
        window.webrtc.sendToAll('chat', message);
        _vm.addMessage(message);
        _vm.contetnSrollBottom();
      } else {
        console.log('未连接到服务器！ ');
      }
      // 清空
      _vm.messageContent = '';
    },
    receiveMessage(message) {
      this.addMessage(message);
    },
    contetnSrollBottom() {
      let div = this.$refs.chatContent;
      div.scrollTop = div.scrollHeight;
    }
  },
  mounted() {
    const _vm = this;
    const handleMessage = ({ type, payload }) => {
      console.log('收到消息', { type, payload });
      _vm.contetnSrollBottom();
      if (type === 'chat') this.receiveMessage(payload);
    };
    window.webrtc.connection.on('message', handleMessage);
  }
};
</script>

<style lang="scss" scoped>
.chat {
  height: 100%;
  border: 1px solid green;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .chat-content {
    background: #e6f1f2;
    overflow-y: scroll;
    padding-bottom: 50px;
    @media screen and (max-width: 450px) {
      max-height: 50vh;
    }

    &::-webkit-scrollbar {
      display: auto;
    }
  }
  .chat-operation {
    width: 100%;
    border-radius: 5px;
    background: #ddd;
    textarea {
      width: 100%;
    }
    button {
      display: block;
      height: 50px;
      width: 80%;
      margin: 0 auto;
    }
  }
}
</style>