<script setup lang="ts">
import { watch } from "vue";
import FormatSelector from "./SettingsControlsBar/FormatSelector.vue";
import RegionController from "./SettingsControlsBar/RegionController.vue";
import SettingsController from "./SettingsControlsBar/SettingsController.vue";
import { useSettingsStore } from "../stores/settings";
import { useBarcodeFormatStore } from "../stores/barcodeFormat";

const props = defineProps<{
  updateSettings: () => Promise<void>;
}>();

const settingsStore = useSettingsStore();
const barcodeFormatStore = useBarcodeFormatStore();

watch(
  [
    () => settingsStore.singleOrMulti,
    () => settingsStore.colourMode,
    () => barcodeFormatStore.$state,
  ],
  async () => {
    await props.updateSettings();
  },
  { deep: true }
);
</script>

<template>
  <div class="dbr-scanner-controls-bar">
    <FormatSelector />
    <RegionController />
    <SettingsController />
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
  max-height: 120px;
  display: flex;
  flex-direction: column;
  background-color: #000000;

  @media (max-width: 979.5px) {
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
