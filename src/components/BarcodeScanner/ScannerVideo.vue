<script setup lang="ts">
import {
  onMounted,
  ref,
  Ref,
  watch,
  getCurrentInstance,
  onBeforeMount,
  onUnmounted
} from "vue";
import {
  CameraEnhancer,
  CameraView,
  EnumEnhancedFeatures,
  Feedback,
  OriginalImageResultItem,
  CapturedResultItem,
  CaptureVisionRouter,
  CapturedResult,
  CapturedResultReceiver,
  IntermediateResultReceiver,
  CodeParser, ParsedResultItem,
  BarcodeResultItem
} from "dynamsoft-barcode-reader-bundle";
import GeneralResultBox from "./GeneralResultBox.vue";
import DriverLicenseResultBox from "./DriverLicenseResultBox.vue";
import ResultBubble from "./ResultBubble.vue";
import FocusBox from "./FocusBox.vue";
import { useCameraListStore } from "../../stores/cameraList";
import { AllowNameSet, useUseCaseStore } from "../../stores/useCase";
import { useSettingsStore } from "../../stores/settings";
import { useResultCountStore } from "../../stores/resultCount";
import { useCaptureImageStore } from "../../stores/captureImage";
import { useScanRegionStore } from "../../stores/scanRegion";
import { getValueByKey, urlMap } from "../../util";
import { ExtendedMediaTrackCapabilities, ParsedDataFailed } from "../../types";
import { EnumResolution, ResolutionMap } from "../../assets/enum/Resolution";

const _window = window as any;

const props = defineProps<{
  udpateSettings: () => Promise<void>;
  eventOnUseCaseChange: (oldUseCase?: AllowNameSet) => Promise<void>;
  setUseCaseBarcodeFormat: (isBeforeMount: boolean, oldUseCase?: AllowNameSet) => Promise<void>;
}>();

const useCaseStore = useUseCaseStore();
const cameraListStore = useCameraListStore();
const resultCountStore = useResultCountStore();
const settingsStore = useSettingsStore();
const captureImageStore = useCaptureImageStore();
const scanRegionStore = useScanRegionStore();

const videoElRef: Ref<HTMLDivElement | null> = ref(null);
const scanareaRef: Ref<HTMLDivElement | null> = ref(null);
const isMountFocusBox = ref(false);
const isSupportFocus = ref(false);
const isShowTorchButton = ref(false);
const isOpenTorch = ref(false);
const scannerResult: Ref<Array<BarcodeResultItem>> = ref([]);
let cameraView: CameraView | null;
let cameraEnhancer: CameraEnhancer | null;
let cvRouter: CaptureVisionRouter | null;
let parser: CodeParser | null;
let currentInstance: any = getCurrentInstance();
let timer: any;

// URL handling for use case setup
let splitArr = location.pathname.split("/");
let targetStr = splitArr[splitArr.length - 1] ? splitArr[splitArr.length - 1] : splitArr[splitArr.length - 2];
let useCaseName = getValueByKey(urlMap, targetStr);
useCaseStore.changeUseCase(useCaseName as AllowNameSet);

onBeforeMount(async () => {
  // After entering the video page from the guide page, set the barcode format type status corresponding to the selected useCaose before mounting
  await props.setUseCaseBarcodeFormat(true);
  if (useCaseStore.useCaseName === "dl") {
    captureImageStore.updateCurrentTemplate("ReadDenseBarcodes");
  }
});

// Event listener for window resize to adjust camera view and capture settings
const resizeEvent = () => {
  // Hide scan laser and scan region mask
  cameraView?.setScanLaserVisible(false);
  cameraView?.setScanRegionMaskVisible(false);

  // Stop capturing and clear any existing drawing items
  cvRouter?.stopCapturing();
  cameraView?.clearAllInnerDrawingItems();

  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    if (cameraView) {
      // Update the visible region in pixels
      scanRegionStore.updateVisibleRegionInPixels(cameraView.getVisibleRegionOfVideo({ inPixels: true }));

      // Update scan region settings
      cameraEnhancer?.setScanRegion(scanRegionStore.region);

      // Re-show scan region mask and adjust scan laser visibility
      setTimeout(() => {
        cameraView?.setScanRegionMaskVisible(true);
        if (!captureImageStore.isShowDlResultBox) {
          cameraView?.setScanLaserVisible(settingsStore.zonalScan);
          cvRouter?.startCapturing(captureImageStore.currentTemplate);
        }
      }, 0);
    }
  }, 500);
}

onMounted(async () => {
  try {
    cameraView = await CameraView.createInstance(videoElRef.value!);
    cameraEnhancer = await CameraEnhancer.createInstance(cameraView);
    cvRouter = (_window.cvRouter as CaptureVisionRouter) || await CaptureVisionRouter.createInstance();
    parser = (_window.parser as CodeParser) || await CodeParser.createInstance();

    cvRouter.setInput(cameraEnhancer);
    cameraEnhancer.getVideoEl().setAttribute("loop", "true");

    if (cameraListStore.isUseDemoVideo) {
      // Each use case may have multiple videos, and the default video should be selected upon the first load.
      const _currentDemoCamera = cameraListStore.cameraList.filter((camera) => {
        return camera._belong === useCaseStore.modeName;
      }).filter(camera => camera._isDefualt)[0];
      const _url = new URL(`../../assets/videos/${_currentDemoCamera.deviceId}`, import.meta.url).href;
      cameraEnhancer.videoSrc = _url;
    }

    // Configure Intermediate Result Receiver
    const intermediateManager = cvRouter.getIntermediateResultManager();
    const irr = new IntermediateResultReceiver();
    irr.onLocalizedBarcodesReceived = () => {
      settingsStore.updateIsLocalized(true);
    };
    intermediateManager.addResultReceiver(irr);

    // Configure Captured Result Receiver
    const crr = new CapturedResultReceiver();
    crr.onCapturedResultReceived = async (result: CapturedResult) => {
      // Play sound when barcode is decoded
      if (result.decodedBarcodesResult?.barcodeResultItems) {
        settingsStore.playSound && Feedback.beep();
      }

      // Use Case: Non-Driver License
      if (result.decodedBarcodesResult?.barcodeResultItems && useCaseStore.useCaseName !== "dl") {
        scannerResult.value = result.decodedBarcodesResult.barcodeResultItems;
        resultCountStore.updateResultCount(result.decodedBarcodesResult.barcodeResultItems);
      } else {
        scannerResult.value = [];
      }

      // Use Case: Driver License
      let parsedData: ParsedResultItem | object = {};
      if (result.decodedBarcodesResult?.barcodeResultItems && useCaseStore.useCaseName === "dl") {
        cvRouter?.stopCapturing();
        cameraView?.setScanLaserVisible(false);
        cameraView?.clearAllInnerDrawingItems();
        try {
          parsedData = await parser!.parse(result.decodedBarcodesResult.barcodeResultItems[0].bytes);
        } catch (ex: any) {
          (parsedData as ParsedDataFailed).exception = true;
          (parsedData as ParsedDataFailed).message = ex.message || ex;
          (parsedData as ParsedDataFailed).text = result.decodedBarcodesResult.barcodeResultItems[0].text;
        }
        if ((parsedData as ParsedDataFailed).exception) {
          captureImageStore.updateDLJsonString(JSON.stringify(parsedData));
        } else {
          captureImageStore.updateDLJsonString((parsedData as ParsedResultItem).jsonString);
        }
        captureImageStore.updateDlResultBoxVisibility(true);
      }
    };
    cvRouter.addResultReceiver(crr);

    // Set global window objects for debugging
    _window.cameraView = cameraView;
    _window.cameraEnhancer = cameraEnhancer;
    _window.cvRouter = _window.cvRouter || cvRouter;
    _window.parser = _window.parser || parser;

    // Configure CameraView
    cameraView.setScanRegionMaskStyle({ lineWidth: 2, strokeStyle: "rgb(254,142,20)", fillStyle: "rgba(0,0,0,0.5)" });
    cameraView.setVideoFit(cameraListStore.isUseDemoVideo ? "contain" : "cover");

    // Set the camera resolution and open the camera
    const _isVideoLoaded = _window.cameraView.isVideoLoaded;
    await cameraEnhancer.setResolution(ResolutionMap[EnumResolution.FULL_HD]);
    try {
      await cameraEnhancer.open();
    } catch {
      cameraListStore.updateHasCamera(false);
    } finally {
      cameraListStore.updateIsLoading(false);
    }
    if (cameraListStore.hasCamera) {
      cameraView.isVideoLoaded = () => true;

      if (!cameraListStore.isUseDemoVideo) {
        scanRegionStore.updateVisibleRegionInPixels(cameraView.getVisibleRegionOfVideo({ inPixels: true }));
        cameraEnhancer.setScanRegion(scanRegionStore.region);

        // Check for focus support and enable torch button
        const capabilities = cameraEnhancer.getCapabilities() as ExtendedMediaTrackCapabilities;
        isSupportFocus.value = !!capabilities?.focusMode;
        isShowTorchButton.value = !!capabilities?.torch;
        isMountFocusBox.value = true;
      }

      // await props.udpateSettings();
      /**
        Why do we need to pass a "1d2d"? Since the settings and switching of useCase may be performed before the camera is opened, 
        to ensure the correct barcode format settings, we need to make sure that the setUseCaseBarcodeFormat logic is executed. 
        There is room for optimization in this logic.
      */
      await props.eventOnUseCaseChange("1d2d");

      cameraView.setScanLaserVisible(settingsStore.zonalScan);
      cameraView.setScanRegionMaskVisible(true);

      // Update the camera list and selected camera/resolution
      let cameraList: any = await cameraEnhancer.getAllCameras();
      cameraListStore.updateCameraList(cameraList);
      let currentCamera;
      let currentResolution;
      if (cameraListStore.isUseDemoVideo) {
        currentCamera = cameraListStore.cameraList.filter((camera) => {
          return camera._belong === useCaseStore.modeName;
        }).filter(camera => camera._isDefualt)[0];
        currentResolution = currentCamera.resolution;
      } else {
        currentCamera = cameraEnhancer.getSelectedCamera();
        currentResolution = cameraEnhancer.getResolution();
      }
      cameraListStore.updateCurrentCamera(currentCamera);
      cameraListStore.updateCameraResolution(currentResolution);

      if (captureImageStore.isShowCaptureImagePage) {
        cameraEnhancer.close();
        cvRouter.stopCapturing();
      }
      cameraView.isVideoLoaded = _isVideoLoaded;
    }
  } catch (ex: any) {
    alert(ex.message || ex);
  }
  window.addEventListener("resize", resizeEvent);
});

onUnmounted(() => {
  cameraEnhancer?.dispose();
  _window.cameraView = null;
  _window.cameraEnhancer = null;
  window.removeEventListener("resize", resizeEvent);
})

watch(
  () => settingsStore.zonalScan,
  (newValue: boolean) => {
    if (!captureImageStore.isShowDlResultBox) {
      cameraView?.setScanLaserVisible(newValue);
    }
    cameraEnhancer?.setScanRegion(scanRegionStore.region);
  }
);

watch(
  () => settingsStore.autoZoom,
  (newValue: boolean) => {
    if (newValue) {
      cameraEnhancer?.enableEnhancedFeatures(EnumEnhancedFeatures.EF_AUTO_ZOOM);
    } else {
      cameraEnhancer?.disableEnhancedFeatures(EnumEnhancedFeatures.EF_AUTO_ZOOM);
    }
    // autozoom is only effective in full screen mode, so the scan region is updated synchronously here. This logic will be removed after the bug is fixed.
    settingsStore.updateZonalScan(!settingsStore.autoZoom);
  }
);

watch(
  () => captureImageStore.isShowCaptureImagePage,
  (newValue: boolean) => {
    resultCountStore.$state.clear();
    captureImageStore.updateDlResultBoxVisibility(false);
    if (!newValue) {
      scanRegionStore.updateVisibleRegionInPixels(cameraView?.getVisibleRegionOfVideo({ inPixels: true }));
      cameraEnhancer?.setScanRegion(scanRegionStore.region);
    }
  }
);

const switchTorch = async () => {
  if (!isOpenTorch.value) {
    try {
      await cameraEnhancer?.turnOnTorch();
      isOpenTorch.value = true;
    } catch (ex: any) {
      currentInstance.proxy.$message.error(ex.message);
      isShowTorchButton.value = false;
    }
  } else {
    await cameraEnhancer?.turnOffTorch();
    isOpenTorch.value = false;
  }
};

</script>

<template>
  <div class="dbr-video-container" ref="videoElRef">
    <svg class="dce-bg-loading-demo" viewBox="0 0 1792 1792">
      <path d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z" />
    </svg>
    <svg class="dce-bg-camera" viewBox="0 0 2048 1792">
      <path d="M1024 672q119 0 203.5 84.5t84.5 203.5-84.5 203.5-203.5 84.5-203.5-84.5-84.5-203.5 84.5-203.5 203.5-84.5zm704-416q106 0 181 75t75 181v896q0 106-75 181t-181 75h-1408q-106 0-181-75t-75-181v-896q0-106 75-181t181-75h224l51-136q19-49 69.5-84.5t103.5-35.5h512q53 0 103.5 35.5t69.5 84.5l51 136h224zm-704 1152q185 0 316.5-131.5t131.5-316.5-131.5-316.5-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5z" />
    </svg>
    <div class="dce-video-container"></div>
    <div class="dce-scanarea" ref="scanareaRef">
      <div class="dce-scanlight"></div>
    </div>
    <!-- The "Powered by Dynamsoft" logo can be easily removed by eliminating the following line. -->
    <div class="dce-msg-poweredby">
      <svg viewBox="0 0 94 17" style="height: max(3vmin, 17px); fill: #ffffff">
        <g>
          <path d="M0.9,14V4.3h2.3c0.6,0,1,0.1,1.4,0.3c0.3,0.2,0.6,0.5,0.7,0.9s0.2,0.8,0.2,1.4c0,0.5-0.1,0.9-0.2,1.3
			C5.1,8.5,4.9,8.8,4.5,9.1C4.2,9.3,3.7,9.4,3.2,9.4H1.8V14H0.9z M1.8,8.7h1.2c0.4,0,0.7-0.1,1-0.2S4.3,8.2,4.4,8
			c0.1-0.3,0.2-0.6,0.2-1.1c0-0.5,0-0.9-0.1-1.2C4.3,5.4,4.2,5.2,3.9,5.1S3.4,5,2.9,5H1.8V8.7z" />
          <path d="M8.1,14.1c-0.5,0-0.8-0.1-1.1-0.3s-0.5-0.5-0.6-0.9s-0.2-0.9-0.2-1.4V9.6c0-0.6,0.1-1,0.2-1.4
			C6.5,7.8,6.7,7.5,7,7.3S7.6,7,8.1,7C8.6,7,9,7.1,9.2,7.3s0.5,0.5,0.6,0.9C9.9,8.5,9.9,9,9.9,9.6v1.9c0,0.6-0.1,1-0.2,1.4
			c-0.1,0.4-0.3,0.7-0.6,0.9S8.6,14.1,8.1,14.1z M8.1,13.4c0.3,0,0.5-0.1,0.7-0.2C8.9,13,9,12.8,9,12.5c0-0.3,0-0.6,0-1v-2
			c0-0.4,0-0.7,0-1C9,8.2,8.9,8,8.8,7.9C8.6,7.7,8.4,7.6,8.1,7.6c-0.3,0-0.5,0.1-0.7,0.2C7.3,8,7.2,8.2,7.2,8.5c0,0.3-0.1,0.6-0.1,1
			v2c0,0.4,0,0.7,0.1,1c0,0.3,0.1,0.5,0.3,0.7C7.6,13.4,7.8,13.4,8.1,13.4z" />
          <path d="M12,14l-1.1-6.9h0.7l0.9,5.8l1.1-5.8h0.8l1.1,5.8l0.8-5.8H17L15.9,14H15l-1.1-5.6L12.8,14H12z" />
          <path d="M19.8,14.1c-0.4,0-0.8-0.1-1.1-0.3s-0.5-0.5-0.6-0.9c-0.1-0.4-0.2-0.9-0.2-1.6V9.6c0-0.7,0.1-1.2,0.2-1.6
			c0.1-0.4,0.3-0.7,0.6-0.8C19,7,19.3,7,19.8,7c0.5,0,0.9,0.1,1.1,0.3c0.3,0.2,0.4,0.5,0.5,0.9c0.1,0.4,0.1,1,0.1,1.6v0.6h-2.8v1.2
			c0,0.4,0,0.8,0.1,1.1c0.1,0.3,0.2,0.4,0.3,0.6s0.3,0.2,0.6,0.2c0.2,0,0.3,0,0.5-0.1c0.1-0.1,0.3-0.2,0.3-0.4s0.1-0.5,0.1-0.8v-0.5
			h0.9V12c0,0.6-0.1,1.1-0.4,1.5S20.4,14.1,19.8,14.1z M18.8,9.9h1.9V9.4c0-0.4,0-0.7-0.1-0.9c0-0.3-0.1-0.5-0.3-0.6S20,7.6,19.8,7.6
			c-0.2,0-0.4,0.1-0.6,0.2c-0.1,0.1-0.3,0.3-0.3,0.6c-0.1,0.3-0.1,0.7-0.1,1.1V9.9z" />
          <path d="M22.8,14V7.1h0.9V8c0.2-0.4,0.5-0.6,0.8-0.8C24.8,7.1,25,7,25.3,7c0,0,0,0,0.1,0s0.1,0,0.1,0v0.9
			c-0.1,0-0.1,0-0.2-0.1c-0.1,0-0.2,0-0.2,0c-0.3,0-0.5,0.1-0.7,0.2c-0.2,0.1-0.4,0.3-0.6,0.6V14H22.8z" />
          <path d="M28,14.1c-0.4,0-0.8-0.1-1.1-0.3s-0.5-0.5-0.6-0.9c-0.1-0.4-0.2-0.9-0.2-1.6V9.6c0-0.7,0.1-1.2,0.2-1.6
			c0.1-0.4,0.3-0.7,0.6-0.8C27.3,7,27.6,7,28,7c0.5,0,0.9,0.1,1.1,0.3c0.3,0.2,0.4,0.5,0.5,0.9c0.1,0.4,0.1,1,0.1,1.6v0.6H27v1.2
			c0,0.4,0,0.8,0.1,1.1c0.1,0.3,0.2,0.4,0.3,0.6s0.3,0.2,0.6,0.2c0.2,0,0.3,0,0.5-0.1c0.1-0.1,0.3-0.2,0.3-0.4s0.1-0.5,0.1-0.8v-0.5
			h0.9V12c0,0.6-0.1,1.1-0.4,1.5S28.7,14.1,28,14.1z M27,9.9H29V9.4c0-0.4,0-0.7-0.1-0.9c0-0.3-0.1-0.5-0.3-0.6S28.3,7.6,28,7.6
			c-0.2,0-0.4,0.1-0.6,0.2c-0.1,0.1-0.3,0.3-0.3,0.6C27.1,8.6,27,9,27,9.5V9.9z" />
          <path d="M32.6,14.1c-0.6,0-1-0.2-1.3-0.7c-0.3-0.4-0.4-1.2-0.4-2.2V9.9c0-0.6,0-1.1,0.1-1.6c0.1-0.4,0.2-0.8,0.5-1
			c0.2-0.2,0.6-0.4,1-0.4C32.8,7,33,7,33.2,7.1c0.2,0.1,0.4,0.3,0.5,0.4V4.3h0.9V14h-0.9v-0.5c-0.1,0.2-0.3,0.3-0.5,0.4
			C33,14,32.8,14.1,32.6,14.1z M32.7,13.4c0.2,0,0.4,0,0.5-0.1c0.2-0.1,0.3-0.2,0.5-0.3V8.1c-0.1-0.1-0.3-0.2-0.4-0.3
			c-0.2-0.1-0.4-0.2-0.6-0.2c-0.4,0-0.6,0.2-0.8,0.5S31.8,9,31.8,9.6v1.6c0,0.5,0,0.9,0.1,1.2c0.1,0.3,0.1,0.6,0.3,0.7
			C32.3,13.3,32.5,13.4,32.7,13.4z" />
          <path d="M40.5,14.1c-0.3,0-0.5-0.1-0.7-0.2c-0.2-0.1-0.4-0.3-0.5-0.4V14h-0.9V4.3h0.9v3.4c0.1-0.2,0.3-0.3,0.5-0.5
			C40.1,7,40.3,7,40.6,7C41,7,41.2,7,41.4,7.2c0.2,0.2,0.4,0.4,0.5,0.6c0.1,0.3,0.2,0.6,0.2,0.9s0.1,0.7,0.1,1v1.5
			c0,0.6,0,1.1-0.1,1.5c-0.1,0.4-0.3,0.8-0.5,1C41.3,14,41,14.1,40.5,14.1z M40.4,13.4c0.3,0,0.5-0.1,0.6-0.3
			c0.1-0.2,0.2-0.4,0.3-0.8s0.1-0.7,0.1-1.2V9.7c0-0.5,0-0.8-0.1-1.1S41.1,8,41,7.9c-0.1-0.2-0.3-0.2-0.6-0.2c-0.2,0-0.4,0.1-0.6,0.2
			c-0.2,0.1-0.3,0.2-0.5,0.4v4.7c0.1,0.1,0.3,0.3,0.5,0.4C40,13.4,40.2,13.4,40.4,13.4z" />
          <path d="M43.2,15.7V15c0.4,0,0.7,0,0.9-0.1c0.2-0.1,0.3-0.1,0.4-0.3c0.1-0.1,0.1-0.2,0.1-0.4c0-0.1,0-0.3-0.1-0.5
			c0-0.2-0.1-0.4-0.2-0.6L43,7.1h0.9l1.2,5.9l1.2-5.9h0.9l-1.7,7.4c-0.1,0.3-0.2,0.5-0.3,0.7c-0.2,0.2-0.4,0.3-0.6,0.4
			c-0.3,0.1-0.6,0.1-1,0.1H43.2z" />
          <path d="M50.6,14V4.3h2.1c0.7,0,1.2,0.1,1.6,0.4c0.4,0.2,0.6,0.6,0.8,1c0.2,0.4,0.2,0.9,0.2,1.5V11
			c0,0.6-0.1,1.1-0.2,1.6s-0.4,0.8-0.8,1S53.5,14,52.8,14H50.6z M51.5,13.3h1.2c0.5,0,0.9-0.1,1.1-0.3s0.4-0.5,0.5-0.9
			s0.1-0.8,0.1-1.3V7.2c0-0.5,0-0.9-0.1-1.2s-0.2-0.6-0.5-0.8S53.2,5,52.7,5h-1.2V13.3z" />
          <path d="M56.5,15.7V15c0.4,0,0.7,0,0.9-0.1c0.2-0.1,0.3-0.1,0.4-0.3c0.1-0.1,0.1-0.2,0.1-0.4c0-0.1,0-0.3-0.1-0.5
			c0-0.2-0.1-0.4-0.2-0.6l-1.4-6.1h0.9l1.2,5.9l1.2-5.9h0.9l-1.7,7.4c-0.1,0.3-0.2,0.5-0.3,0.7s-0.4,0.3-0.6,0.4s-0.6,0.1-1,0.1H56.5
			z" />
          <path d="M61.3,14V7.1h0.9v0.7c0.2-0.2,0.5-0.4,0.8-0.6C63.2,7,63.5,7,63.8,7C64,7,64.2,7,64.4,7.1s0.3,0.3,0.4,0.5
			c0.1,0.2,0.1,0.5,0.1,0.8V14H64V8.6c0-0.4-0.1-0.6-0.2-0.8c-0.1-0.1-0.3-0.2-0.5-0.2c-0.2,0-0.4,0.1-0.6,0.2s-0.4,0.3-0.6,0.5V14
			H61.3z" />
          <path d="M67.4,14.1c-0.3,0-0.5-0.1-0.7-0.2c-0.2-0.1-0.4-0.3-0.5-0.6C66,13.1,66,12.8,66,12.6c0-0.4,0.1-0.7,0.2-0.9
			s0.3-0.5,0.5-0.7c0.2-0.2,0.5-0.4,0.9-0.6c0.4-0.2,0.8-0.4,1.3-0.6V9.3c0-0.4,0-0.8-0.1-1c-0.1-0.2-0.1-0.4-0.3-0.5
			c-0.1-0.1-0.3-0.2-0.5-0.2c-0.2,0-0.3,0-0.5,0.1c-0.1,0.1-0.3,0.2-0.3,0.4c-0.1,0.2-0.1,0.4-0.1,0.7V9l-0.9,0
			c0-0.7,0.2-1.2,0.5-1.6C66.8,7.1,67.3,7,68,7c0.6,0,1.1,0.2,1.3,0.6c0.3,0.4,0.4,1,0.4,1.7v3.4c0,0.1,0,0.3,0,0.5
			c0,0.2,0,0.4,0,0.5c0,0.2,0,0.3,0,0.4h-0.8c0-0.2-0.1-0.3-0.1-0.5c0-0.2,0-0.3-0.1-0.5c-0.1,0.3-0.3,0.5-0.5,0.7
			S67.7,14.1,67.4,14.1z M67.6,13.4c0.2,0,0.3,0,0.5-0.1c0.1-0.1,0.3-0.2,0.4-0.3s0.2-0.3,0.3-0.4v-2.2c-0.3,0.2-0.6,0.3-0.9,0.5
			c-0.2,0.1-0.4,0.3-0.6,0.4c-0.2,0.1-0.3,0.3-0.3,0.5s-0.1,0.4-0.1,0.6c0,0.4,0.1,0.6,0.2,0.8C67.2,13.3,67.4,13.4,67.6,13.4z" />
          <path d="M70.9,14V7.1h0.8v0.7c0.2-0.3,0.5-0.5,0.8-0.6c0.3-0.1,0.6-0.2,0.9-0.2c0.2,0,0.5,0.1,0.7,0.2s0.3,0.4,0.4,0.7
			c0.2-0.3,0.5-0.5,0.8-0.7c0.3-0.2,0.6-0.2,0.9-0.2c0.2,0,0.4,0,0.6,0.1s0.3,0.3,0.4,0.5c0.1,0.2,0.2,0.5,0.2,0.9V14h-0.8V8.6
			c0-0.4-0.1-0.7-0.2-0.8s-0.3-0.2-0.5-0.2c-0.2,0-0.4,0.1-0.7,0.2S74.7,8,74.5,8.3c0,0,0,0.1,0,0.1s0,0.1,0,0.1V14h-0.8V8.6
			c0-0.4-0.1-0.7-0.2-0.8c-0.1-0.1-0.3-0.2-0.5-0.2c-0.2,0-0.4,0.1-0.7,0.2c-0.2,0.1-0.4,0.3-0.6,0.5V14H70.9z" />
          <path d="M80.2,14.1c-0.6,0-1-0.2-1.3-0.5c-0.3-0.4-0.5-0.8-0.6-1.4l0.7-0.2c0,0.5,0.2,0.9,0.4,1.2
			c0.2,0.2,0.5,0.4,0.8,0.4c0.3,0,0.5-0.1,0.7-0.3c0.2-0.2,0.2-0.4,0.2-0.7c0-0.2-0.1-0.5-0.2-0.7c-0.1-0.2-0.4-0.5-0.6-0.7l-0.9-0.8
			c-0.3-0.3-0.5-0.5-0.7-0.8c-0.2-0.3-0.2-0.6-0.2-0.9c0-0.3,0.1-0.6,0.2-0.8c0.1-0.2,0.3-0.4,0.6-0.5C79.5,7,79.8,7,80.2,7
			c0.5,0,0.9,0.2,1.2,0.5c0.3,0.3,0.4,0.8,0.4,1.3L81.2,9c0-0.3-0.1-0.6-0.1-0.8s-0.2-0.4-0.3-0.5c-0.1-0.1-0.3-0.1-0.5-0.1
			c-0.3,0-0.5,0.1-0.6,0.2c-0.2,0.1-0.2,0.4-0.2,0.6c0,0.2,0,0.4,0.1,0.6c0.1,0.2,0.2,0.3,0.4,0.5l1,0.9c0.2,0.2,0.4,0.3,0.6,0.5
			c0.2,0.2,0.3,0.4,0.4,0.6c0.1,0.2,0.2,0.5,0.2,0.8c0,0.4-0.1,0.7-0.2,0.9c-0.1,0.2-0.4,0.4-0.6,0.6C80.9,14,80.6,14.1,80.2,14.1z" />
          <path d="M84.7,14.1c-0.5,0-0.8-0.1-1.1-0.3c-0.3-0.2-0.5-0.5-0.6-0.9s-0.2-0.9-0.2-1.4V9.6c0-0.6,0.1-1,0.2-1.4
			c0.1-0.4,0.3-0.7,0.6-0.9C83.9,7.1,84.3,7,84.7,7c0.5,0,0.9,0.1,1.1,0.3s0.5,0.5,0.6,0.9c0.1,0.4,0.2,0.9,0.2,1.4v1.9
			c0,0.6-0.1,1-0.2,1.4s-0.3,0.7-0.6,0.9S85.2,14.1,84.7,14.1z M84.7,13.4c0.3,0,0.5-0.1,0.7-0.2c0.1-0.2,0.2-0.4,0.3-0.7
			c0-0.3,0-0.6,0-1v-2c0-0.4,0-0.7,0-1c0-0.3-0.1-0.5-0.3-0.7c-0.1-0.2-0.4-0.2-0.7-0.2c-0.3,0-0.5,0.1-0.7,0.2
			c-0.1,0.2-0.2,0.4-0.3,0.7c0,0.3-0.1,0.6-0.1,1v2c0,0.4,0,0.7,0.1,1c0,0.3,0.1,0.5,0.3,0.7C84.2,13.4,84.4,13.4,84.7,13.4z" />
          <path d="M88.2,14V7.7h-0.9V7.1h0.9V6.3c0-0.3,0-0.6,0.1-0.9c0.1-0.3,0.2-0.5,0.4-0.6c0.2-0.2,0.5-0.2,0.8-0.2
			c0.1,0,0.2,0,0.4,0c0.1,0,0.2,0,0.3,0.1v0.6c-0.1,0-0.2,0-0.2,0c-0.1,0-0.2,0-0.2,0c-0.3,0-0.4,0.1-0.5,0.2s-0.1,0.4-0.1,0.8v0.8
			h1.1v0.6h-1.1V14H88.2z" />
          <path d="M92.7,14.1c-0.3,0-0.6-0.1-0.8-0.2s-0.3-0.3-0.4-0.5c-0.1-0.2-0.1-0.5-0.1-0.8V7.6h-0.9V7.1h0.9V4.9h0.9v2.1
			h1.2v0.6h-1.2v4.8c0,0.3,0,0.6,0.1,0.7c0.1,0.1,0.2,0.2,0.5,0.2c0.1,0,0.2,0,0.2,0s0.2,0,0.3,0V14c-0.1,0-0.2,0-0.4,0.1
			C92.9,14.1,92.8,14.1,92.7,14.1z" />
        </g>
      </svg>
    </div>
  </div>
  <svg t="1751962319817" class="icon" :style="{
    position: 'absolute',
    top: 'calc(7.5vh + 20px)',
    left: '20px',
  }" v-show="isShowTorchButton && !captureImageStore.isShowCaptureImagePage" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1172" width="25" height="25" @click="switchTorch">
    <path d="M364 295.2h295.2L724.8 144H298.4zM278.4 0h466.4v98.4H278.4zM373.6 919.2c0 59.2 45.6 104.8 104.8 104.8H544c59.2 0 104.8-45.6 104.8-104.8V341.6H373.6v577.6z m112.8-435.2c0-12.8 12.8-24.8 24.8-24.8s24.8 11.2 24.8 24.8v200c0 12.8-12.8 24-24.8 24s-24.8-11.2-24.8-24v-200z" p-id="1173" :fill="isOpenTorch ? '#fe8e14' : '#ddd'"></path>
  </svg>
  <GeneralResultBox />
  <DriverLicenseResultBox v-show="captureImageStore.isShowDlResultBox" />
  <div v-show="useCaseStore.useCaseName !== 'dl'">
    <ResultBubble v-for="(result, index) of scannerResult" :key="index" :result="result" />
  </div>
  <FocusBox v-if="isMountFocusBox && isSupportFocus" />
</template>

<style scoped lang="less">
.dbr-video-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -99999;
  background-color: #ddd;
  pointer-events: none;

  .dce-bg-loading-demo {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 40%;
    height: 40%;
    fill: #aaa;
    animation: 1s linear infinite dce-rotate;
  }

  .dce-bg-camera {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 40%;
    height: 40%;
    fill: #aaa;
  }

  .dce-video-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .dce-scanarea {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    .dce-scanlight {
      display: none;
      position: absolute;
      width: 100%;
      height: 3px;
      border-radius: 50%;
      box-shadow: rgb(254, 142, 20) 0px 0px 2vw 1px;
      background: rgb(254, 142, 20);
      animation: 3s infinite dce-scanlight;
      user-select: none;
    }
  }

  .dce-msg-poweredby {
    position: absolute;
    left: 50%;
    bottom: 10%;
    transform: translateX(-50%);
    pointer-events: none;
  }
}
</style>

<style lang="less">
@keyframes dce-rotate {
  from {
    transform: rotate(0turn);
  }

  to {
    transform: rotate(1turn);
  }
}

@keyframes dce-scanlight {
  from {
    top: 0;
  }

  to {
    top: 99%;
  }
}
</style>
