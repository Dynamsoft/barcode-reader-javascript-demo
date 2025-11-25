import { defineStore } from "pinia";

export type SingleOrMulti = "Single" | "Multiple";
export type ScanMode = "Speed" | "Balance" | "Coverage";
export type ColourMode = "Inverted" | "Normal" | "Both";

export const useSettingsStore = defineStore("settings", {
  state: (): {
    playSound: boolean;
    zonalScan: boolean;
    singleOrMulti: SingleOrMulti;
    colourMode: ColourMode;
    autoZoom: boolean;
    resultTooltip: boolean;
    isCollectImg: boolean;
    isLocalized: boolean;
  } => {
    const authInfo = localStorage.getItem("isAllowCollectImage");
    let isCollectImg: boolean = false;
    if (authInfo) {
      const parsedAuthInfo = JSON.parse(authInfo);
      isCollectImg = parsedAuthInfo.isAgree;
    }
    return {
      playSound: false,
      zonalScan: true,
      autoZoom: false,
      resultTooltip: false,
      isLocalized: false,
      singleOrMulti: "Single",
      colourMode: "Both",
      isCollectImg,
    };
  },
  actions: {
    updateSingleOrMulti(value: SingleOrMulti) {
      this.$state.singleOrMulti = value;
    },
    updateColourMode(value: ColourMode) {
      this.$state.colourMode = value;
    },
    updateAutoZoom(value: boolean) {
      this.$state.autoZoom = value;
    },
    updateResultTooltip(value: boolean) {
      this.$state.resultTooltip = value;
    },
    updatePlaySound(value: boolean) {
      this.$state.playSound = value;
    },
    updateZonalScan(value: boolean) {
      this.$state.zonalScan = value;
    },
    updateIsCollectImg(_: boolean) {
      this.$state.isCollectImg = false;
    },
    updateIsLocalized(value: boolean) {
      this.$state.isLocalized = value;
    }
  },
});
