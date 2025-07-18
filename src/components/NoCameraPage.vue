<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
// @ts-ignore
import QRCode from "qrcode";
import qrcodeUrl from "../assets/image/url-qrcode.png";
import { useCameraListStore } from "../stores/cameraList";
import { AllowNameSet, useUseCaseStore } from "../stores/useCase";

const qrcode = ref();

const cameraListStore = useCameraListStore();
const useCaseStore = useUseCaseStore();

const props = defineProps<{
  eventOnUseCaseChange: (oldUseCase?: AllowNameSet) => Promise<void>;
}>();

onBeforeMount(()=>{
  QRCode.toDataURL(location.href).then((url:string) => {
    qrcode.value = url;
  }).catch(() => {
    qrcode.value = qrcodeUrl;
  })
})

onMounted(()=>{
  props.eventOnUseCaseChange(useCaseStore.useCaseName);
})

const palyDemoVideo = () => {
  cameraListStore.updateHasCamera(true);
  cameraListStore.updateIsUseDemoVideo(true);

  const _currentCamera = cameraListStore.cameraList.filter((camera)=>{
    return camera.deviceId.split(".")[0] === useCaseStore.modeName;
  })[0];
  
  cameraListStore.updateCurrentCamera(_currentCamera);
  cameraListStore.updateCameraResolution(_currentCamera.resolution);
}
</script>

<template>
  <div class="dbr-no-camera-page">
    <div class="dbr-main-container">
      <div class="dbr-title">
        <i data-v-2f0525b8="" aria-label="icon: warning" class="anticon anticon-warning" style="margin-right: 10px;"><svg viewBox="64 64 896 896" data-icon="warning" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M464 720a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm16-304v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8zm475.7 440l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zm-783.5-27.9L512 239.9l339.8 588.2H172.2z"></path></svg></i>
        No camera detected
      </div>
      <div class="dbr-mobile-hint">Please check the phone camera usage permissions</div>
      <div class="dbr-desc">Scan the QR code and try the demo on your phone</div>
      <div class="dbr-qrcode-img"><img :src="qrcode" alt="demoUrl"></div>
      <div class="dbr-demo-camera" @click="palyDemoVideo">Use Demo Camera</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.dbr-no-camera-page {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #585757;

  .dbr-main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .dbr-title {
      width: 300px;
      height: 55px;
      background-color: #222222;
      margin-bottom: 50px;
      font-size: 24px;
      color: #ffffff;
      text-align: center;
      line-height: 55px;
    }
    .dbr-mobile-hint {
      font-size: 16px;
      color: #ffffff;
      margin-bottom: 15px;
      @media (min-width: 980px) {
        display: none;
      }
    }
    .dbr-desc {
      font-size: 24px;
      color: white;
      margin-bottom: 1em;

      @media (max-width: 980px) {
        display: none;
      }
    }
    .dbr-qrcode-img {
      padding: 40px;
      margin-bottom: 50px;
      background-color: #ffffff;

      @media (max-width: 980px) {
        display: none;
      }

      img{
        width: 160px;
        height: 160px;
      }
    }
    .dbr-demo-camera {
      font-size: 18px;
      color: #fe8e14;
      cursor: pointer;
    }
  }
}
</style>
