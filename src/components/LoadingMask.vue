<script setup lang="ts">
import { ref, watch } from 'vue';
import { CaptureVisionRouter, CodeParserModule, CoreModule } from 'dynamsoft-barcode-reader-bundle';
import { useIsShowGuideStore } from '../stores/isShowGuide';

const isShowLoadingMask = ref(true);
const progressValue = ref(0);
const isShowGuideStore = useIsShowGuideStore();

CoreModule.onWasmLoadProgressChanged = (_, tag, progress) => {
  if (tag !== "starting") {
    const targetValue = progress.loaded / progress.total * 35;
    if(progressValue.value <= targetValue && targetValue <= 35) {
      progressValue.value = targetValue;
    }
  }
}

CaptureVisionRouter.onDataLoadProgressChanged = (_, tag, _2) => {
  if (tag === "completed") {
    progressValue.value += 5;
  }
}

CodeParserModule.onSpecLoadProgressChanged = (_, tag, _2) => {
  if (tag === "completed") {
    progressValue.value += CoreModule.loadedWasmType !== "baseline" ? 10 : 16.25;
  }
}

watch(progressValue, (newVal) => {
  if (newVal >= 100) {
    setTimeout(() => {
      isShowLoadingMask.value = false;
    }, 500);
  }
});
</script>

<template>
  <Transition name="dbr-loading-mask">
    <div class="dbr-loading-mask" :style="{ backgroundColor: isShowGuideStore.isShowGuide ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 1)' }" v-if="isShowLoadingMask">
      <img class="dbr-logo" src="../assets/image/logo-dynamsoft-blackBg-190x47.png" alt="logo">
      <progress class="dbr-progress" max="100" :value="progressValue"></progress>
      <label class="dbr-loading-text">Loading the demo for the first time may take a while...</label>
    </div>
  </Transition>
</template>

<style scoped lang="less">
.dbr-loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999999;

  .dbr-logo {
    width: 170px;
    height: 40px;
  }

  .dbr-progress {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 90%;
    max-width: 600px;
    height: 16px;
    border: 2px solid #434343;
    border-radius: 20px;
    overflow: hidden;
    margin-top: 40px;
    margin-bottom: 30px;

    &::-webkit-progress-value {
      background-color: #30978C;
      transition: width 0.5s ease;
      border-radius: 20px;
    }

    &::-moz-progress-value {
      background-color: #30978C;
      transition: width 0.5s ease;
      border-radius: 20px;
    }

    &::-webkit-progress-bar {
      background-color: transparent;
      transition: width 0.5s ease;
      border-radius: 20px;
    }

    &::-moz-progress-bar {
      background-color: transparent;
      transition: width 0.5s ease;
      border-radius: 20px;
    }
  }

  .dbr-loading-text {
    color: #BBBBBB;
    font-size: 16px;
    font-family: "OpenSans-Regular";

    @media (max-width: 979.5px) {
      font-size: 12px;
    }
  }
}

.dbr-loading-mask-enter-active,
.dbr-loading-mask-leave-active {
  transition: opacity 0.3s ease;
}

.dbr-loading-mask-enter-from,
.dbr-loading-mask-leave-to {
  opacity: 0;
}
</style>