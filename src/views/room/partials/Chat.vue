<template>
  <div class="chat">
    <ul class="chat__content" ref="chatContent">
      <el-alert title="还没有任何消息哦~" type="info" v-if="messages.length === 0" show-icon center></el-alert>
      <li v-else v-for="(message, key) in messages" :key="key+message">
        <!-- 自己 -->
        <div class="chat__content__self" v-if="message.self">
          <div class="chat__content__left">
            <p class="chat__content__head">
              <span class="chat__content__nick">{{message.nick}}</span>
              <span class="chat__content__time">{{message.time}}</span>
            </p>
            <div class="chat__content__text">
              <p v-html="message.content"></p>
            </div>
          </div>
          <div class="chat__content__right">
            <div :style="{background: hashColor(message.nick)}" class="avatar">{{message.nick[0]}}</div>
          </div>
        </div>
        <!-- 其他人 -->
        <div class="chat__content__other" v-else>
          <div class="chat__content__left">
            <div :style="{background: hashColor(message.nick)}" class="avatar">{{message.nick[0]}}</div>
          </div>
          <div class="chat__content__right">
            <p class="chat__content__head">
              <span class="chat__content__nick">{{message.nick}}</span>
              <span class="chat__content__time">{{message.time}}</span>
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
import { hashColor } from '../../../uitls';
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
    hashColor,
    ...mapMutations({
      addMessage: 'addMessage',
      setShowTeacherBoard: 'setShowTeacherBoard'
    }),
    sendMessage() {
      const _vm = this;
      if (_vm.messageContent === '') {
        this.$notify.warning({ message: '不允许发送空消息' });
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
        this.$notify.error({ message: '未连接到服务器！' });
      }
      // 清空
      _vm.messageContent = '';
    },
    receiveMessage(message) {
      this.$notify({
        dangerouslyUseHTMLString: true,
        iconClass: 'el-icon-chat-dot-round',
        message: `<span style="color: #4095f0"> ${message.nick}</span> 发来一条消息`
      });
      this.addMessage(message);
    },
    contetnSrollBottom() {
      let div = this.$refs.chatContent;
      div.scrollTop = div.scrollHeight;
    }
  },
  updated() {
    this.contetnSrollBottom();
  },
  mounted() {
    if (this.nohandler) return;
    const _vm = this;
    _vm.contetnSrollBottom();
    console.log('挂载消息');
    const handleMessage = ({ type, payload }) => {
      if (['candidate', 'answer', 'endOfCandidates'].indexOf(type) === -1)
        console.log('收到消息', { type, payload });
      if (type === 'chat') this.receiveMessage(payload);
    };
    window.webrtc.connection.on('message', handleMessage);
  },
  watch: {
    'state.showChat'() {
      setTimeout(() => this.contetnSrollBottom(), 25);
    }
  }
};
</script>

<style lang="scss">
@import '../../../assets/styles/chat';
</style>