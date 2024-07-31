<script setup lang="ts">
import { ref, getCurrentInstance } from "vue";
import { useCaptureImageStore } from "../../stores/captureImage";
import Clipboard from "clipboard";

defineProps<{
  currentTemplate: string;
  closeDlResultBox: () => void;
}>();

const currentInstance: any = getCurrentInstance();
const captureImageStore = useCaptureImageStore();
const isCopied = ref(false);

const copyAll = () => {
  if (isCopied.value) return;
  let clipboard = new Clipboard(".dbr-dl-copy-all", {
    text: () => {
      let copyContent = "";
      for (let info of captureImageStore.parsedDLInfo) {
        copyContent += `${info.description}: ${info.value}\n`;
      }
      return copyContent;
    },
  });

  clipboard.on("success", () => {
    currentInstance.proxy.$message.success("Copied!");
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 5000);
    clipboard.destroy();
  });

  clipboard.on("error", () => {
    currentInstance.proxy.$message.error("Failed!");
    clipboard.destroy();
  });
};
</script>

<template>
  <div class="dbr-dl-result-box">
    <div class="dbr-dl-result-main">
      <ul class="dbr-dl-result-ul">
        <li class="dbr-dl-result-li" v-for="info of captureImageStore.parsedDLInfo">
          <span class="dbr-description">{{ info.description }}: </span>
          <span class="dbr-value">{{ info.value }}</span>
        </li>
      </ul>
    </div>
    <div class="dbr-dl-result-btns">
      <div class="dbr-dl-copy-all" @click="copyAll">
        {{ isCopied ? "Copied" : "Copy all" }}
      </div>
      <div class="dbr-dl-close" @click="closeDlResultBox">Close</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.dbr-dl-result-box {
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

  .dbr-dl-result-main {
    .dbr-dl-result-ul {
      height: 100%;
      max-height: calc(60vh - 25px);
      overflow: auto;

      .dbr-dl-result-li {
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

  .dbr-dl-result-btns {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: #fe8e14;
    font-size: 16px;

    &:hover {
      color: #fea543 !important;
    }

    .dbr-dl-copy-all,
    .dbr-dl-close {
      cursor: pointer;
    }
  }
}
</style>
