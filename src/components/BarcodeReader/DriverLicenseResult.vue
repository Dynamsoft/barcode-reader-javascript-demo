<script setup lang="ts">
import { useCaptureImageStore } from "../../stores/captureImage";

const captureImageStore = useCaptureImageStore();
</script>

<template>
  <ul class="dbr-dl-result">
    <li class="dbr-dl-result-li" v-for="info in captureImageStore.parsedDLInfo">
      <span class="dbr-description">{{ info.description }}: </span>
      <span class="dbr-value">{{ info.value }}</span>
    </li>
    <li class="dbr-no-barcode-found" v-show="!captureImageStore.captureResult.length && !captureImageStore.isDecoding">
      No PDF417 code is found !
    </li>
  </ul>
</template>

<style scoped lang="less">
.dbr-dl-result {
  width: 100%;
  height: 90%;
  padding-right: 15px;
  overflow: auto;

  .dbr-dl-result-li {
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

  @media (max-width: 980px) {
    height: 70%;
  }
}
</style>
