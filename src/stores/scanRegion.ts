import { defineStore } from "pinia";
import { DSRect, Rect } from "dynamsoft-barcode-reader-bundle";
import { useSettingsStore } from "./settings";
import { useUseCaseStore } from "./useCase";

const _window = window as any;

export const useScanRegionStore = defineStore("scanRegion", {
  state: (): {
    visibleRegionInPixels: Rect | undefined
  } => ({
    visibleRegionInPixels: undefined
  }),
  actions: {
    updateVisibleRegionInPixels(value: Rect | undefined) {
      this.visibleRegionInPixels = value;
    },
  },
  getters: {
    // Computed property to determine the length of the scan region edge
    regionEdgeLength(state): number {
      // Return 0 if no visible region or camera enhancer is not open
      if (!state.visibleRegionInPixels || !_window.cameraEnhancer || !_window.cameraEnhancer.isOpen()) {
        return 0
      };

      const visibleRegionWidth = state.visibleRegionInPixels.width;
      const visibleRegionHeight = state.visibleRegionInPixels.height;

      // Calculate the length of the scan region edge as 40% of the smallest dimension
      let _regionEdgeLength = 0.4 * Math.min(visibleRegionWidth, visibleRegionHeight);

      return Math.round(_regionEdgeLength);
    },
    // Computed property for the left position of the scan region
    regionLeft(state): number {
      const settingsStore = useSettingsStore();
      const useCaseStore = useUseCaseStore();
      // Return 0 if no visible region or zonal scan settings is disabled
      if (!state.visibleRegionInPixels || !settingsStore.zonalScan || !_window.cameraEnhancer || !_window.cameraEnhancer.isOpen()) return 0;

      let left = 0;

      const clientWidth = document.body.clientWidth;
      const clientHeight = document.body.clientHeight;

      if (useCaseStore.isGeneral || useCaseStore.useCaseName === "dpm") {
        if (clientWidth > clientHeight) {
          left = 25;
        } else {
          left = 10;
        }
      } else if (useCaseStore.useCaseName === "vin") {
        if (clientWidth > clientHeight) {
          left = 20;
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
    regionTop(state): number {
      const settingsStore = useSettingsStore();
      const useCaseStore = useUseCaseStore();
      // Return 0 if no visible region or zonal scan settings is disabled
      if (!state.visibleRegionInPixels || !settingsStore.zonalScan || !_window.cameraEnhancer || !_window.cameraEnhancer.isOpen()) return 0;

      let top = 0;

      const clientWidth = document.body.clientWidth;
      const clientHeight = document.body.clientHeight;

      if (useCaseStore.isGeneral || useCaseStore.useCaseName === "dpm") {
        if (clientWidth > clientHeight) {
          top = 20;
        } else {
          top = 26;
        }
      } else if (useCaseStore.useCaseName === "vin") {
        if (clientWidth > clientHeight) {
          top = 37;
        } else {
          top = 42;
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
        left: this.regionLeft,
        right: 100 - this.regionLeft,
        top: this.regionTop,
        bottom: 100 - this.regionTop,
        isMeasuredInPercentage: true,
      };
      return region;
    }
  },
});
