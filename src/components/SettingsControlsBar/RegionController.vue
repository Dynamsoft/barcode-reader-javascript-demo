<script setup lang="ts">
import { useSettingsStore } from "../../stores/settings";
import { usePopoverOpenStore } from "../../stores/popoverOpen";
import { computed } from "vue";

const popoverOpenStore = usePopoverOpenStore();
const settingsStore = useSettingsStore();

const regionText = computed(() => {
  return settingsStore.zonalScan ? "Zonal" : "Full Image";
})

const updatePopoverStore = (e: Event) => {
  popoverOpenStore.updatePopoverStore(false, false);
  if (e.type === "click") {
    settingsStore.updateZonalScan(!settingsStore.zonalScan);
  }
};
</script>

<template>
  <div class="dbr-region-controller hover" @click="updatePopoverStore" @mouseenter="updatePopoverStore">
    <svg class="dbr-zonal-icon" v-show="settingsStore.zonalScan" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 28 18.9" style="enable-background:new 0 0 28 18.9;" xml:space="preserve">
      <g>
        <path fill="#FEA543" d="M25.8,0h-6.8c-0.6,0-1,0.4-1,1s0.4,1,1,1h6.8C25.9,2,26,2.1,26,2.1v4.5c0,0.6,0.4,1,1,1s1-0.4,1-1V2.1C28,1,27,0,25.8,0z" />
        <path fill="#FEA543" d="M1,7.6c0.6,0,1-0.4,1-1V2.1C2,2.1,2.1,2,2.1,2h6.8c0.6,0,1-0.4,1-1s-0.4-1-1-1H2.1C1,0,0,1,0,2.1v4.5C0,7.2,0.4,7.6,1,7.6z" />
        <path fill="#FEA543" d="M27,11.3c-0.6,0-1,0.4-1,1v4.5c0,0.1-0.1,0.1-0.1,0.1h-6.8c-0.6,0-1,0.4-1,1s0.4,1,1,1h6.8c1.2,0,2.1-1,2.1-2.1v-4.5C28,11.7,27.5,11.3,27,11.3z" />
        <path fill="#FEA543" d="M8.9,16.9H2.1c-0.1,0-0.1-0.1-0.1-0.1v-4.5c0-0.6-0.4-1-1-1s-1,0.4-1,1v4.5c0,1.2,1,2.1,2.1,2.1h6.8c0.6,0,1-0.4,1-1S9.5,16.9,8.9,16.9z" />
        <path fill="#FEA543" d="M4.5,6.5v5.9c0,1.1,0.9,2,2,2h14.9c1.1,0,2-0.9,2-2V6.5c0-1.1-0.9-2-2-2H6.5C5.4,4.5,4.5,5.4,4.5,6.5zM21.5,12.4H6.5l0-5.9h0h14.9V12.4z" />
      </g>
    </svg>
    <svg class="dbr-zonal-icon" v-show="!settingsStore.zonalScan" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 29.2 29.2" style="enable-background:new 0 0 29.2 29.2;" xml:space="preserve">
      <g>
        <path fill="#FEA543" d="M21.8,21.5c0.2,0.5,0.8,0.8,1.3,0.6c0.5-0.2,0.8-0.8,0.6-1.3l-3.1-8.4c-0.1-0.4-0.4-0.7-0.8-0.9c-0.4-0.2-0.8-0.2-1.2,0c-0.3,0.1-0.6,0.3-0.8,0.6l-3.3,5l-1.6-1.9c-0.3-0.3-0.7-0.5-1.1-0.6c-0.4,0-0.8,0.1-1.2,0.4c-0.1,0.1-0.3,0.3-0.3,0.4l-3.1,5.2C6.9,21.1,7,21.7,7.5,22c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5l2.8-4.7l2.1,2.5c0.2,0.2,0.5,0.4,0.8,0.4c0.3,0,0.6-0.2,0.8-0.4l3.6-5.5L21.8,21.5z" />
        <path fill="#FEA543" d="M7,8.7c0,1.5,1.2,2.8,2.8,2.8s2.8-1.2,2.8-2.8s-1.2-2.8-2.8-2.8S7,7.2,7,8.7z M10.5,8.7c0,0.4-0.3,0.8-0.8,0.8S9,9.1,9,8.7s0.3-0.8,0.8-0.8S10.5,8.3,10.5,8.7z" />
        <path fill="#FEA543" d="M27,0h-7.1c-0.6,0-1,0.4-1,1s0.4,1,1,1H27c0.1,0,0.2,0.1,0.2,0.2v4.7c0,0.6,0.4,1,1,1s1-0.4,1-1V2.2C29.2,1,28.2,0,27,0z" />
        <path fill="#FEA543" d="M1,7.9c0.6,0,1-0.4,1-1V2.2C2,2.1,2.1,2,2.2,2h7.1c0.6,0,1-0.4,1-1s-0.4-1-1-1H2.2C1,0,0,1,0,2.2v4.7C0,7.5,0.4,7.9,1,7.9z" />
        <path fill="#FEA543" d="M28.2,21.3c-0.6,0-1,0.4-1,1V27c0,0.1-0.1,0.2-0.2,0.2h-7.1c-0.6,0-1,0.4-1,1s0.4,1,1,1H27c1.2,0,2.2-1,2.2-2.2v-4.7C29.2,21.7,28.8,21.3,28.2,21.3z" />
        <path fill="#FEA543" d="M9.3,27.2H2.2C2.1,27.2,2,27.1,2,27v-4.7c0-0.6-0.4-1-1-1s-1,0.4-1,1V27c0,1.2,1,2.2,2.2,2.2h7.1c0.6,0,1-0.4,1-1S9.8,27.2,9.3,27.2z" />
      </g>
    </svg>

    <label class="dbr-zonal-text-in-desktop">{{ regionText }} Scan</label>
    <label class="dbr-zonal-text-in-mobile">{{ regionText }}</label>
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
  cursor: pointer;

  .dbr-zonal-icon {
    width: 28px;
    height: 28px;

    @media (max-width: 979.5px) {
      width: 20px;
      height: 17px;
    }

    @media (max-height: 500px) and (max-width: 979.5px) {
      display: none;
    }
  }

  .dbr-zonal-text-in-desktop,
  .dbr-zonal-text-in-mobile {
    font-family: "OpenSans-Regular";
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;
  }

  .dbr-zonal-text-in-desktop {
    margin-top: 5px;

    @media (max-width: 979.5px) {
      display: none;
    }
  }

  .dbr-zonal-text-in-mobile {
    transform: scale(0.7);

    @media (min-width: 980px) {
      display: none;
    }
  }

  @media (max-width: 979.5px) {
    flex: 1;
  }
}

.hover {
  &:hover {
    background-color: rgb(34, 34, 34);
  }
}
</style>
