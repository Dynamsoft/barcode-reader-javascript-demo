<script setup lang="ts">
import { onUnmounted } from "vue";
import CaptureHeader from "../components/CaptureHeader.vue";
import SettingsControlsBar from "../components/SettingsControlsBar.vue";
import ScannerVideo from "../components/BarcodeScanner/ScannerVideo.vue";
import CaptureImage from "../components/BarcodeReader/CaptureImage.vue";
import NoCameraPage from "../components/NoCameraPage.vue";
import templates from "../templates";
import { useCaptureImageStore } from "../stores/captureImage";
import { useScanOptionsStore } from "../stores/scanOptions";
import { useSettingsStore } from "../stores/settings";
import { useBarcodeFormatStore } from "../stores/barcodeFormat";
import { templateUrl } from "../util";
import {
  _getNorImageData,
  _toCanvas,
  EnumGrayscaleTransformationMode,
  CapturedResult,
  CaptureVisionRouter,
  ParsedResult,
  ParsedResultItem,
  CodeParser,
  EnumBarcodeFormat
} from "dynamsoft-barcode-reader-bundle";
import { useCameraListStore } from "../stores/cameraList";
import { useResultCountStore } from "../stores/resultCount";
import { message } from "ant-design-vue";

const _window = window as any;

const captureImageStore = useCaptureImageStore();
const settingsStore = useSettingsStore();
const scanOptionsStore = useScanOptionsStore();
const barcodeFormatStore = useBarcodeFormatStore();
const cameraListStore = useCameraListStore();
const resultCountStore = useResultCountStore();

onUnmounted(() => {
  captureImageStore.captureImagePageVisible(false);
})

const reDecode = async () => {
  let captureResult: CapturedResult | null = null;
  try {
    const cvRouter = _window.cvRouter as CaptureVisionRouter;
    captureResult = await cvRouter.capture(captureImageStore.currentSelectedImageFile!, scanOptionsStore.currentScanOption.templateNameForReadRate);

    // Parse Driver License barcodes
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
      if (scanOptionsStore.currentScanOption.name === "Drivers License (PDF417)") {
        captureImageStore.updateDLJsonString(parsedResult);
      } else if (scanOptionsStore.currentScanOption.name === "VIN") {
        captureImageStore.updateVINJsonString(parsedResult);
      }
    }
    captureImageStore.updateCaptureResult(captureResult.decodedBarcodesResult?.barcodeResultItems);
  } catch (ex: any) {
    captureImageStore.updateCaptureResult();
    throw ex;
  }
};

const updateSimplifiedSettings = async (templateName: string) => {
  const settings = await _window.cvRouter.getSimplifiedSettings(templateName);
  settings.outputOriginalImage = true;

  settings.barcodeSettings.expectedBarcodesCount = settingsStore.singleOrMulti === "Single" ? 1 : 999;

  settings.barcodeSettings.grayscaleTransformationModes = Array(8).fill(-1);;
  if (settingsStore.colourMode === "Inverted") {
    settings.barcodeSettings.grayscaleTransformationModes[0] = EnumGrayscaleTransformationMode.GTM_INVERTED;
  } else if (settingsStore.colourMode === "Normal") {
    settings.barcodeSettings.grayscaleTransformationModes[0] = EnumGrayscaleTransformationMode.GTM_ORIGINAL;
  } else {
    settings.barcodeSettings.grayscaleTransformationModes[0] = EnumGrayscaleTransformationMode.GTM_ORIGINAL;
    settings.barcodeSettings.grayscaleTransformationModes[1] = EnumGrayscaleTransformationMode.GTM_INVERTED;
  }

  await _window.cvRouter.updateSettings(templateName, settings);
  if (barcodeFormatStore.isFormatChangeEnabled) {
    await barcodeFormatStore.updateBarcodeFormat(templateName);
  }
}

const updateSettings = async () => {
  try {
    if (templateUrl) {
      await _window.cvRouter.initSettings(templateUrl);
      const settings = await _window.cvRouter.outputSettings("*");
      const templateName = settings.CaptureVisionTemplates[0].Name;
      await _window.cvRouter.startCapturing(templateName);
      scanOptionsStore.updateScanOption({ name: "User Defined", templateName, checked: true, urlName: "user-defined", templateNameForReadRate: templateName });
      return;
    }
    captureImageStore.updateCaptureResult();
    captureImageStore.updateScannerCaptureResult();
    captureImageStore.updateDLJsonString();
    captureImageStore.updateDecodingState(true);
    captureImageStore.updateDlResultBoxVisibility(false);
    _window.cameraView?.clearAllInnerDrawingItems();
    resultCountStore.$state.clear();

    const isShowCaptureImagePage = captureImageStore.isShowCaptureImagePage;
    const content = isShowCaptureImagePage ? "Setting and reDecoding..." : "Settings...";
    message.loading({
      content,
      key: "updateSettings",
    });
    _window.cvRouter.stopCapturing();

    const currentTplName = scanOptionsStore.currentScanOption.templateName;
    const currentTplNameForReadRate = scanOptionsStore.currentScanOption.templateNameForReadRate;
    await updateSimplifiedSettings(currentTplName);
    await updateSimplifiedSettings(currentTplNameForReadRate);

    if (!captureImageStore.isShowCaptureImagePage) {
      await _window.cvRouter.startCapturing(currentTplName);
      _window.cameraView?.setScanLaserVisible(settingsStore.zonalScan);
      _window.cameraView?.setScanRegionMaskVisible(true);
    } else {
      await reDecode();
    }

    message.success({
      content: "Settings Updated",
      key: "updateSettings",
      duration: 1
    });
  } catch (ex: any) {
    message.error({
      content: ex.message || ex,
      key: "updateSettings",
      duration: 1
    });
  } finally {
    captureImageStore.updateDecodingState(false);
  }
};

const setUseCaseBarcodeFormat = async () => {
  barcodeFormatStore.updateAllBarcodeFormatState(false);
  if (barcodeFormatStore.isFormatChangeEnabled) {
    const tplName = templates[scanOptionsStore.currentScanOption.templateName as keyof typeof templates];
    const defaultBarcodes = tplName.BarcodeReaderTaskSettingOptions[0].BarcodeFormatIds.map((format => format.trim())) as Array<keyof typeof EnumBarcodeFormat>;
    if (defaultBarcodes.includes("BF_ALL")) {
      barcodeFormatStore.updateAllBarcodeFormatState(true);
    } else if (defaultBarcodes.includes("BF_DEFAULT")) {
      barcodeFormatStore.updateDefaultBarcodeFormatState(true);
    } else {
      for (let formatString of defaultBarcodes) {
        barcodeFormatStore.findFormatAndUpdateState(formatString, true);
      }
    }
  }
};
</script>

<template>
  <CaptureHeader />
  <ScannerVideo :setUseCaseBarcodeFormat="setUseCaseBarcodeFormat" v-if="cameraListStore.hasCamera" />
  <NoCameraPage v-else></NoCameraPage>
  <CaptureImage v-show="captureImageStore.isShowCaptureImagePage" />
  <SettingsControlsBar :updateSettings="updateSettings" />
</template>

<style scoped lang="less"></style>
