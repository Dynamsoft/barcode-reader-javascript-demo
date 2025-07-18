<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { BarcodeResultItem } from "dynamsoft-barcode-reader-bundle";
import { useUseCaseStore } from "../../stores/useCase";
import { useCaptureImageStore } from "../../stores/captureImage";

const _window = window as any;

const props = defineProps<{
  result: BarcodeResultItem;
}>();

const useCaseStore = useUseCaseStore();
const captureImageStore = useCaptureImageStore();

const isBubbleVisible = ref(false);
const bubbleInfoBox = reactive({
  left: "",
  top: "",
  right: "",
  maxWidth: 190, // unit: px
  transform: "",
  arrowLeft: "",
  arrowRight: "",
  maxCharNumber: 22,
});

onMounted(() => {
  if (
    window.matchMedia("(min-width: 768px)").matches &&
    !window.matchMedia("(min-width: 600px) and (max-height: 600px) and (orientation: landscape)").matches
  ) {
    bubbleInfoBox.maxWidth = 300;
    bubbleInfoBox.maxCharNumber = 28;
  }
});

// Watch for changes in the barcode result and update bubble info box on change
watch(
  () => props.result,
  (newValue) => {
    // Get the top-left corner point and bottom-right corner point.
    // And convert them from related to video to related to viewport.
    const localization = newValue.location;
    const topLeft = {
      x: Math.min(...localization.points.map((point) => point.x)),
      y: Math.min(...localization.points.map((point) => point.y)),
    };
    const bottomRight = {
      x: Math.max(...localization.points.map((point) => point.x)),
      y: Math.max(...localization.points.map((point) => point.y)),
    };
    const convertedTopLeft = _window.cameraEnhancer.convertToClientCoordinates(topLeft);
    const convertedBottomRight = _window.cameraEnhancer.convertToClientCoordinates(bottomRight);

    // Update bubble position and style based on the barcode position
    bubbleInfoBox.top = `${convertedTopLeft.y}px`;
    const center = {
      x: (convertedTopLeft.x + convertedBottomRight.x) / 2,
      y: (convertedTopLeft.y + convertedBottomRight.y) / 2,
    };

    if (center.x < bubbleInfoBox.maxWidth / 2) {
      bubbleInfoBox.left = `${convertedTopLeft.x}px`;
      bubbleInfoBox.right = "";
      bubbleInfoBox.transform = "translateY(calc(-100% - 4px))";
      bubbleInfoBox.arrowLeft = "10px";
      bubbleInfoBox.arrowRight = "";
    } else if (document.documentElement.clientWidth - center.x < bubbleInfoBox.maxWidth / 2) {
      bubbleInfoBox.left = "";
      bubbleInfoBox.right = `${document.documentElement.clientWidth - convertedBottomRight.x}px`;
      bubbleInfoBox.transform = "translateY(calc(-100% - 4px))";
      bubbleInfoBox.arrowLeft = "";
      bubbleInfoBox.arrowRight = "10px";
    } else {
      bubbleInfoBox.left = `${center.x}px`;
      bubbleInfoBox.right = "";
      bubbleInfoBox.transform = "translate(-50%, calc(-100% - 4px))";
      bubbleInfoBox.arrowLeft = "calc(50% - 10px)";
      bubbleInfoBox.arrowRight = "";
    }
    isBubbleVisible.value = true;
  }
);

watch(
  () => captureImageStore.isShowCaptureImagePage,
  () => {
    isBubbleVisible.value = false;
  }
);
</script>

<template>
  <div v-show="useCaseStore.useCaseName !== 'dl'">
    <div
      class="dbr-bubble"
      v-show="isBubbleVisible"
      :style="{
        left: bubbleInfoBox.left,
        top: bubbleInfoBox.top,
        right: bubbleInfoBox.right,
        maxWidth: bubbleInfoBox.maxWidth + 'px',
        transform: bubbleInfoBox.transform,
      }"
    >
      <div class="dbr-bubble-content">
        <span class="dbr-bubble-format">{{ result.formatString }}</span>
        <!-- Calculate the count of characters and wrap. -->
        <br v-if="(result.formatString + result.text).length > bubbleInfoBox.maxCharNumber" />
        <span class="dbr-bubble-text">{{ result.text }}</span>
      </div>
      <div class="dbr-bubble-arrow" :style="{ left: bubbleInfoBox.arrowLeft, right: bubbleInfoBox.arrowRight }"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.dbr-bubble {
  position: absolute;
  padding: 7px 13px;
  width: max-content;
  min-width: 30px;
  font-size: 12px;
  color: white;
  background: #222222;
  word-break: break-all;
  z-index: 999;

  @media (min-width: 768px) {
    font-size: 16px;
  }

  @media (min-width: 600px) and (max-height: 600px) and (orientation: landscape) {
    font-size: 12px;
  }
}

.dbr-bubble {
  .dbr-bubble-content {
    .dbr-bubble-format {
      font-family: "OpenSans-Regular";

      &::after {
        content: ":";
        margin-left: 4px;
        margin-right: 3px;
      }
    }

    .dbr-bubble-text {
      font-family: "OpenSans-Regular";
    }
  }
}

.dbr-bubble {
  .dbr-bubble-arrow {
    position: absolute;
    bottom: -8px;
    border-left: 10px solid transparent;
    border-top: 8px solid #222222;
    border-right: 10px solid transparent;
  }
}
</style>
