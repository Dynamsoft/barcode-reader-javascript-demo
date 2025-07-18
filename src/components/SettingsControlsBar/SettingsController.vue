<script setup lang="ts">
import { ref, Ref, getCurrentInstance, computed } from "vue";
import { Popover, Switch } from "ant-design-vue";
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import { usePopoverOpenStore } from "../../stores/popoverOpen";
import { ColourMode, ScanMode, SingleOrMulti, useSettingsStore } from "../../stores/settings";
import { useUseCaseStore } from "../../stores/useCase";
import { useCaptureImageStore } from "../../stores/captureImage";
import { useCameraListStore } from "../../stores/cameraList";
import { getDate, isDebug } from "../../util";
import { ResolutionMap } from "../../assets/enum/Resolution";
import Clipboard from "clipboard";
import JSZip from "jszip";

const _window = window as any;

type PopoverPlacement = "rightBottom" | "topRight";

const popoverOpenStore = usePopoverOpenStore();
const settingsStore = useSettingsStore();
const useCaseStore = useUseCaseStore();
const captureImageStore = useCaptureImageStore();
const cameraListStore = useCameraListStore();
const currentInstance: any = getCurrentInstance();
const isShowMask = ref(false);
const downloadImg: Ref<Array<{ name: string; blob: Blob }>> = ref([]);

const placement: Ref<PopoverPlacement> = ref(document.body.clientWidth > 980 ? "rightBottom" : "topRight");
const shouldShowArrow = ref(document.body.clientWidth < 980);
const isCopied = ref(false);

const updatePopoverStore = (e: Event) => {
  // Due to the fact that the first click under Mobile will also trigger a mouseenter event, the placement value is used to determine whether it is a mobile and ignore the mouseenter event triggering under Mobile
  if (e.type === "mouseenter" && placement.value !== "topRight") {
    popoverOpenStore.updatePopoverStore(false, false, true);
  } else if (e.type === "click" && placement.value === "topRight") {
    popoverOpenStore.updatePopoverStore(false, false, !popoverOpenStore.settingsController);
  }
};

// Copy current view settings to the clipboard
const copySettings = () => {
  if (!isCopied.value) {
    const btn = document.querySelector(".dbr-copy-settings");
    let clipboard = new Clipboard(btn!, {
      text: () => {
        return viewSettings.value
          .replace(/<br>/g, "\n")
          .replace(/"/g, "")
          .replace(/&nbsp;/g, " ");
      },
    });
    clipboard.on("success", () => {
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 5000);
      currentInstance.proxy.$message.success("Copied!");
      clipboard.destroy();
    });
    clipboard.on("error", () => {
      isCopied.value = false;
      currentInstance.proxy.$message.error("Failed!");
      clipboard.destroy();
    });
  }
};

// Captures images, compresses them into a ZIP file, and triggers a download.
const getImages = async () => {
  if (captureImageStore.isShowCaptureImagePage || !_window.cameraEnhancer) return;

  _window.cameraView.clearAllInnerDrawingItems();
  isShowMask.value = true;
  _window.cvRouter.stopCapturing();
  currentInstance.proxy.$message.loading({ content: "Capturing...", duration: 0 });
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
  _window.saveAs(content, `screenshot-${getDate()}.zip`);
  downloadImg.value = [];
  currentInstance.proxy.$message.destroy();
  isShowMask.value = false;

  // Restart capturing with the current template
  await _window.cvRouter.startCapturing(captureImageStore.currentTemplate);
};

// Captures images from the camera and adds them to the download list.
const saveImages = async () => {
  return new Promise<void>(async (resolve) => {
    let index = 0;
    while (index < 8) {
      const image = await new Promise<any>((rs) => {
        setTimeout(() => {
          const image = _window.cameraEnhancer.getImage();
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

/**
 * Computes the view settings based on the current configuration.
 * @returns {string} The view settings formatted for display.
 */
const viewSettings = computed(() => {
  let _viewSettings = "";
  if (!captureImageStore.isShowCaptureImagePage) {
    const rsl = ResolutionMap[cameraListStore.currentResolution];

    _viewSettings += `await cameraEnhancer.setResolution(${JSON.stringify(rsl)});<br>`;
    _viewSettings += `cvRouter.stopCapturing();<br>`;
  }
  _viewSettings += `const settings = await cvRouter.getSimplifiedSettings('${captureImageStore.currentTemplate}');<br>`;
  _viewSettings += `settings.barcodeSettings.expectedBarcodesCount = ${settingsStore.singleOrMulti === "Single" ? 1 : 512};<br>`;

  const colourModeMap = {
    Inverted: "[1]",
    Normal: "[2]",
    Both: "[1, 2]",
  };
  _viewSettings += `settings.barcodeSettings.grayscaleTransformationModes = ${colourModeMap[settingsStore.colourMode]};<br>`;

  if (useCaseStore.useCaseName === "vin") {
    _viewSettings += `settings.barcodeSettings.barcodeFormatIds = 0x1 | 0x2 | 0x4 | 0x400 | 0x8 | 0x10 | 0x200 | 0x04000000 | 0x08000000;<br>`;
  } else if (useCaseStore.useCaseName === "dl") {
    _viewSettings += `settings.barcodeSettings.barcodeFormatIds = 0x02000000;<br>`;
  } else if (useCaseStore.useCaseName === "dpm") {
    _viewSettings += `settings.barcodeSettings.barcodeFormatIds = 0x08000000;<br>`;
  }

  _viewSettings += `await cvRouter.updateSettings('${captureImageStore.currentTemplate}', settings);<br>`;
  if (!captureImageStore.isShowCaptureImagePage) {
    _viewSettings += `await cvRouter.startCapturing('${captureImageStore.currentTemplate}');<br>`;
  }
  if (settingsStore.autoZoom && !captureImageStore.isShowCaptureImagePage) {
    _viewSettings += `cameraEnhancer.enableEnhancedFeatures(0x10);<br>`;
  }
  return _viewSettings;
});

const uploadTemplate = (e: any) => {
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
      captureImageStore.updateCurrentTemplate(templateName);
      currentInstance.proxy.$message.success({ content: "Successful." });
    } catch (ex: Error) {
      currentInstance.proxy.$message.error({ content: ex.message || ex });
    }
  };
  fileReadr.onerror = (event) => {
    currentInstance.proxy.$message.error({ content: event.target?.error?.message || "Failed to read file." });
  };
}

window.addEventListener("resize", () => {
  const isWideScreen = document.body.clientWidth > 980;
  placement.value = isWideScreen ? "rightBottom" : "topRight";
  shouldShowArrow.value = !isWideScreen;
});
</script>

<template>
  <Popover overlayClassName="dbr-settings-popover" :placement="placement" :arrow="shouldShowArrow" :open="popoverOpenStore.settingsController">
    <div class="dbr-settings-controller" @click.stop="updatePopoverStore" @mouseenter="updatePopoverStore">
      <img class="dbr-settings-icon" src="../../assets/image/icon-web-settings.svg" alt="settings" />
      <label class="dbr-settings-text-in-desktop">Scan Settings</label>
      <label class="dbr-settings-text-in-mobile">Settings</label>
    </div>
    <template #content>
      <div class="dbr-settings" v-show="!settingsStore.shwoSettingCodesArea">
        <div class="dbr-screenshot-btn" @click="getImages" v-show="isDebug">
          <img src="../../assets/image/grey.svg" alt="screenshot" />
        </div>
        <div class="dbr-settings-options" @click.stop="">
          <div class="dbr-settings-option-1" v-show="['1d', '2d', '1d2d'].includes(useCaseStore.useCaseName)">
            <label>Single/Multi Barcode Scanning</label>
            <div class="dbr-single-or-multi-options">
              <label v-for="mode of ['Single', 'Multiple']" :class="`dbr-${mode.toLowerCase()}`" @click="() => settingsStore.updateSingleOrMulti(mode as SingleOrMulti)" :style="{ backgroundColor: settingsStore.singleOrMulti === mode ? '#fe8e14' : '#222' }">
                <input type="radio" class="dbr-radio" name="single-or-multiple" style="margin-right: 5px;" :checked="mode === 'Single'">
                {{ mode }}
              </label>
            </div>
          </div>
          <div class="dbr-settings-option-2" v-show="['1d', '2d', '1d2d'].includes(useCaseStore.useCaseName)">
            <label>Scan Mode</label>
            <div class="dbr-scan-mode">
              <label v-for="mode of ['Speed', 'Balance', 'Coverage']" :class="`dbr-${mode.toLowerCase()}`" @click="() => settingsStore.updateScanMode(mode as ScanMode)" :style="{ backgroundColor: settingsStore.scanMode === mode ? '#fe8e14' : '#222' }">
                <input type="radio" class="dbr-radio" name="scan-mode" style="margin-right: 5px;" :checked="mode === 'Speed'">
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
                  <input type="radio" class="dbr-radio" name="colour-mode" style="margin-right: 5px;" :checked="mode === 'Both'">
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
        <div class="dbr-view-setting-codes-btn" @click.stop="" :style="{ justifyContent: isDebug ? 'space-between' : 'flex-end' }">
          <label class="dbr-upload-template" for="upload-template" v-show="isDebug">
            <input type="file" id="upload-template" accept=".json" @change="uploadTemplate" style="display: none;">
            <svg t="1752225146415" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1439" width="20" height="20">
              <path d="M939.982029 724.992l-139.6736-139.6736a40.96 40.96 0 0 0-58.1632 0l-139.6736 139.6736a40.79616 40.79616 0 0 0 29.0816 69.632c10.6496 0 20.8896-4.096 29.0816-11.8784l70.0416-69.632V983.04c0 22.528 18.432 40.96 40.96 40.96s40.96-18.432 40.96-40.96v-269.9264l70.0416 69.632c8.192 8.192 18.432 11.8784 29.0816 11.8784s20.8896-4.096 29.0816-11.8784a40.79616 40.79616 0 0 0 0-57.7536z" p-id="1440" fill="#ffffff"></path>
              <path d="M521.780429 942.08H153.140429V81.92h544.3584L849.460429 233.8816V409.6c0 22.528 18.432 40.96 40.96 40.96s40.96-18.432 40.96-40.96V233.8816c0-21.7088-8.6016-42.5984-24.1664-57.7536L755.252429 24.1664C739.687629 8.6016 719.207629 0 697.089229 0H153.140429C108.084429 0 71.220429 36.864 71.220429 81.92v860.16c0 45.056 36.864 81.92 81.92 81.92h368.64c22.528 0 40.96-18.432 40.96-40.96s-18.432-40.96-40.96-40.96z" p-id="1441" fill="#ffffff"></path>
              <path d="M284.622029 215.4496c-22.528 0-40.96 18.432-40.96 40.96s18.432 40.96 40.96 40.96h396.0832c22.528 0 40.96-18.432 40.96-40.96s-18.432-40.96-40.96-40.96H284.622029zM557.825229 420.2496H284.622029c-22.528 0-40.96 18.432-40.96 40.96s18.432 40.96 40.96 40.96h273.2032c22.528 0 40.96-18.432 40.96-40.96s-18.432-40.96-40.96-40.96z" p-id="1442" fill="#ffffff"></path>
            </svg>
          </label>
          <div class="dbr-open-settings-view" @click.stop="() => settingsStore.updateSettingCodesAreaOpen(true)">
            View Setting Codes
            <RightOutlined />
          </div>
        </div>
      </div>
      <div class="dbr-setting-codes-area" v-show="settingsStore.shwoSettingCodesArea" @click.stop>
        <div class="dbr-setting-code-main" v-html="viewSettings"></div>
        <div class="dbr-setting-codes-area-footer">
          <div class="dbr-back" @click="() => settingsStore.updateSettingCodesAreaOpen(false)">
            <LeftOutlined /> Back
          </div>
          <div class="dbr-copy-settings" @click="copySettings" :style="{ color: isCopied ? '#FE8E14' : '#ffffff' }">
            {{ isCopied ? "Copied" : "Copy" }}
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

    @media (max-width: 980px) {
      width: 18px;
      height: 18px;
    }

    @media (max-height: 500px) and (max-width: 980px) {
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

    @media (max-width: 980px) {
      display: none;
    }
  }

  .dbr-settings-text-in-mobile {
    transform: scale(0.7);

    @media (min-width: 980px) {
      display: none;
    }
  }

  @media (max-width: 980px) {
    width: 25%;
  }
}

.ant-popover-open {
  background-color: rgb(34, 34, 34);
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

        img {
          width: 15px;
          height: 15px;
        }
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

              @media (max-width: 980px) {
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

                @media (max-width: 980px) {
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

      .dbr-auto-zoom {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: rgb(42, 42, 43);
        color: #dddddd;
        padding: 0 18px;

        .dbr-auto-zoom-title {
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
        }

        @media (hover: hover) and (pointer: fine) {
          &:hover {
            color: #fea543 !important;
          }
        }

        @media (max-width: 980px) {
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

      @media (max-width: 980px) and (orientation: landscape) {
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

    @media (max-width: 980px) {
      width: 330px;
      max-height: 65vh;
    }
  }
}
</style>
