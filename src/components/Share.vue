<template>
  <div class="share">
    <div class="share__copy">
      <p class="share__copy__url">{{url}}</p>
      <el-button
        :icon="copyButtonStyle.icon"
        :type="copyButtonStyle.type"
        v-clipboard="clipboardContent"
        v-clipboard:success="copySuccess"
        v-clipboard:error="copyError"
        round
      >复制链接</el-button>
    </div>
    <div class="share__qr">
      <img :src="shareQR" />
    </div>
    <div class="share__tip">
      <p>复制或扫描二维码分享会议</p>
    </div>
  </div>
</template>

<script>
import QRcode from 'qrcode';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      shareQR: '',
      url: location.href,
      copyButtonStyle: {
        icon: 'el-icon-copy-document',
        type: 'primary'
      }
    };
  },
  methods: {
    copySuccess() {
      this.$notify.success('复制成功，分享给朋友加入会议吧！');
      this.copyButtonStyle.icon = 'el-icon-check';
      this.copyButtonStyle.type = 'success';
      setTimeout(() => {
        this.copyButtonStyle.icon = 'el-icon-copy-document';
        this.copyButtonStyle.type = 'primary';
      }, 3000);
    },
    copyError() {
      this.$notify.error('复制失败，请手动复制！');
    }
  },
  mounted() {
    QRcode.toDataURL(location.href, (err, url) => {
      this.shareQR = url;
    });
  },
  computed: {
    ...mapGetters({
      state: 'getState',
      room: 'getRoom'
    }),
    clipboardContent() {
      return `${this.state.name} 邀请您参加会议，\n点击链接直接加入会议：\n${this.url}\n会议ID：${this.room}`;
    }
  }
};
</script>

<style lang="scss">
.share {
  &__copy {
    button {
      margin-left: 50%;
      transform: translateX(-50%);
    }
    &__url {
      color: #888;
      background: #f7f5f5;
      border-radius: 13px;
      padding: 5px;
      width: 178px;
      white-space: nowrap;
      overflow: hidden;
      overflow-x: scroll;
      margin-bottom: 10px;
      font-size: 14px;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  &__qr {
    text-align: center;
    img {
      border-radius: 5px;
    }
  }
  &__tip {
    p {
      color: #999;
      background: #f7f5f5;
      border-radius: 13px;
      padding: 5px;
    }
  }
}
</style>