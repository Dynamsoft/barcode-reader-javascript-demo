<script setup lang="ts">
import { ref, Ref, getCurrentInstance, computed } from "vue";
import { Popover, Switch } from "ant-design-vue";
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import { usePopoverOpenStore } from "../../stores/popoverOpen";
import { useSettingsStore } from "../../stores/settings";
import { useUseCaseStore } from "../../stores/useCase";
import { useCaptureImageStore } from "../../stores/captureImage";
import { useCameraListStore } from "../../stores/cameraList";
import { getDate, isDebug } from "../../util";
import { ResolutionMap } from "../../assets/enum/Resolution";
import Clipboard from "clipboard";
import JSZip from "jszip";

const _window = window as any;

const props = defineProps<{
  currentTemplate: string;
}>();

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
  await _window.cvRouter.startCapturing(props.currentTemplate);
};

// Captures images from the camera and adds them to the download list.
const saveImages = async () => {
  return new Promise<void>(async (resolve) => {
    let index = 0;
    while (index < 8) {
      const cvs = _window.cameraEnhancer.getImage().toCanvas();
      if (cvs != null) {
        const blob = cvs.convertToBlob
          ? await cvs.convertToBlob()
          : await new Promise((resolve) => {
              cvs.toBlob((blob: Blob) => resolve(blob));
            });
        downloadImg.value.push({
          name: "Screenshot - " + new Date().toISOString().replace(/\:/g, "-") + ".png",
          blob,
        });
        index++;
      }
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
  _viewSettings += `const settings = await cvRouter.getSimplifiedSettings('${props.currentTemplate}');<br>`;
  _viewSettings += `settings.barcodeSettings.expectedBarcodesCount = ${
    settingsStore.singleOrMulti === "single" ? 1 : 512
  };<br>`;
  _viewSettings += `settings.barcodeSettings.grayscaleTransformationModes[0] = ${
    settingsStore.colourMode === "Inverted" ? "1" : "2"
  };<br>`;

  if (useCaseStore.useCaseName === "vin") {
    _viewSettings += `settings.barcodeSettings.barcodeFormatIds = 0x1 | 0x2 | 0x4 | 0x400 | 0x8 | 0x10 | 0x200 | 0x04000000 | 0x08000000;<br>`;
  } else if (useCaseStore.useCaseName === "dl") {
    _viewSettings += `settings.barcodeSettings.barcodeFormatIds = 0x02000000;<br>`;
  } else if (useCaseStore.useCaseName === "dpm") {
    _viewSettings += `settings.barcodeSettings.barcodeFormatIds = 0x08000000;<br>`;
  }

  _viewSettings += `await cvRouter.updateSettings('${props.currentTemplate}', settings);<br>`;
  if (!captureImageStore.isShowCaptureImagePage) {
    _viewSettings += `await cvRouter.startCapturing('${props.currentTemplate}');<br>`;
  }
  if (settingsStore.autoZoom && !captureImageStore.isShowCaptureImagePage) {
    _viewSettings += `cameraEnhancer.enableEnhancedFeatures(0x10);<br>`;
  }
  return _viewSettings;
});

window.addEventListener("resize", () => {
  const isWideScreen = document.body.clientWidth > 980;
  placement.value = isWideScreen ? "rightBottom" : "topRight";
  shouldShowArrow.value = !isWideScreen;
});
</script>

<template>
  <Popover
    overlayClassName="dbr-settings-popover"
    :placement="placement"
    :arrow="shouldShowArrow"
    :open="popoverOpenStore.settingsController"
  >
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
              <div
                class="dbr-single"
                @click="() => settingsStore.updateSingleOrMulti('single')"
                :style="{
                  backgroundColor: settingsStore.singleOrMulti === 'single' ? '#fe8e14' : '#222',
                }"
              >
                Single
              </div>
              <div
                class="dbr-multiple"
                @click="() => settingsStore.updateSingleOrMulti('multiple')"
                :style="{
                  backgroundColor: settingsStore.singleOrMulti === 'multiple' ? '#fe8e14' : '#222',
                }"
              >
                Multiple
              </div>
            </div>
          </div>
          <div class="dbr-settings-option-2" v-show="['1d', '2d', '1d2d'].includes(useCaseStore.useCaseName)">
            <label>Scan Mode</label>
            <div class="dbr-scan-mode">
              <div
                class="dbr-best-speed"
                @click="() => settingsStore.updateScanMode('Best Speed')"
                :style="{
                  backgroundColor: settingsStore.scanMode === 'Best Speed' ? '#fe8e14' : '#222',
                }"
              >
                Best Speed
              </div>
              <div
                class="dbr-balance"
                @click="() => settingsStore.updateScanMode('Balance')"
                :style="{
                  backgroundColor: settingsStore.scanMode === 'Balance' ? '#fe8e14' : '#222',
                }"
              >
                Balance
              </div>
              <div
                class="dbr-best-coverage"
                @click="() => settingsStore.updateScanMode('Best Coverage')"
                :style="{
                  backgroundColor: settingsStore.scanMode === 'Best Coverage' ? '#fe8e14' : '#222',
                }"
              >
                Best Coverage
              </div>
            </div>
          </div>
          <div class="dbr-settings-option-3">
            <label>Barcode Colour Option</label>
            <div class="dbr-colour-mode-desc">scan light barcodes on dark background</div>
            <div class="dbr-colour-mode">
              <div
                class="dbr-interved"
                @click="() => settingsStore.updateColourMode('Inverted')"
                :style="{
                  backgroundColor: settingsStore.colourMode === 'Inverted' ? '#fe8e14' : '#222',
                }"
              >
                <div class="dbr-text">Inverted</div>
                <div class="dbr-image-inverted">
                  <img src="../../assets/image/barcode.svg" alt="barcode" />
                </div>
              </div>
              <div
                class="dbr-normal"
                @click="() => settingsStore.updateColourMode('Normal')"
                :style="{
                  backgroundColor: settingsStore.colourMode === 'Normal' ? '#fe8e14' : '#222',
                }"
              >
                <div class="dbr-text">Normal</div>
                <div class="dbr-image-normal">
                  <img src="../../assets/image/barcode.svg" alt="barcode" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dbr-auto-zoom" @click.stop v-show="!captureImageStore.isShowCaptureImagePage">
          <div class="dbr-auto-zoom-title">Auto Zoom</div>
          <Switch v-model:checked="settingsStore.autoZoom" />
        </div>
        <div class="dbr-view-setting-codes-btn" @click.stop="() => settingsStore.updateSettingCodesAreaOpen(true)">
          View Setting Codes
          <RightOutlined />
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

          .dbr-colour-mode-desc {
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
            .dbr-best-speed,
            .dbr-balance,
            .dbr-best-coverage,
            .dbr-interved,
            .dbr-normal {
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #222;
              color: #ffffff;
              font-size: 16px;
              font-family: OpenSans-Regular;
              margin-right: 20px;
              padding: 0 15px;
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
            }

            .dbr-interved,
            .dbr-normal {
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

            .dbr-best-coverage {
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
        padding-right: 10px;
        cursor: pointer;

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
