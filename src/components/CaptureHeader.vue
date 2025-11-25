<script setup lang="ts">
import CameraSelector from "./BarcodeScanner/CameraSelector.vue";
import { message } from "ant-design-vue";
import { useSettingsStore } from "../stores/settings";
import { useScanOptionsStore } from "../stores/scanOptions";
import { useCaptureImageStore } from "../stores/captureImage";
import { CapturedResult, OriginalImageResultItem, CaptureVisionRouter, ParsedResult, CodeParser, ParsedResultItem } from "dynamsoft-barcode-reader-bundle";

const _window = window as any;

const settingsStore = useSettingsStore();
const scanOptionsStore = useScanOptionsStore();
const captureImageStore = useCaptureImageStore();

const switchSoundPlay = () => {
  settingsStore.updatePlaySound(!settingsStore.playSound);
};

// Read barcodes from an image file.s
const readImage = async (e: Event) => {
  message.loading({
    content: "Decoding...",
    key: "decode",
  });
  let captureResult: CapturedResult | null = null;
  try {
    captureImageStore.updateDecodingState(true);

    // Stop capturing and hide scan laser if camera is open
    if (_window.cameraEnhancer && _window.cameraEnhancer.isOpen()) {
      _window.cvRouter.stopCapturing();
      _window.cameraView?.setScanLaserVisible(false);
      _window.cameraView?.clearAllInnerDrawingItems();
    }

    // Capture and process the image
    const cvRouter = _window.cvRouter as CaptureVisionRouter;
    captureResult = await cvRouter.capture((e.target as HTMLInputElement).files![0], scanOptionsStore.currentScanOption.templateNameForReadRate);

    // Handle the case where no barcode result is found
    if (!captureResult.decodedBarcodesResult?.barcodeResultItems) {
      captureImageStore.updateDLJsonString();
    }

    // Parse Driver License, VIN barcodes
    let parsedResult: ParsedResult & { text: string } | null = null;
    if (captureResult.decodedBarcodesResult?.barcodeResultItems) {
      let parsedResultItem;
      try {
        parsedResultItem = await (_window.parser as CodeParser).parse(captureResult.decodedBarcodesResult.barcodeResultItems[0].bytes);
      } catch (ex: any) {
        parsedResult = {
          errorCode: -90003,
          errorString: ex.message,
          originalImageHashId: captureResult.originalImageHashId,
          originalImageTag: captureResult.originalImageTag,
          text: captureResult.decodedBarcodesResult.barcodeResultItems[0].text,
          parsedResultItems: []
        }
      } finally {
        if (!parsedResult) {
          parsedResult = {
            errorCode: 0,
            errorString: "Successful.",
            originalImageHashId: captureResult.originalImageHashId,
            originalImageTag: captureResult.originalImageTag,
            text: captureResult.decodedBarcodesResult.barcodeResultItems[0].text,
            parsedResultItems: [parsedResultItem as ParsedResultItem]
          }
        }
      }
      if(scanOptionsStore.currentScanOption.name === "Drivers License (PDF417)") {
        captureImageStore.updateDLJsonString(parsedResult);
      } else if(scanOptionsStore.currentScanOption.name === "VIN") {
        captureImageStore.updateVINJsonString(parsedResult);
      }
    }
    captureImageStore.updateCaptureResult(captureResult.decodedBarcodesResult?.barcodeResultItems);
    captureImageStore.updateSelectedFile((e.target as HTMLInputElement).files![0]);

    // Show barcode decoded result and show success message
    _window.cameraEnhancer?.close();
    captureImageStore.captureImagePageVisible(true);
    if (captureResult.decodedBarcodesResult?.barcodeResultItems?.length) {
      message.success({
        content: "Barcode decoded!",
        key: "decode",
        duration: 1
      });
    } else {
      message.warning({
        content: "No barcodes found!",
        key: "decode",
        duration: 1
      });
    }
  } catch (ex: any) {
    message.error({
      content: ex.message || ex,
      key: "decode",
      duration: 1
    });
    if (!captureImageStore.isShowCaptureImagePage) {
      _window.cvRouter.startCapturing(scanOptionsStore.currentScanOption.templateName);
      _window.cameraView?.setScanLaserVisible(true);
    }
  } finally {
    captureImageStore.updateDecodingState(false);
    (e.target as HTMLInputElement).value = "";

    if (
      ["VIN", "Drivers License (PDF417)"].includes(scanOptionsStore.currentScanOption.name) &&
      settingsStore.isCollectImg &&
      ((captureResult && captureResult.items.length <= 1) || !(captureResult?.parsedResult?.errorCode === 0))
    ) {
      const originalImage = captureResult?.items.find((item) => item.type === 1) as OriginalImageResultItem;
      if (!originalImage) return;
    }
  }
};
</script>

<template>
  <div class="dbr-scanner-header">
    <CameraSelector />
    <label class="dbr-upload-image">
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
        <g id="Images-Photography_Image-Files_image-file-add" data-name="Images-Photography / Image-Files / image-file-add" transform="translate(-376.074 -2192.76)">
          <g id="Group_184" data-name="Group 184" transform="translate(377.074 2193.76)">
            <g id="image-file-add">
              <path id="Oval_118" data-name="Oval 118" d="M383.857,2204.325a2.782,2.782,0,1,0-2.783-2.782A2.782,2.782,0,0,0,383.857,2204.325Z" transform="translate(-375.509 -2191.804)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              <path id="Shape_876" data-name="Shape 876" d="M392.657,2204.907l-.863-1.38a.7.7,0,0,0-1.18,0l-3.672,5.874-1.5-2.4a.7.7,0,0,0-1.18,0l-4.193,6.709h6.956" transform="translate(-375.9 -2190.066)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              <path id="Shape_877" data-name="Shape 877" d="M390.987,2225.76H378.465a1.392,1.392,0,0,1-1.391-1.391v-29.217a1.392,1.392,0,0,1,1.391-1.391H396.96a1.394,1.394,0,0,1,.984.407l5.157,5.157a1.39,1.39,0,0,1,.408.984v5.973" transform="translate(-377.074 -2193.76)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              <path id="Oval_119" data-name="Oval 119" d="M396.422,2221.456a8.348,8.348,0,1,0-8.348-8.348A8.347,8.347,0,0,0,396.422,2221.456Z" transform="translate(-372.77 -2189.456)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              <path id="Shape_878" data-name="Shape 878" d="M394.074,2207.76v8.348" transform="translate(-370.422 -2188.282)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              <path id="Shape_879" data-name="Shape 879" d="M399.422,2210.76h-8.348" transform="translate(-371.596 -2187.108)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </g>
          </g>
        </g>
      </svg>
      <input type="file" id="dbr-image-read" accept=".jpg,.jpeg,.ico,.gif,.svg,.webp,.png,.bmp" class="dbr-image-read" @change="readImage" />
    </label>
    <div class="dbr-sound" @click="switchSoundPlay" :style="{
      backgroundColor: settingsStore.playSound ? 'rgba(110, 110, 110, 0.8)' : '',
    }">
      <svg v-show="settingsStore.playSound" class="dbr-music-selected icon icon-tabler icon-tabler-volume" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffae38" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M15 8a5 5 0 0 1 0 8" />
        <path d="M17.7 5a9 9 0 0 1 0 14" />
        <path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
      </svg>
      <svg v-show="!settingsStore.playSound" class="dbr-music-unselected icon icon-tabler icon-tabler-volume-off" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#aaa" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M15 8a5 5 0 0 1 1.912 4.934m-1.377 2.602a5 5 0 0 1 -.535 .464" />
        <path d="M17.7 5a9 9 0 0 1 2.362 11.086m-1.676 2.299a9 9 0 0 1 -.686 .615" />
        <path d="M9.069 5.054l.431 -.554a.8 .8 0 0 1 1.5 .5v2m0 4v8a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l1.294 -1.664" />
        <path d="M3 3l18 18" />
      </svg>
    </div>
    <label class="dbr-current-mode" v-show="!captureImageStore.isShowCaptureImagePage">{{ scanOptionsStore.currentScanOption.name }}</label>
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
    width: 13%;
    height: 100%;
    max-width: 100px;
    // min-width: 60px;
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

    svg {
      height: 50%;
    }

    &:hover {
      background-color: #323234;
    }
  }

  .dbr-sound {
    width: 13%;
    height: 100%;
    max-width: 100px;
    // min-width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(34, 34, 34);
    cursor: pointer;

    .dbr-music-selected,
    .dbr-music-unselected {
      height: 60%;
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

    @media (max-width: 979.5px) {
      width: 100%;
      text-align: center;
      top: 135%;
      font-size: 16px;
    }

    @media (max-height: 500px) {
      font-size: 14px;
    }
  }
}
</style>
