<script setup lang="ts">
import { useCaptureImageStore } from "../../stores/captureImage";
import { useScanOptionsStore } from "../../stores/scanOptions";

const captureImageStore = useCaptureImageStore();
const scanOptionsStore = useScanOptionsStore();
</script>

<template>
  <ul class="dbr-parsed-result">
    <li class="dbr-parsed-result-li" v-for="info in captureImageStore.parsedDLInfo">
      <span class="dbr-description">{{ info.description }}: </span>
      <span class="dbr-value">{{ info.value }}</span>
    </li>
    <li class="dbr-no-barcode-found" v-show="!captureImageStore.captureResult.length && !captureImageStore.isDecoding">
      No {{ scanOptionsStore.currentScanOption.name === "Drivers License (PDF417)" ? "PDF417 code" : "barcode" }} is found !
    </li>
  </ul>
</template>

<style scoped lang="less">
.dbr-parsed-result {
  width: 100%;
  height: 90%;
  padding-right: 15px;
  overflow: auto;

  .dbr-parsed-result-li {
    display: flex;
    margin-bottom: 10px;
    word-break: break-all;
    white-space: pre-wrap;

    .dbr-description {
      width: 55%;
      color: #cccccc;
    }

    .dbr-value {
      width: 40%;
    }

    .dbr-description,
    .dbr-value {
      font-size: 14px;
      font-family: OpenSans-Regular;
    }
  }

  .dbr-no-barcode-found {
    font-family: OpenSans-Regular;
    font-size: 14px;
  }

  @media (max-width: 979.5px) {
    height: 70%;
  }
}
</style>
