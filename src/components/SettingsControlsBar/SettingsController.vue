<script setup lang="ts">
import { ref, Ref, computed } from "vue";
import { message, Popover, Switch } from "ant-design-vue";
import { usePopoverOpenStore } from "../../stores/popoverOpen";
import { ColourMode, SingleOrMulti, useSettingsStore } from "../../stores/settings";
import { useScanOptionsStore } from "../../stores/scanOptions";
import { useCaptureImageStore } from "../../stores/captureImage";
import { CaptureVisionRouter } from "dynamsoft-barcode-reader-bundle";
import { getDate, isDebug, templateUrl } from "../../util";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useDeviceType } from "../../hooks/useDeviceType";

const _window = window as any;

const popoverOpenStore = usePopoverOpenStore();
const settingsStore = useSettingsStore();
const scanOptionsStore = useScanOptionsStore();
const captureImageStore = useCaptureImageStore();
const deviceType = useDeviceType();

const isShowMask = ref(false);
const downloadImg: Ref<Array<{ name: string; blob: Blob }>> = ref([]);

const isSettingChangeEnabled = computed(() => {
  if (templateUrl) return false;
  return !["Drivers License (PDF417)", "VIN"].includes(scanOptionsStore.currentScanOption.name);
})

const updatePopoverStore = (e: Event) => {
  // Due to the fact that the first click under Mobile will also trigger a mouseenter event, the placement value is used to determine whether it is a mobile and ignore the mouseenter event triggering under Mobile
  if (e.type === "mouseenter" && deviceType.value === "pc") {
    popoverOpenStore.updatePopoverStore(false, true);
  } else if (e.type === "click" && deviceType.value === "mobile") {
    popoverOpenStore.updatePopoverStore(false, !popoverOpenStore.settingsController);
  }
};

// Captures images, compresses them into a ZIP file, and triggers a download.
const getImages = async () => {
  if (captureImageStore.isShowCaptureImagePage || !_window.cameraEnhancer) return;

  _window.cameraView.clearAllInnerDrawingItems();
  isShowMask.value = true;
  _window.cvRouter.stopCapturing();
  message.loading({ content: "Capturing..." });
  _window.cameraEnhancer.startFetching();

  // Save captured images
  await saveImages();
  _window.cameraEnhancer.stopFetching();

  // Create a ZIP file containing the captured images
  const zip = new JSZip();
  for (let i = 0; i < downloadImg.value.length; i++) {
    zip.file(downloadImg.value[i].name, downloadImg.value[i].blob);
  }

  // Download zip file
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `screenshot-${getDate()}.zip`);
  downloadImg.value = [];
  message.destroy();
  isShowMask.value = false;

  // Restart capturing with the current template
  await _window.cvRouter.startCapturing(scanOptionsStore.currentScanOption.templateName);
};

// Captures images from the camera and adds them to the download list.
const saveImages = async () => {
  return new Promise<void>(async (resolve) => {
    let index = 0;
    while (index < 8) {
      const image = await new Promise<any>((rs) => {
        setTimeout(() => {
          const image = _window.cameraEnhancer.fetchImage();
          rs(image);
        }, 0)
      })
      if (!image) {
        index++;
        continue;
      }
      const cvs = image.toCanvas();
      if (cvs != null) {
        const blob = cvs.convertToBlob ? await cvs.convertToBlob() : await new Promise((resolve) => {
          cvs.toBlob((blob: Blob) => resolve(blob));
        });
        downloadImg.value.push({ name: "Screenshot - " + new Date().toISOString().replace(/\:/g, "-") + ".png", blob });
      }
      index++;
    }
    resolve();
  });
};

const uploadTemplate = (e: any): void => {
  _window.cvRouter.stopCapturing();
  const file = e.target.files[0];
  const fileReadr = new FileReader();
  fileReadr.readAsText(file);
  fileReadr.onload = async (event) => {
    try {
      const jsonString = event.target?.result as string;
      await _window.cvRouter.initSettings(jsonString);
      const templateName = JSON.parse(jsonString).CaptureVisionTemplates[0].Name;
      await _window.cvRouter.startCapturing(templateName);
      scanOptionsStore.updateScanOption({ name: "User Defined", templateName, checked: true, urlName: "user-defined", templateNameForReadRate: templateName });
      message.success({ content: "Successful.", duration: 1 });
    } catch (ex: Error) {
      message.error({ content: ex.message || ex, duration: 1 });
    }
  };
  fileReadr.onerror = (event) => {
    message.error({ content: event.target?.error?.message || "Failed to read file.", duration: 1 });
  };
}

const downloadTemplate = () => {
  const templateName = scanOptionsStore.currentScanOption.templateName;
  (_window.cvRouter as CaptureVisionRouter).outputSettingsToFile("*", templateName, true, true);
}

</script>

<template>
  <Popover overlayClassName="dbr-settings-popover" :placement="deviceType === 'pc' ? 'rightBottom' : 'topRight'" :arrow="false" :open="isSettingChangeEnabled && popoverOpenStore.settingsController">
    <div class="dbr-settings-controller" @click.stop="updatePopoverStore" @mouseenter="updatePopoverStore" :style="{ backgroundColor: !isSettingChangeEnabled ? 'rgb(77, 77, 77)' : '#000000', cursor: !isSettingChangeEnabled ? 'not-allowed' : 'pointer', }">
      <svg version="1.1" id="Layer_1" class="dbr-settings-icon" :fill="isSettingChangeEnabled ? '#FEA543' : 'grey'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 29.4 29.4" style="enable-background:new 0 0 29.4 29.4;" xml:space="preserve">
        <g>
          <path class="st0"
            d="M27.2,11.9h-1.9c-0.2-0.8-0.5-1.5-0.8-2.3l1.4-1.4c0.9-0.9,0.9-2.2,0-3.1l-1.7-1.7c-0.9-0.9-2.2-0.9-3.1,0l-1.4,1.4c-0.7-0.3-1.5-0.6-2.3-0.8V2.2c0-1.2-1-2.2-2.2-2.2h-1.2c-1.2,0-2.2,1-2.2,2.2v1.9c-0.8,0.2-1.5,0.5-2.3,0.8L8.2,3.5C7.4,2.6,6,2.6,5.1,3.5L3.5,5.2C2.6,6,2.6,7.4,3.5,8.3l1.4,1.4c-0.3,0.7-0.6,1.5-0.8,2.3H2.2c-1.2,0-2.2,1-2.2,2.2v1.2c0,1.2,1,2.2,2.2,2.2h1.9c0.2,0.8,0.5,1.5,0.8,2.3l-1.4,1.4c-0.9,0.9-0.9,2.2,0,3.1l1.7,1.7c0.9,0.9,2.2,0.8,3.1,0l1.4-1.4c0.7,0.3,1.5,0.6,2.3,0.8v1.9c0,1.2,1,2.2,2.2,2.2h1.2c1.2,0,2.2-1,2.2-2.2v-1.9c0.8-0.2,1.5-0.5,2.3-0.8l1.4,1.4c0.8,0.8,2.3,0.8,3.1,0l1.7-1.7c0.8-0.9,0.8-2.2,0-3.1l-1.4-1.4c0.3-0.7,0.6-1.5,0.8-2.3h1.9c1.2,0,2.2-1,2.2-2.2v-1.2C29.4,12.9,28.4,11.9,27.2,11.9z M27.4,15.3c0,0.1-0.1,0.2-0.2,0.2h-2.7c-0.5,0-0.9,0.3-1,0.8c-0.2,1.1-0.6,2.2-1.1,3.2c-0.2,0.4-0.1,0.8,0.2,1.2l1.9,1.9c0.1,0.1,0.1,0.2,0,0.3l-1.7,1.7c-0.1,0.1-0.2,0.1-0.3,0l-1.9-1.9c-0.3-0.3-0.8-0.4-1.2-0.2c-1,0.5-2.1,0.9-3.2,1.1c-0.5,0.1-0.8,0.5-0.8,1v2.7c0,0.1-0.1,0.2-0.2,0.2h-1.2c-0.1,0-0.2-0.1-0.2-0.2v-2.7c0-0.5-0.3-0.9-0.8-1c-1.1-0.2-2.2-0.6-3.2-1.1c-0.1-0.1-0.3-0.1-0.4-0.1c-0.3,0-0.5,0.1-0.7,0.3l-1.9,1.9c-0.1,0.1-0.2,0.1-0.3,0l-1.7-1.7c-0.1-0.1-0.1-0.2,0-0.3l1.9-1.9c0.3-0.3,0.4-0.8,0.2-1.2c-0.5-1-0.9-2.1-1.1-3.2c-0.1-0.5-0.5-0.8-1-0.8H2.2c-0.1,0-0.2-0.1-0.2-0.2v-1.2c0-0.1,0.1-0.2,0.2-0.2h2.7c0.5,0,0.9-0.3,1-0.8C6.1,12,6.4,10.9,7,9.9C7.1,9.5,7.1,9,6.8,8.7L4.9,6.8c-0.1-0.1-0.1-0.2,0-0.3l1.7-1.7c0.1-0.1,0.2-0.1,0.3,0l1.9,1.9C9,7.1,9.5,7.1,9.9,7c1-0.5,2.1-0.9,3.2-1.1c0.5-0.1,0.8-0.5,0.8-1V2.2C13.9,2.1,14,2,14.1,2h1.2c0.1,0,0.2,0.1,0.2,0.2v2.7c0,0.5,0.3,0.9,0.8,1c1.1,0.2,2.2,0.6,3.2,1.1c0.4,0.2,0.8,0.1,1.2-0.2l1.9-1.9c0.1-0.1,0.2-0.1,0.3,0l1.7,1.7c0.1,0.1,0.1,0.2,0,0.3l-1.9,1.9c-0.3,0.3-0.4,0.8-0.2,1.2c0.5,1,0.9,2.1,1.1,3.2c0.1,0.5,0.5,0.8,1,0.8h2.7c0.1,0,0.2,0.1,0.2,0.2V15.3z" />
          <path class="st0" d="M14.7,8.3c-3.5,0-6.4,2.9-6.4,6.4c0,3.5,2.9,6.4,6.4,6.4c3.5,0,6.4-2.9,6.4-6.4C21.1,11.2,18.2,8.3,14.7,8.3zM14.7,19.1c-2.4,0-4.4-2-4.4-4.4s2-4.4,4.4-4.4s4.4,2,4.4,4.4S17.1,19.1,14.7,19.1z" />
        </g>
      </svg>

      <label class="dbr-settings-text-in-desktop" :style="{ color: !isSettingChangeEnabled ? 'rgb(103, 103, 103)' : '#ffffff', cursor: !isSettingChangeEnabled ? 'not-allowed' : 'pointer', }">Scan Settings</label>
      <label class="dbr-settings-text-in-mobile" :style="{ color: !isSettingChangeEnabled ? 'rgb(103, 103, 103)' : '#ffffff', cursor: !isSettingChangeEnabled ? 'not-allowed' : 'pointer', }">Settings</label>
    </div>
    <template #content>
      <div class="dbr-settings">
        <div class="dbr-screenshot-btn" @click="getImages" v-show="isDebug">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 34 34">
            <g id="grey" transform="translate(0.5 0.5)">
              <g id="Group_125" data-name="Group 125" transform="translate(0.5 0.5)">
                <path id="Path_91" data-name="Path 91" d="M20.445,10.445V2.158A1.658,1.658,0,0,0,18.788.5H10.5" transform="translate(6.076 -0.5)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                <path id="Path_92" data-name="Path 92" d="M20.445,10.5v8.288a1.658,1.658,0,0,1-1.658,1.658H10.5" transform="translate(6.076 6.076)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                <path id="Path_93" data-name="Path 93" d="M.5,10.445V2.158A1.658,1.658,0,0,1,2.158.5h8.288" transform="translate(-0.5 -0.5)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                <path id="Path_94" data-name="Path 94" d="M.5,10.5v8.288a1.658,1.658,0,0,0,1.658,1.658h8.288" transform="translate(-0.5 6.076)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                <line id="Line_13" data-name="Line 13" y2="10.958" transform="translate(26.521 21.042)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                <line id="Line_14" data-name="Line 14" x2="10.958" transform="translate(21.042 26.524)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </g>
            </g>
          </svg>
        </div>
        <div class="dbr-settings-options" @click.stop="">
          <div class="dbr-settings-option-1" v-show="!['Drivers License (PDF417)', 'VIN'].includes(scanOptionsStore.currentScanOption.name)">
            <label>Single/Multi Barcode Scanning</label>
            <div class="dbr-single-or-multi-options">
              <label v-for="mode of ['Single', 'Multiple']" :class="`dbr-${mode.toLowerCase()}`" @click="() => settingsStore.updateSingleOrMulti(mode as SingleOrMulti)" :style="{ backgroundColor: settingsStore.singleOrMulti === mode ? '#fe8e14' : '#222' }">
                <input type="radio" class="dbr-radio" name="single-or-multiple" style="margin-right: 5px;" :checked="settingsStore.singleOrMulti === mode">
                {{ mode }}
              </label>
            </div>
          </div>
          <div class="dbr-settings-option-3">
            <label>Barcode Colour Option</label>
            <div class="dbr-colour-mode-desc">
              <p v-show="settingsStore.colourMode === 'Inverted'">Scan light barcodes on dark background</p>
              <p v-show="settingsStore.colourMode === 'Normal'">Scan dark barcodes on light background</p>
              <p v-show="settingsStore.colourMode === 'Both'">Scan both normal and inverted barcodes</p>
            </div>
            <div class="dbr-colour-mode">
              <label v-for="mode of ['Inverted', 'Normal', 'Both']" :class="`dbr-${mode.toLowerCase()}`" @click="() => settingsStore.updateColourMode(mode as ColourMode)" :style="{ backgroundColor: settingsStore.colourMode === mode ? '#fe8e14' : '#222' }">
                <div class="dbr-text">
                  <input type="radio" class="dbr-radio" name="colour-mode" style="margin-right: 5px;" :checked="settingsStore.colourMode === mode">
                  {{ mode }}
                </div>
              </label>
            </div>
          </div>
        </div>
        <div class="dbr-auto-zoom" @click.stop v-show="!captureImageStore.isShowCaptureImagePage">
          <div class="dbr-auto-zoom-title">Auto Zoom</div>
          <Switch v-model:checked="settingsStore.autoZoom" />
        </div>
        <div class="dbr-result-tooltip" @click.stop v-show="!captureImageStore.isShowCaptureImagePage">
          <div class="dbr-result-tooltip-title">Result Tooltip</div>
          <Switch v-model:checked="settingsStore.resultTooltip" />
        </div>
        <div class="dbr-view-setting-codes-btn" @click.stop="" :style="{ justifyContent: isDebug ? 'space-between' : 'flex-end' }">
          <label class="dbr-upload-template" for="upload-template" v-show="isDebug">
            <input type="file" id="upload-template" accept=".json" @change="uploadTemplate" style="display: none;">
            <svg t="1752225146415" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1439" width="20" height="20">
              <path d="M939.982029 724.992l-139.6736-139.6736a40.96 40.96 0 0 0-58.1632 0l-139.6736 139.6736a40.79616 40.79616 0 0 0 29.0816 69.632c10.6496 0 20.8896-4.096 29.0816-11.8784l70.0416-69.632V983.04c0 22.528 18.432 40.96 40.96 40.96s40.96-18.432 40.96-40.96v-269.9264l70.0416 69.632c8.192 8.192 18.432 11.8784 29.0816 11.8784s20.8896-4.096 29.0816-11.8784a40.79616 40.79616 0 0 0 0-57.7536z" p-id="1440" fill="#ffffff"></path>
              <path d="M521.780429 942.08H153.140429V81.92h544.3584L849.460429 233.8816V409.6c0 22.528 18.432 40.96 40.96 40.96s40.96-18.432 40.96-40.96V233.8816c0-21.7088-8.6016-42.5984-24.1664-57.7536L755.252429 24.1664C739.687629 8.6016 719.207629 0 697.089229 0H153.140429C108.084429 0 71.220429 36.864 71.220429 81.92v860.16c0 45.056 36.864 81.92 81.92 81.92h368.64c22.528 0 40.96-18.432 40.96-40.96s-18.432-40.96-40.96-40.96z" p-id="1441" fill="#ffffff"></path>
              <path d="M284.622029 215.4496c-22.528 0-40.96 18.432-40.96 40.96s18.432 40.96 40.96 40.96h396.0832c22.528 0 40.96-18.432 40.96-40.96s-18.432-40.96-40.96-40.96H284.622029zM557.825229 420.2496H284.622029c-22.528 0-40.96 18.432-40.96 40.96s18.432 40.96 40.96 40.96h273.2032c22.528 0 40.96-18.432 40.96-40.96s-18.432-40.96-40.96-40.96z" p-id="1442" fill="#ffffff"></path>
            </svg>
          </label>
          <div class="dbr-open-settings-view" @click.stop="downloadTemplate">
            Download Template
            <svg data-v-8dc7cce2="" viewBox="0 0 18 18" width="16" height="16" stroke="rgb(254, 142, 20)">
              <g data-v-8dc7cce2="" transform="translate(-519 -1339)">
                <g data-v-8dc7cce2="" transform="translate(520 1340)">
                  <path data-v-8dc7cce2="" d="M528,1356a8,8,0,1,0-8-8A8,8,0,0,0,528,1356Z" transform="translate(-520 -1340)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  <path data-v-8dc7cce2="" d="M531,1352.274V1344.5" transform="translate(-523 -1340.387)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  <path data-v-8dc7cce2="" d="M533.554,1352l-4.027,5.027L525.5,1352" transform="translate(-521.527 -1344.02)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </template>
  </Popover>
</template>

<style scoped lang="less">
.dbr-settings-controller {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .dbr-settings-icon {
    width: 28px;
    height: 28px;

    @media (max-width: 979.5px) {
      width: 18px;
      height: 18px;
    }

    @media (max-height: 500px) and (max-width: 979.5px) {
      display: none;
    }
  }

  .dbr-settings-text-in-desktop,
  .dbr-settings-text-in-mobile {
    font-family: "OpenSans-Regular";
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;
  }

  .dbr-settings-text-in-desktop {
    margin-top: 5px;

    @media (max-width: 979.5px) {
      display: none;
    }
  }

  .dbr-settings-text-in-mobile {
    transform: scale(0.7);

    @media (min-width: 980px) {
      display: none;
    }
  }

  @media (max-width: 979.5px) {
    flex: 1;
  }
}

.ant-popover-open {
  background-color: rgb(34, 34, 34) !important;
}
</style>

<style lang="less">
.dbr-settings-popover {
  .ant-popover-inner {
    background-color: rgba(50, 50, 52, 0.8);
    padding: unset;
    border-radius: unset;
  }

  .ant-popover-inner-content {
    width: 430px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.65);
    overflow: auto;

    .dbr-settings {
      position: relative;

      .dbr-screenshot-btn {
        width: 30px;
        height: 30px;
        position: absolute;
        top: 15px;
        right: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        cursor: pointer;
      }

      .dbr-settings-options {
        padding: 20px 16px 12px 16px;
        background-color: rgba(50, 50, 52, 0.8);

        .dbr-settings-option-1,
        .dbr-settings-option-2,
        .dbr-settings-option-3 {
          margin-bottom: 20px;

          label {
            color: #ddd;
            font-family: OpenSans-Regular;
            font-size: 16px;
          }

          .dbr-colour-mode-desc p {
            font-size: 14px;
            color: #aaaaaa;
            font-family: OpenSans-Regular;
          }

          .dbr-single-or-multi-options,
          .dbr-scan-mode,
          .dbr-colour-mode {
            display: flex;
            margin-top: 10px;

            .dbr-single,
            .dbr-multiple,
            .dbr-speed,
            .dbr-balance,
            .dbr-coverage,
            .dbr-inverted,
            .dbr-normal,
            .dbr-both {
              height: 40px;
              display: flex;
              justify-content: space-around;
              align-items: center;
              background-color: #222;
              color: #ffffff;
              font-size: 16px;
              font-family: OpenSans-Regular;
              margin-right: 20px;
              padding: 0 5px;
              white-space: nowrap;
              cursor: pointer;

              @media (max-width: 979.5px) {
                font-size: 14px;
                margin-right: 10px;
                min-width: 80px;
              }

              @media (hover: hover) and (pointer: fine) {
                &:hover {
                  background-color: #fea543 !important;
                  color: #ffffff !important;
                }
              }

              .dbr-radio {
                appearance: none;
                -webkit-appearance: none;
                width: 12px;
                height: 12px;
                border: 1px solid #ffffff;
                border-radius: 50%;
                outline: none;
                cursor: pointer;
                position: relative;
              }

              .dbr-radio:checked::before {
                content: "";
                position: absolute;
                top: 1px;
                left: 1px;
                width: 8px;
                height: 8px;
                background-color: #ffffff;
                border-radius: 50%;
              }
            }

            .dbr-inverted,
            .dbr-normal,
            .dbr-both {
              display: flex;
              padding-right: 0;

              .dbr-text {
                font-size: 16px;
                font-family: OpenSans-Regular;
                padding-right: 15px;
                text-align: center;

                @media (max-width: 979.5px) {
                  font-size: 14px;
                  min-width: 80px;
                }
              }

              .dbr-image-inverted,
              .dbr-image-normal {
                width: 80px;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
              }

              .dbr-image-inverted {
                background-color: black;
              }

              .dbr-image-normal {
                background-color: #ffffff;
                cursor: pointer;
                color: black;

                img {
                  filter: invert(100%);
                }
              }
            }

            .dbr-coverage {
              margin-right: 0;
            }
          }
        }

        .dbr-settings-option-3 {
          margin-bottom: 0;
        }
      }

      .dbr-auto-zoom,
      .dbr-result-tooltip {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: rgb(42, 42, 43);
        color: #dddddd;
        padding: 0 18px;

        .dbr-auto-zoom-title,
        .dbr-result-tooltip-title {
          font-family: OpenSans-Regular;
          font-size: 14px;
        }

        .ant-switch {
          background-color: #666;
        }

        .ant-switch-checked {
          background-color: #fe8e14;
        }
      }

      .dbr-view-setting-codes-btn {
        width: 100%;
        height: 60px;
        color: #fe8e14;
        background-color: #000000;
        font-family: OpenSans-Regular;
        font-size: 19px;
        line-height: 60px;
        text-align: right;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .dbr-upload-template {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .dbr-open-settings-view {
          cursor: pointer;
          font-family: OpenSans-Regular;

          svg {
            vertical-align: middle;
          }
        }

        @media (hover: hover) and (pointer: fine) {
          &:hover {
            color: #fea543 !important;
          }
        }

        @media (max-width: 979.5px) {
          height: 40px;
          line-height: 40px;
          font-size: 16px;
        }
      }
    }

    .dbr-setting-codes-area {
      width: 100%;
      height: 450px;
      position: relative;
      background-color: #323234;
      padding: 0 17px 55px 17px;
      overflow: auto;

      @media (max-width: 979.5px) and (orientation: landscape) {
        height: 200px;
      }

      .dbr-setting-code-main {
        position: absolute;
        top: 4%;
        left: 5%;
        right: 6%;
        bottom: 15%;
        color: #fff;
        padding: 5px;
        word-break: break-all;
        font-family: "OpenSans-Regular";
        font-size: 14px;
        overflow: auto;
      }

      .dbr-setting-codes-area-footer {
        width: 90%;
        display: flex;
        justify-content: space-between;
        position: absolute;
        bottom: 5%;
        color: #fff;
        font-size: 14px;

        .dbr-back,
        .dbr-copy-settings {
          font-family: OpenSans-Regular;
          color: #ffffff;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }

    @media (max-width: 979.5px) {
      width: 330px;
      max-height: 65vh;
    }
  }
}
</style>
