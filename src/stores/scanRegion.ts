import { defineStore } from "pinia";
import { DSRect, Rect } from "dynamsoft-barcode-reader-bundle";
import { useSettingsStore } from "./settings";
import { useScanOptionsStore } from "./scanOptions";

export const useScanRegionStore = defineStore("scanRegion", {
  state: (): {
    visibleRegionInPixels: Rect | undefined
  } => ({
    visibleRegionInPixels: undefined
  }),
  actions: {
    // Computed property for the left position of the scan region
    regionLeft(): number {
      const settingsStore = useSettingsStore();
      const scanOptionsStore = useScanOptionsStore();
      // Return 0 if no visible region or zonal scan settings is disabled
      if (!settingsStore.zonalScan) return 0;

      let left = 0;

      const clientWidth = document.body.clientWidth;
      const clientHeight = document.body.clientHeight;

      if (["1D Industrial", "1D Retail"].includes(scanOptionsStore.currentScanOption.name)) {
        if (clientWidth > clientHeight) {
          left = 20;
        } else {
          left = 10;
        }
      } else if (["QR Code", "Data Matrix", "Common 2D codes", "Scan from Distance", "Any Codes"].includes(scanOptionsStore.currentScanOption.name)) {
        if (clientWidth > clientHeight) {
          left = 25;
        } else {
          left = 10;
        }
      } else {
        if (clientWidth > clientHeight) {
          left = 15;
        } else {
          left = 10;
        }
      }
      return left;
    },
    // Computed property for the top position of the scan region
    regionTop(): number {
      const settingsStore = useSettingsStore();
      const scanOptionsStore = useScanOptionsStore();
      // Return 0 if no visible region or zonal scan settings is disabled
      if (!settingsStore.zonalScan) return 0;

      let top = 0;

      const clientWidth = document.body.clientWidth;
      const clientHeight = document.body.clientHeight;

      if (["1D Industrial", "1D Retail"].includes(scanOptionsStore.currentScanOption.name)) {
        if (clientWidth > clientHeight) {
          top = 37;
        } else {
          top = 42;
        }
      } else if (["QR Code", "Data Matrix", "Common 2D codes", "Scan from Distance", "Any Codes"].includes(scanOptionsStore.currentScanOption.name)) {
        if (clientWidth > clientHeight) {
          top = 25;
        } else {
          top = 32;
        }
      } else {
        if (clientWidth > clientHeight) {
          top = 25;
        } else {
          top = 32;
        }
      }

      return top;
    },
    region(): DSRect {
      const region = {
        left: this.regionLeft(),
        right: 100 - this.regionLeft(),
        top: this.regionTop(),
        bottom: 100 - this.regionTop(),
        isMeasuredInPercentage: true,
      };
      return region;
    }
  },
  getters: {

  },
});
