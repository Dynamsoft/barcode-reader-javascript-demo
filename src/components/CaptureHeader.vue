<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";
import CameraSelector from "./BarcodeScanner/CameraSelector.vue";
import HeaderRightPart from "./HeaderRightPart.vue";
import { useSettingsStore } from "../stores/settings";
import { useUseCaseStore } from "../stores/useCase";
import { useCaptureImageStore } from "../stores/captureImage";
import { CapturedResult } from "dynamsoft-capture-vision-router";
import { ParsedResultItem } from "dynamsoft-code-parser";
import { _getNorImageData, _toCanvas } from "dynamsoft-utility";
import { OriginalImageResultItem } from "dynamsoft-core";
import { ParsedDataFailed } from "../types";

const _window = window as any;

const props = defineProps<{
  currentTemplate: string;
}>();

const settingsStore = useSettingsStore();
const useCaseStore = useUseCaseStore();
const captureImageStore = useCaptureImageStore();
const currentInstance: any = getCurrentInstance();

const switchSoundPlay = () => {
  settingsStore.updatePlaySound(!settingsStore.playSound);
};

const currentModeName = computed(() => {
  if (useCaseStore.isGeneral) {
    return "General";
  } else if (useCaseStore.useCaseName === "vin") {
    return "Vehicle Identification Number (VIN)";
  } else if (useCaseStore.useCaseName === "dl") {
    return "USA/CAN/ZA Driver's License";
  } else if (useCaseStore.useCaseName === "dpm") {
    return "DPM Codes";
  }
});

// Read barcodes from an image file.s
const readImage = async (e: Event) => {
  currentInstance.proxy.$message.loading({
    content: "Decoding...",
    key: "decode",
  });
  let captureResult: CapturedResult | null = null;
  let parsedData: ParsedResultItem | ParsedDataFailed | {} = {};

  try {
    captureImageStore.updateDecodingState(true);

    // Stop capturing and hide scan laser if camera is open
    if (_window.cameraEnhancer && _window.cameraEnhancer.isOpen()) {
      _window.cvRouter.stopCapturing();
      _window.cameraView?.setScanLaserVisible(false);
    }

    // Capture and process the image
    captureResult = await _window.cvRouter.capture((e.target as HTMLInputElement).files![0], props.currentTemplate);

    // Handle the case where no barcode result is found
    if (!captureResult?.barcodeResultItems) {
      captureImageStore.updateDLJsonString();
    }

    // Parse Driver License barcodes
    if (captureResult?.barcodeResultItems && useCaseStore.useCaseName === "dl") {
      try {
        parsedData = await _window.parser.parse(captureResult.barcodeResultItems[0].bytes);
      } catch (ex: any) {
        (parsedData as ParsedDataFailed).exception = true;
        (parsedData as ParsedDataFailed).message = ex.message || ex;
        (parsedData as ParsedDataFailed).text = captureResult.barcodeResultItems[0].text;
      }

      captureImageStore.updateDLJsonString(
        (parsedData as ParsedDataFailed).exception
          ? JSON.stringify(parsedData)
          : (parsedData as ParsedResultItem).jsonString
      );
    }
    captureImageStore.updateCaptureResult(captureResult?.barcodeResultItems);
    captureImageStore.updateSelectedFile((e.target as HTMLInputElement).files![0]);

    // Close camera on barcode decoded
    if (_window.cameraEnhancer && _window.cameraEnhancer.isOpen()) {
      _window.cameraEnhancer?.close();
      _window.cameraView?.clearAllInnerDrawingItems();
    }

    // Show barcode decoded result and show success message
    captureImageStore.captureImagePageVisible(true);
    currentInstance.proxy.$message.success({
      content: "Barcode decoded!",
      key: "decode",
    });
  } catch (ex: any) {
    currentInstance.proxy.$message.error({
      content: ex.message || ex,
      key: "decode",
    });
    _window.cvRouter.startCapturing(props.currentTemplate);
    _window.cameraView?.setScanLaserVisible(true);
  } finally {
    captureImageStore.updateDecodingState(false);
    (e.target as HTMLInputElement).value = "";

    if (
      ["vin", "dl"].includes(useCaseStore.useCaseName) &&
      settingsStore.isCollectImg &&
      ((captureResult && captureResult.items.length <= 1) || (parsedData as ParsedDataFailed).exception)
    ) {
      const originalImage = captureResult?.items.find((item) => item.type === 1) as OriginalImageResultItem;
      if (!originalImage) return;
    }
  }
};

const preventDefault = (e: Event) => {
  if (!_window.cvRouter) {
    e.preventDefault();
    currentInstance.proxy.$message.warn("Capture Vision Router is Loading...");
  }
};
</script>

<template>
  <div class="dbr-scanner-header">
    <CameraSelector />
    <label class="dbr-upload-image">
      <img src="../assets/image/Images-add.svg" alt="image" />
      <input type="file" id="dbr-image-read" class="dbr-image-read" @click="preventDefault" @change="readImage" />
    </label>
    <div
      class="dbr-sound"
      @click="switchSoundPlay"
      :style="{
        backgroundColor: settingsStore.playSound ? 'rgba(110, 110, 110, 0.8)' : '',
      }"
    >
      <img
        class="dbr-music-selected"
        src="../assets/image/music-selected.svg"
        alt="Music-selected"
        v-show="settingsStore.playSound"
      />
      <img
        class="dbr-music-unselected"
        src="../assets/image/music-unselected.svg"
        alt="Music-unselected"
        v-show="!settingsStore.playSound"
      />
    </div>
    <label class="dbr-current-mode" v-show="!captureImageStore.isShowCaptureImagePage">{{ currentModeName }}</label>
    <HeaderRightPart />
  </div>
</template>

<style scoped lang="less">
.dbr-scanner-header {
  width: 100%;
  height: 7.5vh;
  max-height: 70px;
  background-color: rgba(50, 50, 52, 0.49);
  position: relative;
  display: flex;
  align-items: center;
  font-family: OpenSans-Regular;
  z-index: 10;

  .dbr-upload-image {
    width: 7%;
    height: 100%;
    max-width: 100px;
    min-width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(34, 34, 34);
    border-style: solid;
    border-width: 0 1px;
    border-color: rgb(98, 96, 94);
    cursor: pointer;

    .dbr-image-read {
      display: none;
    }

    img {
      height: 50%;
    }

    &:hover {
      background-color: #323234;
    }
  }

  .dbr-sound {
    width: 8%;
    height: 100%;
    max-width: 100px;
    min-width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(34, 34, 34);
    cursor: pointer;

    .dbr-music-selected,
    .dbr-music-unselected {
      height: 50%;
    }

    &:hover {
      background-color: #323234;
    }
  }

  .dbr-current-mode {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: OpenSans-Regular;
    font-size: 20px;
    color: #ffffff;

    @media (max-width: 768px) {
      width: 100%;
      text-align: center;
      top: 135%;
      font-size: 16px;
    }
  }
}
</style>
