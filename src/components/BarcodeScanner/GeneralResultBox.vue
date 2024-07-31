<script setup lang="ts">
import { getCurrentInstance } from "vue";
import { useResultCountStore } from "../../stores/resultCount";
import Clipboard from "clipboard";

const currentInstance: any = getCurrentInstance();
const resultCountStore = useResultCountStore();

/**
 * Copies scanned barcode results to the clipboard.
 * @param {string} txt - The text to be copied.
 */
const copyResult = (txt: string) => {
  let clipboard = new Clipboard(".dbr-copy", {
    text: () => {
      return txt;
    },
  });
  clipboard.on("success", () => {
    currentInstance.proxy.$message.success("Copied!");
    clipboard.destroy();
  });
  clipboard.on("error", () => {
    currentInstance.proxy.$message.error("Failed!");
    clipboard.destroy();
  });
};
</script>

<template>
  <div class="dbr-general-result-box">
    <ul class="dbr-general-result--box-ul">
      <li class="dbr-general-result--box-li" v-for="[key, value] of resultCountStore.$state" :key="key">
        <div class="dbr-format">{{ value.format }} :</div>
        <div class="dbr-text-area">
          <div class="dbr-text">{{ value.text }}</div>
          <div class="dbr-copy" @click="() => copyResult(value.text)">Copy</div>
        </div>
        <div class="dbr-count">{{ value.count }}x</div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.dbr-general-result-box {
  .dbr-general-result--box-ul {
    width: 50%;
    position: absolute;
    bottom: 13%;
    font-size: 20px;
    line-height: 22px;
    left: 50%;
    margin-bottom: 5px;
    min-width: 600px;
    max-height: 30%;
    text-align: center;
    transform: translateX(-50%);
    overflow: auto;
    z-index: 1;

    .dbr-general-result--box-li {
      min-height: 60px;
      display: flex;
      align-items: center;
      margin-bottom: 1px;
      padding: 5px 0;
      color: #dddddd;
      background-color: rgba(34, 34, 34, 0.42);
      border-left: none;
      border-right: none;

      .dbr-format {
        width: 20%;

        @media (max-width: 980px) {
          width: 30%;
        }
      }

      .dbr-text-area {
        display: flex;
        width: 65%;

        @media (max-width: 980px) {
          width: 55%;
        }

        .dbr-text {
          width: 80%;
          font-family: "OpenSans-Regular";
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          @media (max-width: 980px) {
            font-size: 12px;
          }
        }

        .dbr-copy {
          width: 20%;
          font-family: "OpenSans-Regular";
          color: #fe8e14;
          cursor: pointer;
          font-size: 20px;

          &:hover {
            color: #fea543 !important;
          }

          @media (max-width: 980px) {
            font-size: 12px;
          }

          @media (max-height: 600px) {
            font-size: 14px;
          }
        }
      }

      .dbr-count {
        width: 15%;
      }

      .dbr-format,
      .dbr-text-area,
      .dbr-count {
        font-family: "OpenSans-Regular";
      }

      @media (max-width: 980px) {
        max-height: 30%;
        min-height: unset;
      }

      @media (max-height: 600px) {
        max-height: 30%;
        min-height: unset;
      }
    }

    @media (max-width: 980px) {
      min-width: 330px;
      width: 75%;
      bottom: 15%;
      font-size: 12px;
    }

    @media (max-height: 600px) {
      font-size: 14px;
    }
  }
}
</style>
