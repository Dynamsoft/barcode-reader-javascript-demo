import { BarcodeResultItem } from "dynamsoft-barcode-reader";
import { defineStore } from "pinia";
import { ParsedField } from "../types";

interface ParsedInfo {
  description: string;
  value: string;
}

export const useCaptureImageStore = defineStore("captureImage", {
  state: (): {
    isDecoding: boolean;
    isShowCaptureImagePage: boolean;
    currentSelectedImageFile: File | null;
    captureResult: Array<BarcodeResultItem>;
    parsedDLInfo: Array<ParsedInfo>;
  } => {
    return {
      isDecoding: false,
      isShowCaptureImagePage: false,
      currentSelectedImageFile: null,
      captureResult: [],
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
    updateDLJsonString(jsonString?: string) {
      const oriParseInfo: Array<ParsedInfo> = [];
      if (!jsonString) {
        this.$state.parsedDLInfo = [];
        return;
      }
      const parsedDLInfo = JSON.parse(jsonString);
      if (parsedDLInfo.exception) {
        this.$state.parsedDLInfo = [
          { description: "Error", value: parsedDLInfo.message },
          {
            description: "Original text",
            value: parsedDLInfo.text,
          },
        ];
      } else {
        if (parsedDLInfo.CodeType === "AAMVA_DL_ID") {
          for (let info of parsedDLInfo.ResultInfo) {
            if (info.FieldName !== "commonSubfile") continue;
            if (info.ChildFields) {
              wrapResultObject(info.ChildFields);
            }
          }
        } else if (parsedDLInfo.CodeType === "AAMVA_DL_ID_WITH_MAG_STRIPE") {
          for (let info of parsedDLInfo.ResultInfo) {
            if (info.FieldName.includes("track")) {
              if (info.ChildFields) {
                wrapResultObject(info.ChildFields);
              }
            }
          }
        } else if (parsedDLInfo.CodeType === "SOUTH_AFRICA_DL") {
          for (let info of parsedDLInfo.ResultInfo) {
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
  },
});
