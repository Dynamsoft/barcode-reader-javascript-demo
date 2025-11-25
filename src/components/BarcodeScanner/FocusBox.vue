<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef } from "vue";

const focusInfo: {
  focusCvsTop: string;
  focusCvsLeft: string;
  focusBoxTimeout: any;
} = reactive({
  focusCvsTop: "50%",
  focusCvsLeft: "50%",
  focusBoxTimeout: 0,
});
const isShowFocusBox = ref(true);
const isShowText = ref(true);
const focusCvs = useTemplateRef("focusCvs");

// Draw and show the focus box on the canvas for 3 seconds and hides the focus box afterwards
const createCvsAndDrawBorder = () => {
  const _focusCvs = focusCvs.value;
  const ctx = _focusCvs?.getContext("2d");
  if (ctx) {
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    drawRoundedBorder(ctx, 0, 24, 0, 4, 0, 0, 4, 0, 7, 24, 0);
    drawRoundedBorder(ctx, 44, 0, 64, 0, 68, 0, 68, 4, 7, 68, 24);
    drawRoundedBorder(ctx, 68, 44, 68, 64, 68, 68, 64, 68, 7, 44, 68);
    drawRoundedBorder(ctx, 24, 68, 4, 68, 0, 68, 0, 64, 7, 0, 44);
    ctx.stroke();

    focusInfo.focusBoxTimeout = setTimeout(() => {
      isShowFocusBox.value = false;
      isShowText.value = false;
    }, 3000);
  }
};

// Draws a rounded border for the focus box
const drawRoundedBorder = (
  ctx: CanvasRenderingContext2D | null | undefined,
  hlStartX: number,
  hlStartY: number,
  hlEndX: number,
  hlEndY: number,
  firstControllX: number,
  firstControllY: number,
  secondControllX: number,
  secondControllY: number,
  radian: number,
  endX: number,
  endY: number
) => {
  ctx?.moveTo(hlStartX, hlStartY);
  ctx?.lineTo(hlEndX, hlEndY);
  ctx?.arcTo(firstControllX, firstControllY, secondControllX, secondControllY, radian);
  ctx?.lineTo(endX, endY);
};

onMounted(() => {
  createCvsAndDrawBorder();
  window.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).id !== "app") return;
    if (!focusCvs.value) return;

    if (isShowText.value) isShowText.value = false;
    if (focusInfo.focusBoxTimeout) {
      clearTimeout(focusInfo.focusBoxTimeout);
    }
    focusInfo.focusCvsTop = e.clientY + "px";
    focusInfo.focusCvsLeft = e.clientX + "px";
    focusCvs.value.style.animation = "none";
    focusCvs.value.offsetHeight;
    focusCvs.value.style.animation = "";
    if (!isShowFocusBox.value) isShowFocusBox.value = true;
    focusInfo.focusBoxTimeout = setTimeout(() => {
      isShowFocusBox.value = false;
    }, 2000);
  });
});
</script>

<template>
  <div
    class="dbr-focus-box"
    :style="{ top: focusInfo.focusCvsTop, left: focusInfo.focusCvsLeft }"
    v-show="isShowFocusBox"
  >
    <canvas class="dbr-focus-cvs" ref="focusCvs" width="68" height="68"></canvas>
    <div class="dbr-tap-to-focus" v-show="isShowText">Tap to focus</div>
  </div>
</template>

<style scoped lang="less">
.dbr-focus-box {
  width: 68px;
  height: 68px;
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 1;

  .dbr-focus-cvs {
    width: 100%;
    height: 100%;
    animation: scale 0.2s linear alternate 5;
    z-index: 1;
  }

  .dbr-tap-to-focus {
    width: 106px;
    height: 29px;
    position: absolute;
    bottom: -65%;
    transform: translateX(-17px);
    background-color: rgba(148, 147, 147, 0.4);
    border-radius: 5px;
    margin-top: 20px;
    text-align: center;
    line-height: 29px;
    font-family: "OpenSans-Regular";
    color: #fff;
  }
}

@keyframes scale {
  from {
    transform: scale(1.1);
  }

  to {
    transform: scale(1);
  }
}
</style>
