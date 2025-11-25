import { Resolution as VideoResolution } from "dynamsoft-barcode-reader-bundle";
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

export type ParsedField = Array<
  Array<{
    FieldName: string;
    Value?: string;
    ChildFields?: ParsedField;
  }>
>;

export type ExtendedMediaTrackCapabilities = MediaTrackCapabilities & { torch?: boolean; focusMode?: any };

const searchParams = new URLSearchParams(location.search);
const isDebug = searchParams.get("debug") === "true";
const templateUrl = searchParams.get("template");

export { isDebug, templateUrl };
