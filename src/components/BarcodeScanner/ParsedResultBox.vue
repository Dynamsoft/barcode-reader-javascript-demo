<script setup lang="ts">
import { ref } from "vue";
import { useCaptureImageStore } from "../../stores/captureImage";
import { useSettingsStore } from "../../stores/settings";
import { useScanOptionsStore } from "../../stores/scanOptions";
import { message } from "ant-design-vue";
import Clipboard from "clipboard";

const _window = window as any;

const captureImageStore = useCaptureImageStore();
const settingsStore = useSettingsStore();
const scanOptionsStore = useScanOptionsStore();

const isCopied = ref(false);

const copyAll = () => {
  if (isCopied.value) return;
  let clipboard = new Clipboard(".dbr-parsed-copy-all", {
    text: () => {
      let copyContent = "";
      for (let info of captureImageStore.parsedDLInfo) {
        copyContent += `${info.description}: ${info.value}\n`;
      }
      return copyContent;
    },
  });

  clipboard.on("success", () => {
    message.success({
      content: "Copied!",
      duration: 1
    });
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 5000);
    clipboard.destroy();
  });

  clipboard.on("error", () => {
    message.error({
      content: "Failed!",
      duration: 1
    });
    clipboard.destroy();
  });
};

const closeDlResultBox = async () => {
  captureImageStore.updateDlResultBoxVisibility(false);
  await _window.cvRouter.startCapturing(scanOptionsStore.currentScanOption.templateName);
  _window.cameraView?.setScanLaserVisible(settingsStore.zonalScan);
};
</script>

<template>
  <div class="dbr-parsed-result-box">
    <div class="dbr-parsed-result-main">
      <ul class="dbr-parsed-result-ul">
        <li class="dbr-parsed-result-li" v-for="info of captureImageStore.parsedDLInfo">
          <span class="dbr-description">{{ info.description }}: </span>
          <span class="dbr-value">{{ info.value }}</span>
        </li>
      </ul>
    </div>
    <div class="dbr-parsed-result-btns">
      <div class="dbr-parsed-copy-all" @click="copyAll">
        {{ isCopied ? "Copied" : "Copy all" }}
      </div>
      <div class="dbr-parsed-close" @click="closeDlResultBox">Close</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.dbr-parsed-result-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 85%;
  max-width: 500px;
  max-height: 65vh;
  color: #dddddd;
  background-color: rgba(34, 34, 34, 0.5);
  padding: 17px 25px 13px;
  transform: translate(-50%, -50%);
  font-family: "Oswald-Regular";

  .dbr-parsed-result-main {
    .dbr-parsed-result-ul {
      height: 100%;
      max-height: calc(60vh - 25px);
      overflow: auto;

      .dbr-parsed-result-li {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding-bottom: 2px;
        font-size: 14px;
        color: #ffffff;

        .dbr-description,
        .dbr-value {
          width: 40%;
        }
      }
    }
  }

  .dbr-parsed-result-btns {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: #fe8e14;
    font-size: 16px;

    &:hover {
      color: #fea543 !important;
    }

    .dbr-parsed-copy-all,
    .dbr-parsed-close {
      cursor: pointer;
      font-family: "Oswald-Regular";
    }
  }
}
</style>
