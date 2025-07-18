import { Resolution as VideoResolution } from "dynamsoft-barcode-reader-bundle";

export enum EnumResolution {
  HD = "HD",
  FULL_HD = "FULL HD",
}

export const ResolutionMap: Record<EnumResolution, VideoResolution> = {
  [EnumResolution.HD]: { width: 1280, height: 720 },
  [EnumResolution.FULL_HD]: { width: 1920, height: 1080 },
};

export type Resolution = EnumResolution.HD | EnumResolution.FULL_HD;
