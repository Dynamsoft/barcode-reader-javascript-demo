<script setup lang="ts">
import { watch } from "vue";
import ModeSelector from "./SettingsControlsBar/UseCaseSelector.vue";
import FormatSelector from "./SettingsControlsBar/FormatSelector.vue";
import RegionController from "./SettingsControlsBar/RegionController.vue";
import SettingsController from "./SettingsControlsBar/SettingsController.vue";
import { useSettingsStore } from "../stores/settings";
import { useBarcodeFormatStore } from "../stores/barcodeFormat";

const props = defineProps<{
  currentTemplate: string;
  changeTemplate: (templateName: string) => void;
  udpateSettings: () => Promise<void>;
}>();

const settingsStore = useSettingsStore();
const barcodeFormatStore = useBarcodeFormatStore();

watch(
  [
    () => settingsStore.singleOrMulti,
    () => settingsStore.scanMode,
    () => settingsStore.colourMode,
    () => barcodeFormatStore.$state,
  ],
  async () => {
    await props.udpateSettings();
  },
  { deep: true }
);
</script>

<template>
  <div class="dbr-scanner-controls-bar">
    <ModeSelector />
    <FormatSelector />
    <RegionController />
    <SettingsController :currentTemplate="currentTemplate" />
  </div>
</template>

<style scoped lang="less">
.dbr-scanner-controls-bar {
  position: absolute;
  top: 19.5vh;
  left: 3.2vw;
  width: 140px;
  height: 40vh;
  min-width: 140px;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  background-color: #000000;

  @media (max-width: 980px) {
    width: 100%;
    height: 9vh;
    top: unset;
    left: unset;
    min-height: unset;
    bottom: 0;
    flex-direction: row;
  }
}
</style>
