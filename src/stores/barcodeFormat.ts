import { defineStore } from "pinia";

const _window = window as any;

interface BarcodeFormat {
  oneD: { [key: string]: { format: string; state: boolean } };
  twoD: { [key: string]: { format: string; state: boolean } };
  other: { [key: string]: { format: string; state: boolean } };
}

type BarcodeCategory = "oneD" | "twoD" | "other";

export const useBarcodeFormatStore = defineStore("BarcodeFormat", {
  state: (): BarcodeFormat => {
    return {
      oneD: {
        "Code 11": { format: "0x200000", state: true },
        "Code 128": { format: "0x2", state: true },
        "Code 93": { format: "0x4", state: true },
        "Code 39": { format: "0x1", state: true },
        "Code 39 Extended": { format: "0x400", state: true },
        "EAN 8": { format: "0x40", state: true },
        Codebar: { format: "0x8", state: true },
        "EAN 13": { format: "0x20", state: true },
        "Industrial 25": { format: "0x200", state: true },
        "UPC A": { format: "0x80", state: true },
        "UPC E": { format: "0x100", state: true },
        ITF: { format: "0x10", state: true },
        "MSI Code": { format: "0x100000", state: true },
      },
      twoD: {
        "QR Code": { format: "0x04000000", state: true },
        PDF417: { format: "0x02000000", state: true },
        "Data Matrix": { format: "0x08000000", state: true },
      },
      other: {
        "Aztec Code": { format: "0x10000000", state: false },
        Maxicode: { format: "0x20000000", state: false },
        "Patch Code": { format: "0x00040000", state: false },
        DotCode: { format: "0x200000000", state: false },
        "Postal Code": { format: "0x3F0000000000000", state: false },
        "GS1 Databar": { format: "0x0003F800", state: false },
        "GS1 Composite": { format: "0x80000000", state: false },
        "Micro PDF417": { format: "0x00080000", state: false },
        "Micro QR": { format: "0x40000000", state: false },
        Pharmacode: { format: "0xC00000000", state: false },
      },
    };
  },
  actions: {
    updateBarcodeFormatState(format: string, type: BarcodeCategory, state: boolean) {
      this.$state[type][format].state = state;
    },
    findFormatAndUpdateState(format: string, state: boolean) {
      findFormatAndUpdateStateTag: for (let formatType in this.$state) {
        const _formatType = formatType as BarcodeCategory;
        for (let _format in this.$state[_formatType]) {
          if (_format === format) {
            this.$state[_formatType][_format].state = state;
            break findFormatAndUpdateStateTag;
          }
        }
      }
    },
    async updateBarcodeFormat(currentTemplate: string, isShowCaptureImagePage: boolean) {
      // If the camera is not open and it is not the image reader page, you do not need to continue to set, after opening the unified setting
      if (!_window.cameraEnhancer || (!_window.cameraEnhancer.isOpen() && !isShowCaptureImagePage)) return;
      const settings = await _window.cvRouter!.getSimplifiedSettings(currentTemplate);
      settings.barcodeSettings.barcodeFormatIds = BigInt(0);
      for (let oneD in this.$state.oneD) {
        if (this.$state.oneD[oneD].state) {
          settings.barcodeSettings.barcodeFormatIds |= BigInt(this.$state.oneD[oneD].format);
        }
      }
      for (let twoD in this.$state.twoD) {
        if (this.$state.twoD[twoD].state) {
          settings.barcodeSettings.barcodeFormatIds |= BigInt(this.$state.twoD[twoD].format);
        }
      }
      for (let other in this.$state.other) {
        if (this.$state.other[other].state) {
          settings.barcodeSettings.barcodeFormatIds |= BigInt(this.$state.other[other].format);
        }
      }
      await _window.cvRouter!.updateSettings(currentTemplate, settings);
    },
  },
});

export type { BarcodeCategory };
