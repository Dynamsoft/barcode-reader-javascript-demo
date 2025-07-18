import { EnumResolution } from "./assets/enum/Resolution";
import { TypeUseCase } from "./stores/useCase";

// The key value of the demo video starts from 900
export default [
  {
    name: "General.mp4",
    label: "Demo Video For General",
    belong: "general",
    resolution: EnumResolution.HD,
    key: 900,
    default: true
  },
  {
    name: "VIN.mp4",
    label: "Demo Video For VIN",
    belong: "vin",
    resolution: EnumResolution.FULL_HD,
    key: 901,
    default: true
  },
  {
    name: "DL.mp4",
    label: "Demo Video For DL",
    belong: "dl",
    resolution: EnumResolution.FULL_HD,
    key: 902,
    default: true
  },
  {
    name: "DPM.mp4",
    label: "Demo Video For DPM",
    belong: "dpm",
    resolution: EnumResolution.HD,
    key: 903,
    default: true
  }
] as {
  name: string;
  label: string;
  belong: TypeUseCase;
  resolution: EnumResolution;
  key: number;
  default: boolean;
}[]