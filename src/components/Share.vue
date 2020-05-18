<template>
  <div class="share">
    <div class="share__copy">
      <p class="share__copy__url">{{url}}</p>
      <el-button
        :icon="copyButtonStyle.icon"
        :type="copyButtonStyle.type"
        v-clipboard="url"
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
      this.$message.success('复制成功，分享给朋友加入会议吧！');
      this.copyButtonStyle.icon = 'el-icon-check';
      this.copyButtonStyle.type = 'success';
      setTimeout(() => {
        this.copyButtonStyle.icon = 'el-icon-copy-document';
        this.copyButtonStyle.type = 'primary';
      }, 3000);
    },
    copyError() {
      this.$message.error('复制失败，请手动复制！');
    }
  },
  mounted() {
    QRcode.toDataURL(location.href, (err, url) => {
      this.shareQR = url;
    });
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