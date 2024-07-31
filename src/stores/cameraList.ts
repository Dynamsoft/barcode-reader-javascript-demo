import { defineStore } from "pinia";
import { VideoDeviceInfo, Resolution as VideoResolution } from "dynamsoft-camera-enhancer";
import { judgeCurResolution } from "../util";
import { EnumResolution, Resolution } from "../assets/enum/Resolution";

interface VideoDeviceInfoOther {
  key: number;
  resolution: Resolution;
  selected: boolean;
}

export const useCameraListStore = defineStore("cameraList", {
  state: (): {
    cameraList: Array<VideoDeviceInfo & VideoDeviceInfoOther>;
    currentCamera: VideoDeviceInfo | null;
    currentResolution: Resolution;
  } => {
    return {
      cameraList: [],
      currentCamera: null,
      currentResolution: EnumResolution.HD,
    };
  },
  actions: {
    updateCameraList(cameraList: Array<VideoDeviceInfo & VideoDeviceInfoOther>) {
      const _cameraList_HD: Array<VideoDeviceInfo & VideoDeviceInfoOther> = cameraList.map((camera) => ({
        ...camera,
        label: `${camera.label} (${EnumResolution.HD})`,
        resolution: EnumResolution.HD,
      }));
      const _cameraList_FULL_HD: Array<VideoDeviceInfo & VideoDeviceInfoOther> = cameraList.map((camera) => ({
        ...camera,
        label: `${camera.label} (${EnumResolution.FULL_HD})`,
        resolution: EnumResolution.FULL_HD,
      }));

      const _cameraList = [..._cameraList_HD, ..._cameraList_FULL_HD]
        .sort((a, b) => a.label?.localeCompare(b.label))
        .map((camera, index) => ({
          ...camera,
          key: index,
        }));
      this.$state.cameraList = _cameraList;
      console.log(_cameraList);
    },
    updateCurrentCamera(camera: VideoDeviceInfo) {
      const _camera = camera;
      this.$state.currentCamera = _camera;
    },
    updateCameraResolution(resolution: VideoResolution | Resolution) {
      let rsl: Resolution;
      if (typeof resolution !== "string") {
        rsl = judgeCurResolution(resolution);
      } else {
        rsl = resolution;
      }
      this.$state.currentResolution = rsl;
    },
  },
});
