import { Resolution as VideoResolution } from "dynamsoft-camera-enhancer";
import { Resolution, EnumResolution } from "./assets/enum/Resolution";

export function judgeCurResolution(resolution: VideoResolution): Resolution {
  let minValue = Math.min(resolution.width, resolution.height);
  let maxValue = Math.max(resolution.width, resolution.height);
  if (minValue > 480 && minValue < 960 && maxValue > 960 && maxValue < 1440) {
    return EnumResolution.HD;
  } else {
    return EnumResolution.FULL_HD;
  }
}

export function getDate() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function getValueByKey(obj: object, value: string) {
  return Object.entries(obj).find(([_, val]) => val === value)?.[0];
}

const useCaseBarcodeFormatMap: {
  "1d": string[];
  "2d": string[];
  "1d2d": string[];
  vin: string[];
  dl: string[];
  dpm: string[];
} = {
  "1d": [
    "Code 11",
    "Code 39",
    "Code 128",
    "Code 93",
    "Codebar",
    "EAN 13",
    "EAN 8",
    "UPC A",
    "UPC E",
    "Industrial 25",
    "Code 39 Extended",
    "ITF",
    "MSI Code",
  ],
  "2d": ["QR Code", "PDF417", "Data Matrix"],
  "1d2d": [
    "Code 11",
    "Code 39",
    "Code 128",
    "Code 93",
    "Codebar",
    "EAN 13",
    "EAN 8",
    "UPC A",
    "UPC E",
    "Industrial 25",
    "Code 39 Extended",
    "ITF",
    "MSI Code",
    "QR Code",
    "PDF417",
    "Data Matrix",
  ],
  vin: [
    "Code 39",
    "Code 128",
    "Code 93",
    "Code 39 Extended",
    "Codebar",
    "Industrial 25",
    "ITF",
    "QR Code",
    "Data Matrix",
  ],
  dl: ["PDF417"],
  dpm: ["Data Matrix"],
};

const templateMap = {
  "Best Speed": "ReadSingleBarcode",
  Balance: "ReadBarcodes_Balance",
  "Best Coverage": "ReadBarcodes_ReadRateFirst",
};

const isDebug = location.search.includes("debug=true");

const urlMap = {
  "1d": "common-oned",
  "2d": "common-twod",
  "1d2d": "common-oned-twod",
  vin: "vin",
  dl: "driver-license",
  dpm: "dpm",
};

export { useCaseBarcodeFormatMap, templateMap, isDebug, urlMap };
