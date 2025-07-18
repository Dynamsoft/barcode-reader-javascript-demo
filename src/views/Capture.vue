<script setup lang="ts">
import { getCurrentInstance, watch } from "vue";
import CaptureHeader from "../components/CaptureHeader.vue";
import SettingsControlsBar from "../components/SettingsControlsBar.vue";
import ScannerVideo from "../components/BarcodeScanner/ScannerVideo.vue";
import CaptureImage from "../components/BarcodeReader/CaptureImage.vue";
import NoCameraPage from "../components/NoCameraPage.vue";
import { useCaptureImageStore } from "../stores/captureImage";
import { AllowNameSet, useUseCaseStore } from "../stores/useCase";
import { useSettingsStore } from "../stores/settings";
import { BarcodeCategory, useBarcodeFormatStore } from "../stores/barcodeFormat";
import { templateMap, urlMap, useCaseBarcodeFormatMap } from "../util";
import {
  _getNorImageData,
  _toCanvas,
  EnumCapturedResultItemType,
  EnumGrayscaleTransformationMode,
  PlayCallbackInfo,
  ParsedResultItem,
  CapturedResult,
  CaptureVisionRouter
} from "dynamsoft-barcode-reader-bundle";
import { ParsedDataFailed } from "../types";
import { useCameraListStore } from "../stores/cameraList";
import { useScanRegionStore } from "../stores/scanRegion";
import { useResultCountStore } from "../stores/resultCount";
import { useRouter } from "vue-router";
import { EnumResolution, ResolutionMap } from "../assets/enum/Resolution";

const _window = window as any;

const router = useRouter();
const captureImageStore = useCaptureImageStore();
const settingsStore = useSettingsStore();
const useCaseStore = useUseCaseStore();
const barcodeFormatStore = useBarcodeFormatStore();
const cameraListStore = useCameraListStore();
const resultCountStore = useResultCountStore();
const scanRegionStore = useScanRegionStore();
const currentInstance: any = getCurrentInstance();

const reDecode = async () => {
  let captureResult: CapturedResult | null = null;
  let parsedData: ParsedResultItem | ParsedDataFailed | {} = {};
  try {
    const cvRouter = _window.cvRouter as CaptureVisionRouter;
    captureResult = await cvRouter.capture(captureImageStore.currentSelectedImageFile!, captureImageStore.currentTemplate);
    if (captureResult.decodedBarcodesResult?.barcodeResultItems && useCaseStore.useCaseName === "dl") {
      try {
        parsedData = await _window.parser.parse(captureResult.decodedBarcodesResult.barcodeResultItems[0].bytes);
      } catch (ex: any) {
        (parsedData as ParsedDataFailed).exception = true;
        (parsedData as ParsedDataFailed).message = ex.message || ex;
        (parsedData as ParsedDataFailed).text = captureResult.decodedBarcodesResult.barcodeResultItems[0].text;
      }
      if ((parsedData as ParsedDataFailed).exception) {
        captureImageStore.updateDLJsonString(JSON.stringify(parsedData));
      } else {
        captureImageStore.updateDLJsonString((parsedData as ParsedResultItem).jsonString);
      }
    }
    captureImageStore.updateCaptureResult(captureResult.decodedBarcodesResult?.barcodeResultItems);
  } catch (ex: any) {
    captureImageStore.updateCaptureResult();
    throw ex;
  }
};

const udpateSettings = async () => {
  try {
    const isInNoCameraPage = !captureImageStore.isShowCaptureImagePage && !cameraListStore.hasCamera;
    const isInScannerPageLoading = cameraListStore.isLoading && !captureImageStore.isShowCaptureImagePage && cameraListStore.hasCamera;
    const isInScannerPage = !cameraListStore.isLoading && !captureImageStore.isShowCaptureImagePage && cameraListStore.hasCamera;
    if (isInNoCameraPage || isInScannerPageLoading) return;
    captureImageStore.updateCaptureResult();
    captureImageStore.updateDLJsonString();
    captureImageStore.updateDecodingState(true);
    settingsStore.updateZonalScan(!cameraListStore.isUseDemoVideo && !(useCaseStore.useCaseName === "dl"));
    const isShowCaptureImagePage = captureImageStore.isShowCaptureImagePage;
    const message = isShowCaptureImagePage ? "Setting and reDecoding..." : "Settings...";
    currentInstance.proxy.$message.loading({
      content: message,
      key: "updateSettings",
    });
    _window.cvRouter.stopCapturing();
    if (useCaseStore.isGeneral) {
      captureImageStore.updateCurrentTemplate(templateMap[settingsStore.scanMode]);
    } else {
      const settings = await _window.cvRouter.outputSettings("*");
      const dpmSettings = settings.BarcodeReaderTaskSettingOptions.filter((setting: any) => {
        return setting.Name === "task-read-barcodes-dense";
      })[0];
      if (useCaseStore.useCaseName === "dpm") {
        dpmSettings.DPMCodeReadingModes = [{
          Mode: "DPMCRM_GENERAL"
        }];
      } else {
        dpmSettings.DPMCodeReadingModes = [{
          Mode: "DPMCRM_SKIP"
        }];
      }
      await _window.cvRouter.initSettings(settings);

      captureImageStore.updateCurrentTemplate("ReadDenseBarcodes");
    }
    const settings = await _window.cvRouter.getSimplifiedSettings(captureImageStore.currentTemplate);
    settings.capturedResultItemTypes |= EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE;
    if (useCaseStore.isGeneral) {
      settings.barcodeSettings.expectedBarcodesCount = settingsStore.singleOrMulti === "Single" ? 1 : 512;
    }

    settings.barcodeSettings.grayscaleTransformationModes = [];
    if(settingsStore.colourMode === "Inverted") {
      settings.barcodeSettings.grayscaleTransformationModes[0] = EnumGrayscaleTransformationMode.GTM_INVERTED;
    } else if(settingsStore.colourMode === "Normal") {
      settings.barcodeSettings.grayscaleTransformationModes[0] = EnumGrayscaleTransformationMode.GTM_ORIGINAL;
    } else {
      settings.barcodeSettings.grayscaleTransformationModes[0] = EnumGrayscaleTransformationMode.GTM_ORIGINAL;
      settings.barcodeSettings.grayscaleTransformationModes[1] = EnumGrayscaleTransformationMode.GTM_INVERTED;
    }

    await _window.cvRouter.updateSettings(captureImageStore.currentTemplate, settings);
    await barcodeFormatStore.updateBarcodeFormat(captureImageStore.currentTemplate, captureImageStore.isShowCaptureImagePage);
    if (isInScannerPage) {
      await _window.cameraEnhancer.open();
      await _window.cvRouter.startCapturing(captureImageStore.currentTemplate);
    } else if (captureImageStore.isShowCaptureImagePage) {
      await reDecode();
    }
    
    currentInstance.proxy.$message.success({
      content: "Settings Updated",
      key: "updateSettings",
    });
  } catch (ex: any) {
    currentInstance.proxy.$message.error({
      content: ex.message || ex,
      key: "updateSettings",
    });
  } finally {
    captureImageStore.updateDecodingState(false);
  }
};

const setUseCaseBarcodeFormat = async (isBeforeMount: boolean, oldUseCase?: AllowNameSet) => {
  if (isBeforeMount || oldUseCase) {
    for (let formatType in barcodeFormatStore.$state) {
      const _formatType = formatType as BarcodeCategory;
      for (let format in barcodeFormatStore.$state[_formatType]) {
        barcodeFormatStore.$state[_formatType][format].state = false;
      }
    }
    for (let format of useCaseBarcodeFormatMap[useCaseStore.useCaseName]) {
      barcodeFormatStore.findFormatAndUpdateState(format, true);
    }
  }
};

const eventOnUseCaseChange = async (oldUseCase?: AllowNameSet) => {
  if (cameraListStore.isLoading && !captureImageStore.isShowCaptureImagePage && cameraListStore.hasCamera) return;
  resultCountStore.$state.clear();
  captureImageStore.updateDlResultBoxVisibility(false);
  if (cameraListStore.hasCamera) {
    _window.cameraView?.setScanLaserVisible(settingsStore.zonalScan);
    if (!captureImageStore.isShowCaptureImagePage) {
      _window.cvRouter?.stopCapturing();
      if (!useCaseStore.isGeneral) {
        if (
          ["vin", " dl"].includes(useCaseStore.useCaseName) &&
          cameraListStore.currentResolution !== EnumResolution.FULL_HD
        ) {
          const _currentResolution: PlayCallbackInfo = await _window.cameraEnhancer?.setResolution(ResolutionMap[EnumResolution.FULL_HD]);
          cameraListStore.updateCameraResolution(_currentResolution);
        }
      } else {
        captureImageStore.updateCurrentTemplate(templateMap[settingsStore.scanMode]);
      }
      if (!cameraListStore.isUseDemoVideo) {
        scanRegionStore.updateVisibleRegionInPixels(_window.cameraView?.getVisibleRegionOfVideo({ inPixels: true }));
        _window.cameraEnhancer?.setScanRegion(scanRegionStore.region);
      }
    }
  }
  await setUseCaseBarcodeFormat(false, oldUseCase);
  await barcodeFormatStore.updateBarcodeFormat(captureImageStore.currentTemplate, captureImageStore.isShowCaptureImagePage);
};

watch(
  () => useCaseStore.useCaseName,
  async (_: AllowNameSet, oldUseCase: AllowNameSet) => {
    await router.push("/" + urlMap[useCaseStore.useCaseName] + location.search);
    await eventOnUseCaseChange(oldUseCase);
  }
);
</script>

<template>
  <CaptureHeader />
  <ScannerVideo :udpateSettings="udpateSettings" :eventOnUseCaseChange="eventOnUseCaseChange" :setUseCaseBarcodeFormat="setUseCaseBarcodeFormat" v-if="cameraListStore.hasCamera" />
  <NoCameraPage :eventOnUseCaseChange="eventOnUseCaseChange" v-else></NoCameraPage>
  <CaptureImage v-show="captureImageStore.isShowCaptureImagePage" />
  <SettingsControlsBar :udpateSettings="udpateSettings" />
</template>

<style scoped lang="less"></style>
