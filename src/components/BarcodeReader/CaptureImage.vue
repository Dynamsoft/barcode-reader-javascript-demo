<script setup lang="ts">
import { ref, Ref, watch, nextTick, onMounted, onUnmounted, useTemplateRef } from "vue";
import { useCaptureImageStore } from "../../stores/captureImage";
import { useScanOptionsStore } from "../../stores/scanOptions";
import { useSettingsStore } from "../../stores/settings";
import { useCameraListStore } from "../../stores/cameraList";
import { message } from "ant-design-vue";
import Clipboard from "clipboard";
import ParsedResult from "./ParsedResult.vue";

const _window = window as any;

const imageAreaRef = useTemplateRef("imageAreaRef");
const resultCanvasRef = useTemplateRef("resultCanvasRef");
const isCopied: Ref<Array<boolean>> = ref([]);
const captureImageStore = useCaptureImageStore();
const scanOptionsStore = useScanOptionsStore();
const settingsStore = useSettingsStore();
const cameraListStore = useCameraListStore();

let currentImage: HTMLCanvasElement;

onMounted(() => {
  // Redraws overlay when the window is resized.
  window.addEventListener("resize", resizeEvent);
})

onUnmounted(() => {
  window.removeEventListener("resize", resizeEvent);
})

/**
 * Converts an image file to an HTMLCanvasElement.
 * @param {File | null} file - The image file to be converted.
 * @returns {Promise<HTMLCanvasElement | null>} - A promise that resolves to an HTMLCanvasElement or null if no file is provided.
 */
const fileToCanvas = async (file: File | null): Promise<HTMLCanvasElement | null> => {
  if (!file) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Adjust original image dimensions to fit container's dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.objectFit = "contain";
        ctx!.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.onerror = reject;
      img.src = (event.target as FileReader).result as string;
    };

    // Read file contents as DataURL
    reader.readAsDataURL(file);
  });
};

/**
 * Draws overlay over the read barcodes on the canvas
 * @param {HTMLCanvasElement} oriImg - The image canvas.
 */
const drawResults = (oriImg: HTMLCanvasElement) => {
  if (!oriImg) return;
  resultCanvasRef.value!.innerText = "";

  const oriWidth = oriImg.width;
  const oriHeight = oriImg.height;
  const oriRatio = oriWidth / oriHeight;

  const imgWidth = parseInt(getComputedStyle(oriImg).width);
  const imgHeight = parseInt(getComputedStyle(oriImg).height);
  const imgRatio = imgWidth / imgHeight;

  captureImageStore.captureResult.forEach((result, i) => {
    const cvs = document.createElement("canvas");
    const ctx = cvs.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-over";

    const { points } = result.location;
    const [x0, x1, x2, x3] = points.map((p) => p.x);
    const [y0, y1, y2, y3] = points.map((p) => p.y);

    const maxX = Math.max(x0, x1, x2, x3);
    const minX = Math.min(x0, x1, x2, x3);
    const maxY = Math.max(y0, y1, y2, y3);
    const minY = Math.min(y0, y1, y2, y3);

    let widthZoom: number;
    let heightZoom: number;

    if (oriRatio > imgRatio) {
      widthZoom = imgWidth / oriWidth;
      heightZoom = imgWidth / oriRatio / oriHeight;
      cvs.style.top = `${minY * heightZoom + (imgHeight - imgWidth / oriRatio) * 0.5}px`;
      cvs.style.left = `${minX * widthZoom}px`;
      cvs.width = (maxX - minX) * widthZoom;
      cvs.height = (maxY - minY) * widthZoom;
      cvs.style.width = `${cvs.width}px`;
      cvs.style.height = `${cvs.height}px`;
    } else {
      widthZoom = (imgHeight * oriRatio) / oriWidth;
      heightZoom = imgHeight / oriHeight;
      cvs.style.top = `${minY * heightZoom}px`;
      cvs.style.left = `${minX * widthZoom + (imgWidth - imgHeight * oriRatio) * 0.5}px`;
      cvs.width = (maxX - minX) * heightZoom;
      cvs.height = (maxY - minY) * heightZoom;
      cvs.style.width = `${cvs.width}px`;
      cvs.style.height = `${cvs.height}px`;
    }
    cvs.style.position = "absolute";

    const offsetX = [x0, x1, x2, x3].map((x) => (x - minX) * widthZoom);
    const offsetY = [y0, y1, y2, y3].map((y) => (y - minY) * heightZoom);

    cvs.width = Math.max(cvs.width, Math.max(...offsetX));
    cvs.height = Math.max(cvs.height, Math.max(...offsetY));

    ctx.fillStyle = result.formatString === "PatchCode" ? "rgba(97, 189, 79, 0.2)" : "rgba(97, 189, 79, 0.5)";
    cvs.style.zIndex = result.formatString === "PatchCode" ? "1" : "2";

    ctx.moveTo(offsetX[0], offsetY[0]);
    ctx.lineTo(offsetX[1], offsetY[1]);
    ctx.lineTo(offsetX[2], offsetY[2]);
    ctx.lineTo(offsetX[3], offsetY[3]);
    ctx.closePath();
    ctx.fill();

    cvs.title = `${i + 1}. ${result.formatString} : ${result.text}`;
    resultCanvasRef.value?.appendChild(cvs);
  });
};

const resizeEvent = () => { drawResults(currentImage); }

/**
 * Copies read barcode results to the clipboard.
 * @param {string} txt - The text to be copied.
 * @param {number} index - The index of the text in the results.
 */
const copyResult = (txt: string, index: number) => {
  if (isCopied.value[index]) return;

  let clipboard = new Clipboard(".dbr-result-copy-btn", {
    text: () => txt,
  });

  clipboard.on("success", () => {
    isCopied.value[index] = true;
    setTimeout(() => {
      isCopied.value[index] = false;
    }, 5000);
    message.success({
      content: "Copied!",
      duration: 1
    });
    clipboard.destroy();
  });

  clipboard.on("error", () => {
    isCopied.value[index] = false;
    message.error({
      content: "Failed!",
      duration: 1
    });
    clipboard.destroy();
  });
};

const restartVideo = async () => {
  message.loading({
    content: "Restarting...",
    key: "restartVideo",
  });

  try {
    if (cameraListStore.hasCamera) {
      await _window.cameraEnhancer.open();
      await _window.cvRouter.startCapturing(scanOptionsStore.currentScanOption.templateName);
      _window.cameraView.setScanLaserVisible(settingsStore.zonalScan);
    }
    captureImageStore.captureImagePageVisible(false);
    message.success({
      content: cameraListStore.hasCamera ? "Restarted" : "Returned",
      key: "restartVideo",
      duration: 1
    });
  } catch (ex: any) {
    message.error({
      content: ex.message || ex,
      key: "restartVideo",
      duration: 1
    });
  }
};

watch([() => captureImageStore.currentSelectedImageFile, () => captureImageStore.captureResult], async () => {
  isCopied.value = [];
  const cvs = await fileToCanvas(captureImageStore.currentSelectedImageFile);
  if (cvs) {
    imageAreaRef.value!.innerText = "";
    currentImage = cvs;

    imageAreaRef.value!.appendChild(cvs);
    nextTick(() => {
      drawResults(cvs);
    });
  }
});
</script>

<template>
  <div class="dbr-image-capture">
    <div class="dbr-image-result-area">
      <div class="dbr-image-area">
        <div class="dbr-original-image" ref="imageAreaRef"></div>
        <div class="dbr-result-canvas" ref="resultCanvasRef"></div>
      </div>
      <div class="dbr-result-area">
        <div class="dbr-result-header">
          <div class="dbr-result-title">Results</div>
        </div>
        <ul class="dbr-result-list" v-show="!['Drivers License (PDF417)', 'VIN'].includes(scanOptionsStore.currentScanOption.name) && !captureImageStore.isDecoding">
          <li v-for="(item, index) of captureImageStore.captureResult" class="dbr-result-item" :key="index">
            <div class="dbr-result-format-and-text">
              {{ `${index + 1}. ${item.formatString} : ${item.text}` }}
            </div>
            <div class="dbr-result-copy-btn" :style="{ color: isCopied[index] ? '#fe8e14 ' : '#aaaaaa' }" @click="
              () => {
                copyResult(item.text, index);
              }
            ">
              {{ isCopied[index] ? "Copied" : "Copy" }}
            </div>
          </li>
          <li class="dbr-no-barcode-found" v-show="!captureImageStore.captureResult.length && scanOptionsStore.currentScanOption.name !== 'Drivers License (PDF417)'">
            {{ "No barcodes found !" }}
          </li>
        </ul>
        <ParsedResult v-show="['Drivers License (PDF417)', 'VIN'].includes(scanOptionsStore.currentScanOption.name)" />
      </div>
    </div>
    <div class="dbr-restart-video-btn" @click="restartVideo">{{ cameraListStore.hasCamera ? "RESTART VIDEO" : "BACK" }}</div>
  </div>
</template>

<style scoped lang="less">
.dbr-image-capture {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #585757;

  .dbr-image-result-area {
    width: 70%;
    height: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;

    @media (max-width: 979.5px) {
      width: 100%;
      height: calc(100% - 16.5vh);
      flex-direction: column;
    }

    .dbr-image-area {
      width: 50%;
      height: 100%;
      position: relative;

      .dbr-original-image {
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #262626;
      }

      .dbr-result-canvas {
        width: 100%;
        height: 100%;
        position: absolute;
      }

      @media (max-width: 979.5px) {
        width: 100%;
        height: 25%;
      }
    }

    .dbr-result-area {
      width: 50%;
      height: 100%;
      padding: 10px 20px 24px 20px;
      color: white;
      background-color: #464545;
      font-size: 20px;

      .dbr-result-header {
        width: 100%;

        .dbr-result-title {
          margin-bottom: 15px;
          font-family: "Oswald-Regular";
        }
      }

      .dbr-result-list {
        height: 90%;
        overflow: auto;

        .dbr-result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          word-break: break-all;
          margin-bottom: 10px;

          .dbr-result-format-and-text {
            width: calc(100% - 45px);
            font-family: OpenSans-Regular;
            font-size: 16px;
          }

          .dbr-result-copy-btn {
            font-size: 16px;
            cursor: pointer;
            font-family: "Oswald-Regular"
          }
        }

        .dbr-no-barcode-found {
          font-family: OpenSans-Regular;
          font-size: 14px;
        }

        @media (max-width: 979.5px) {
          height: 80%;
        }
      }

      @media (max-width: 979.5px) {
        width: 100%;
        height: 75%;
      }
    }

    @media (max-width: 979.5px) {
      top: 7.5vh;
      left: unset;
      transform: unset;
    }
  }

  .dbr-restart-video-btn {
    width: 150px;
    height: 5vh;
    max-height: 50px;
    min-height: 30px;
    position: absolute;
    top: 80%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fe8e14;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-family: "Oswald-Regular";
    
    &:hover {
      background-color: #fea543 !important;
    }

    @media (max-width: 979.5px) {
      top: unset;
      bottom: 12%;
    }
  }
}
</style>
