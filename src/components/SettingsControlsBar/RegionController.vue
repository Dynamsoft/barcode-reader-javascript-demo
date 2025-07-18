<script setup lang="ts">
import { useSettingsStore } from "../../stores/settings";
import { usePopoverOpenStore } from "../../stores/popoverOpen";
import { useCameraListStore } from "../../stores/cameraList";

const popoverOpenStore = usePopoverOpenStore();
const settingsStore = useSettingsStore();
const cameraListStore = useCameraListStore();

const updatePopoverStore = (e: Event) => {
  popoverOpenStore.updatePopoverStore(false, false, false);
  if(cameraListStore.isUseDemoVideo) return;
  if (e.type === "click") {
    settingsStore.updateZonalScan(!settingsStore.zonalScan);
  }
};
</script>

<template>
  <div :class="`dbr-region-controller ${cameraListStore.isUseDemoVideo ? '' : 'hover'}`" :style="{cursor: cameraListStore.isUseDemoVideo ? 'not-allowed' : 'pointer'}" @click="updatePopoverStore" @mouseenter="updatePopoverStore">
    <img
      class="dbr-zonal-icon"
      src="../../assets/image/icon-web-zonal.svg"
      v-show="settingsStore.zonalScan"
      alt="zonal"
    />
    <img
      class="dbr-zonal-icon"
      src="../../assets/image/icon-web-full-image.svg"
      v-show="!settingsStore.zonalScan"
      alt="full-image"
    />
    <label class="dbr-zonal-text-in-desktop" :style="{cursor: cameraListStore.isUseDemoVideo ? 'not-allowed' : 'pointer'}">{{ settingsStore.zonalScan ? "Zonal" : "Full Image" }} Scan</label>
    <label class="dbr-zonal-text-in-mobile" :style="{cursor: cameraListStore.isUseDemoVideo ? 'not-allowed' : 'pointer'}">{{ settingsStore.zonalScan ? "Zonal" : "Full Image" }}</label>
  </div>
</template>

<style scoped lang="less">
.dbr-region-controller {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #222222;

  .dbr-zonal-icon {
    width: 28px;
    height: 28px;

    @media (max-width: 980px) {
      width: 20px;
      height: 17px;
    }

    @media (max-height: 500px) and (max-width: 980px) {
      display: none;
    }
  }

  .dbr-zonal-text-in-desktop,
  .dbr-zonal-text-in-mobile {
    font-family: "OpenSans-Regular";
    color: #ffffff;
    font-size: 14px;
  }

  .dbr-zonal-text-in-desktop {
    margin-top: 5px;

    @media (max-width: 980px) {
      display: none;
    }
  }

  .dbr-zonal-text-in-mobile {
    transform: scale(0.7);

    @media (min-width: 980px) {
      display: none;
    }
  }

  @media (max-width: 980px) {
    width: 25%;
  }
}

.hover {
  &:hover {
    background-color: rgb(34, 34, 34);
  }
}
</style>
