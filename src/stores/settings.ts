import { defineStore } from "pinia";

type SingleOrMulti = "single" | "multiple";
type ScanMode = "Best Speed" | "Balance" | "Best Coverage";
type ColourMode = "Inverted" | "Normal";

export const useSettingsStore = defineStore("settings", {
  state: (): {
    playSound: boolean;
    zonalScan: boolean;
    singleOrMulti: SingleOrMulti;
    scanMode: ScanMode;
    colourMode: ColourMode;
    autoZoom: boolean;
    shwoSettingCodesArea: boolean;
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
      singleOrMulti: "single",
      scanMode: "Best Speed",
      colourMode: "Normal",
      autoZoom: false,
      shwoSettingCodesArea: false,
      isCollectImg,
      isLocalized: false,
    };
  },
  actions: {
    updateSingleOrMulti(value: SingleOrMulti) {
      this.$state.singleOrMulti = value;
    },
    updateScanMode(value: ScanMode) {
      this.$state.scanMode = value;
    },
    updateColourMode(value: ColourMode) {
      this.$state.colourMode = value;
    },
    updateAutoZoom(value: boolean) {
      this.$state.autoZoom = value;
    },
    updatePlaySound(value: boolean) {
      this.$state.playSound = value;
    },
    updateZonalScan(value: boolean) {
      this.$state.zonalScan = value;
    },
    updateSettingCodesAreaOpen(value: boolean) {
      this.$state.shwoSettingCodesArea = value;
    },
    updateIsCollectImg(_: boolean) {
      this.$state.isCollectImg = false;
    },
    updateIsLocalized(value: boolean) {
      this.$state.isLocalized = value;
    },
  },
});
