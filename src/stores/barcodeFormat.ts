import { defineStore } from "pinia";
import { templateUrl } from "../util";
import { useScanOptionsStore } from "./scanOptions";
import { EnumBarcodeFormat } from "dynamsoft-barcode-reader-bundle";

const _window = window as any;

interface BarcodeFormat {
  oneD: { [key: string]: { format: string; state: boolean; formatString: keyof typeof EnumBarcodeFormat } };
  twoD: { [key: string]: { format: string; state: boolean; formatString: keyof typeof EnumBarcodeFormat } };
  other: { [key: string]: { format: string; state: boolean; formatString: keyof typeof EnumBarcodeFormat } };
}

type BarcodeCategory = "oneD" | "twoD" | "other";

export const useBarcodeFormatStore = defineStore("BarcodeFormat", {
  state: (): BarcodeFormat => {
    return {
      oneD: {
        "EAN 8": { format: "0x40", state: false, formatString: "BF_EAN_8" },
        "EAN 13": { format: "0x20", state: false, formatString: "BF_EAN_13" },
        "UPC A": { format: "0x80", state: false, formatString: "BF_UPC_A" },
        "UPC E": { format: "0x100", state: false, formatString: "BF_UPC_E" },
        "Code 128": { format: "0x2", state: false, formatString: "BF_CODE_128" },
        "Code 93": { format: "0x4", state: false, formatString: "BF_CODE_93" },
        "Code 39": { format: "0x1", state: false, formatString: "BF_CODE_39" },
        "Code 39 Extended": { format: "0x400", state: false, formatString: "BF_CODE_39_EXTENDED" },
        "Codebar": { format: "0x8", state: false, formatString: "BF_CODABAR" },
        "Industrial 25": { format: "0x200", state: false, formatString: "BF_INDUSTRIAL_25" },
        "ITF": { format: "0x10", state: false, formatString: "BF_ITF" },
        "MSI Code": { format: "0x100000", state: false, formatString: "BF_MSI_CODE" },
        "Code 32": { format: "0x01000000", state: false, formatString: "BF_CODE_32" },
        "Matrix 25": { format: "0x1000000000", state: false, formatString: "BF_MATRIX_25" },
        "Telepen": { format: "0x2000000000", state: false, formatString: "BF_TELEPEN" },
        "Code 11": { format: "0x200000", state: false, formatString: "BF_CODE_11" }
      },
      twoD: {
        "QR Code": { format: "0x04000000", state: false, formatString: "BF_QR_CODE" },
        "PDF417": { format: "0x02000000", state: false, formatString: "BF_PDF417" },
        "Data Matrix": { format: "0x08000000", state: false, formatString: "BF_DATAMATRIX" },
      },
      other: {
        "Aztec Code": { format: "0x10000000", state: false, formatString: "BF_AZTEC" },
        "Maxicode": { format: "0x20000000", state: false, formatString: "BF_MAXICODE" },
        "DotCode": { format: "0x200000000", state: false, formatString: "BF_DOTCODE" },
        "Postal Code": { format: "0x3F0000000000000", state: false, formatString: "BF_POSTALCODE" },
        "GS1 Databar": { format: "0x0003F800", state: false, formatString: "BF_GS1_DATABAR" },
        "GS1 Composite": { format: "0x80000000", state: false, formatString: "BF_GS1_COMPOSITE" },
        "Micro PDF417": { format: "0x00080000", state: false, formatString: "BF_MICRO_PDF417" },
        "Micro QR": { format: "0x40000000", state: false, formatString: "BF_MICRO_QR" },
        "Pharmacode": { format: "0xC00000000", state: false, formatString: "BF_PHARMACODE" },
        "Patch Code": { format: "0x00040000", state: false, formatString: "BF_PATCHCODE" },
      },
    };
  },
  actions: {
    updateBarcodeFormatState(format: string, type: BarcodeCategory, state: boolean) {
      this.$state[type][format].state = state;
    },
    findFormatAndUpdateState(formatString: keyof typeof EnumBarcodeFormat, state: boolean) {
      findFormatAndUpdateStateTag: for (let formatType in this.$state) {
        const _formatType = formatType as BarcodeCategory;
        for (let _format in this.$state[_formatType]) {
          if (this.$state[_formatType][_format].formatString === formatString) {
            this.$state[_formatType][_format].state = state;
            break findFormatAndUpdateStateTag;
          }
        }
      }
    },
    updateAllBarcodeFormatState(state: boolean) {
      for (let formatType in this.$state) {
        const _formatType = formatType as BarcodeCategory;
        for (let _format in this.$state[_formatType]) {
          this.$state[_formatType][_format].state = state;
        }
      }
    },
    updateDefaultBarcodeFormatState(state: boolean) {
      const oneDDefault = Object.keys(this.$state.oneD).filter(format => !["Code 32", "Matrix 25", "Telepen"].includes(format));
      const twoDDefault = Object.keys(this.$state.twoD);
      const otherDefault = ["Aztec Code", "Maxicode", "Micro PDF417", "Micro QR", "GS1 Composite"];
      const bfDefault = [...oneDDefault, ...twoDDefault, ...otherDefault];
      for (let formatType in this.$state) {
        const _formatType = formatType as BarcodeCategory;
        for (let _format in this.$state[_formatType]) {
          if (bfDefault.includes(_format)) {
            this.$state[_formatType][_format].state = state;
          }
        }
      }
    },
    async updateBarcodeFormat(currentTemplate: string) {
      const settings = await _window.cvRouter.getSimplifiedSettings(currentTemplate);
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
      await _window.cvRouter.updateSettings(currentTemplate, settings);
    },
  },
  getters: {
    // Currently, we only allow users to change the selected Barcode Formats for the General use case
    isFormatChangeEnabled: () => {
      const scanOptionsStore = useScanOptionsStore();
      return !templateUrl && ["1D Retail", "1D Industrial", "Common 1D And 2D", "Common 2D Codes", "VIN", "Scan from Distance"].includes(scanOptionsStore.currentScanOption.name);
    }
  }
});

export type { BarcodeCategory };
