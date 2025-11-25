import { BarcodeResultItem, ParsedResult } from "dynamsoft-barcode-reader-bundle";
import { defineStore } from "pinia";
import { ParsedField } from "../util";

interface ParsedInfo {
  description: string;
  value: string;
}

export const useCaptureImageStore = defineStore("captureImage", {
  state: (): {
    isDecoding: boolean;
    isShowDlResultBox: boolean;
    isShowCaptureImagePage: boolean;
    currentSelectedImageFile: File | null;
    captureResult: Array<BarcodeResultItem>;
    scannerResult: Array<BarcodeResultItem>;
    parsedDLInfo: Array<ParsedInfo>;
  } => {
    return {
      isDecoding: false,
      isShowDlResultBox: false,
      isShowCaptureImagePage: false,
      currentSelectedImageFile: null,
      captureResult: [],
      scannerResult: [],
      parsedDLInfo: [],
    };
  },
  actions: {
    updateDecodingState(state: boolean) {
      this.$state.isDecoding = state;
    },
    captureImagePageVisible(visible: boolean) {
      this.$state.isShowCaptureImagePage = visible;
    },
    updateSelectedFile(file: File) {
      this.$state.currentSelectedImageFile = file;
    },
    updateCaptureResult(result?: Array<BarcodeResultItem>) {
      if (!result) return (this.$state.captureResult = []);
      this.$state.captureResult = result;
    },
    updateScannerCaptureResult(result?: Array<BarcodeResultItem>) {
      if (!result) return (this.$state.scannerResult = []);
      this.$state.scannerResult = result;
    },
    updateDLJsonString(parsedResult?: ParsedResult & { text: string }) {
      const oriParseInfo: Array<ParsedInfo> = [];
      if (!parsedResult) {
        this.$state.parsedDLInfo = [];
        return;
      }
      if (parsedResult.errorCode !== 0) {
        this.$state.parsedDLInfo = [
          { description: "Error", value: parsedResult.errorString },
          {
            description: "Original text",
            value: parsedResult.text,
          },
        ];
      } else {
        const parsedResultItem = parsedResult.parsedResultItems[0];
        const resultInfo = JSON.parse(parsedResultItem.jsonString) as { CodeType: string; ResultInfo: Array<any> };
        if (parsedResultItem.codeType === "AAMVA_DL_ID") {
          for (let info of resultInfo.ResultInfo) {
            if (info.FieldName !== "commonSubfile") continue;
            if (info.ChildFields) {
              wrapResultObject(info.ChildFields);
            }
          }
        } else if (parsedResultItem.codeType === "AAMVA_DL_ID_WITH_MAG_STRIPE") {
          for (let info of resultInfo.ResultInfo) {
            if (info.FieldName.includes("track")) {
              if (info.ChildFields) {
                wrapResultObject(info.ChildFields);
              }
            }
          }
        } else if (parsedResultItem.codeType === "SOUTH_AFRICA_DL") {
          for (let info of resultInfo.ResultInfo) {
            if (info.ChildFields) {
              wrapResultObject(info.ChildFields);
            } else {
              if (info.Value) {
                oriParseInfo.push({
                  description: info.FieldName,
                  value: info.Value,
                });
              }
            }
          }
        }

        function wrapResultObject(childFields: ParsedField) {
          for (let childField of childFields) {
            for (let field of childField) {
              if (!["dataElementSeparator", "segmentTerminator", "subfile", "subfileType"].includes(field.FieldName)) {
                if (field.Value) {
                  oriParseInfo.push({
                    description: field.FieldName,
                    value: field.Value,
                  });
                }
              }
              if (field.ChildFields) {
                wrapResultObject(field.ChildFields);
              }
            }
          }
        }
        this.$state.parsedDLInfo = oriParseInfo;
      }
    },
    updateVINJsonString(parsedResult?: ParsedResult & { text: string }) {
      const oriParseInfo: Array<ParsedInfo> = [];
      if (!parsedResult) {
        this.$state.parsedDLInfo = [];
        return;
      }
      if (parsedResult.errorCode !== 0) {
        this.$state.parsedDLInfo = [
          { description: "Error", value: parsedResult.errorString },
          {
            description: "Original text",
            value: parsedResult.text,
          },
        ];
      } else {
        const parsedResultItem = parsedResult.parsedResultItems[0];
        const resultInfo = JSON.parse(parsedResultItem.jsonString) as { CodeType: string; ResultInfo: Array<any> };
        for (let info of resultInfo.ResultInfo) {
          if (info.ChildFields) {
            wrapResultObject(info.ChildFields);
          }
        }

        function wrapResultObject(childFields: ParsedField) {
          for (let childField of childFields) {
            for (let field of childField) {
              if (field.Value) {
                oriParseInfo.push({
                  description: field.FieldName,
                  value: field.Value,
                });
              }
              if (field.ChildFields) {
                wrapResultObject(field.ChildFields);
              }
            }
          }
        }
        this.$state.parsedDLInfo = oriParseInfo;
      }
    },
    updateDlResultBoxVisibility(value: boolean) {
      this.$state.isShowDlResultBox = value;
    }
  },
});
