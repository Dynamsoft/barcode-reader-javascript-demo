<script setup lang="ts">
import { ref, getCurrentInstance } from "vue";
import CaptureHeader from "../components/CaptureHeader.vue";
import SettingsControlsBar from "../components/SettingsControlsBar.vue";
import ScannerVideo from "../components/BarcodeScanner/ScannerVideo.vue";
import CaptureImage from "../components/BarcodeReader/CaptureImage.vue";
import { useCaptureImageStore } from "../stores/captureImage";
import { useUseCaseStore } from "../stores/useCase";
import { useSettingsStore } from "../stores/settings";
import { useBarcodeFormatStore } from "../stores/barcodeFormat";
import { templateMap } from "../util";
import {
  EnumCapturedResultItemType,
  EnumGrayscaleTransformationMode,
  OriginalImageResultItem,
} from "dynamsoft-core";
import { ParsedResultItem } from "dynamsoft-code-parser";
import { CapturedResult } from "dynamsoft-capture-vision-router";
import { _getNorImageData, _toCanvas } from "dynamsoft-utility";
import { ParsedDataFailed } from "../types";

const _window = window as any;

const currentTemplate = ref("ReadSingleBarcode");
const captureImageStore = useCaptureImageStore();
const settingsStore = useSettingsStore();
const useCaseStore = useUseCaseStore();
const barcodeFormatStore = useBarcodeFormatStore();
const currentInstance: any = getCurrentInstance();

const changeTemplate = (templateName: string) => {
  currentTemplate.value = templateName;
};

const reDecode = async () => {
  let captureResult: CapturedResult | null = null;
  let parsedData: ParsedResultItem | ParsedDataFailed | {} = {};
  try {
    captureResult = await _window.cvRouter.capture(
      captureImageStore.currentSelectedImageFile,
      currentTemplate.value
    );
    if (captureResult?.barcodeResultItems && useCaseStore.useCaseName === "dl") {
      try {
        parsedData = await _window.parser.parse(
          captureResult.barcodeResultItems[0].bytes
        );
      } catch (ex: any) {
        (parsedData as ParsedDataFailed).exception = true;
        (parsedData as ParsedDataFailed).message = ex.message || ex;
        (parsedData as ParsedDataFailed).text = captureResult.barcodeResultItems[0].text;
      }
      if ((parsedData as ParsedDataFailed).exception) {
        captureImageStore.updateDLJsonString(JSON.stringify(parsedData));
      } else {
        captureImageStore.updateDLJsonString((parsedData as ParsedResultItem).jsonString);
      }
    }
    captureImageStore.updateCaptureResult(captureResult?.barcodeResultItems);
  } catch (ex: any) {
    captureImageStore.updateCaptureResult();
    throw ex;
  } finally {
    if (
      ["vin", "dl"].includes(useCaseStore.useCaseName) &&
      settingsStore.isCollectImg &&
      (captureResult && captureResult.items.length <= 1 || (parsedData as ParsedDataFailed).exception)
    ) {
      const originalImage = captureResult?.items.find(
        (item) => item.type === 1
      ) as OriginalImageResultItem;
      if (!originalImage) return;
    }
  }
};

const udpateSettings = async () => {
  try {
    if (
      !_window.cameraEnhancer ||
      (!_window.cameraEnhancer.isOpen() && !captureImageStore.isShowCaptureImagePage)
    )
      return;
    captureImageStore.updateCaptureResult();
    captureImageStore.updateDLJsonString();
    captureImageStore.updateDecodingState(true);
    const isShowCaptureImagePage = captureImageStore.isShowCaptureImagePage;
    let message = isShowCaptureImagePage ? "Setting and reDecoding..." : "Settings...";
    currentInstance.proxy.$message.loading({
      content: message,
      key: "updateSettings",
    });
    _window.cvRouter.stopCapturing();
    if (useCaseStore.isGeneral) {
      changeTemplate(templateMap[settingsStore.scanMode]);
    }
    const settings = await _window.cvRouter.getSimplifiedSettings(currentTemplate.value);
    settings.capturedResultItemTypes |= EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE;
    if (useCaseStore.isGeneral) {
      settings.barcodeSettings.expectedBarcodesCount =
        settingsStore.singleOrMulti === "single" ? 1 : 512;
    }
    settings.barcodeSettings.grayscaleTransformationModes[0] =
      settingsStore.colourMode === "Inverted"
        ? EnumGrayscaleTransformationMode.GTM_INVERTED
        : EnumGrayscaleTransformationMode.GTM_ORIGINAL;

    await _window.cvRouter.updateSettings(currentTemplate.value, settings);
    await barcodeFormatStore.updateBarcodeFormat(
      currentTemplate.value,
      captureImageStore.isShowCaptureImagePage
    );
    if (!captureImageStore.isShowCaptureImagePage) {
      await _window.cvRouter.startCapturing(currentTemplate.value);
    } else {
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
</script>

<template>
  <CaptureHeader :currentTemplate="currentTemplate" />
  <ScannerVideo :currentTemplate="currentTemplate" :changeTemplate="changeTemplate" :udpateSettings="udpateSettings" />
  <CaptureImage v-show="captureImageStore.isShowCaptureImagePage" :currentTemplate="currentTemplate" />
  <SettingsControlsBar :currentTemplate="currentTemplate" :changeTemplate="changeTemplate" :udpateSettings="udpateSettings" />
</template>

<style scoped lang="less"></style>
