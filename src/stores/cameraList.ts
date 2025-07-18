import { defineStore } from "pinia";
import { VideoDeviceInfo, Resolution as VideoResolution } from "dynamsoft-barcode-reader-bundle";
import { judgeCurResolution } from "../util";
import { EnumResolution, Resolution } from "../assets/enum/Resolution";
import { TypeUseCase } from "./useCase";
import demoVideosConfig from "../demoVideosConfig";

export interface VideoDeviceInfoOther {
  key: number;
  resolution: Resolution;
  _isDemoVideo?: boolean;
  _belong?: TypeUseCase;
  _isDefualt?: boolean;
}

const initDemoVideoList = () => {
  const _demoCameraList: Array<VideoDeviceInfo & VideoDeviceInfoOther> = [];
  for(let videoConfig of demoVideosConfig) {
    _demoCameraList.push({
      deviceId: videoConfig.name,
      label: videoConfig.label + ` (${videoConfig.resolution})`,
      key: videoConfig.key,
      resolution: videoConfig.resolution,
      _checked: false,
      _isDemoVideo: true,
      _belong: videoConfig.belong,
      _isDefualt: videoConfig.default
    })
  }
  return _demoCameraList;
}

export const useCameraListStore = defineStore("cameraList", {
  state: (): {
    cameraList: Array<VideoDeviceInfo & VideoDeviceInfoOther>;
    currentCamera: VideoDeviceInfo | null;
    currentResolution: Resolution;
    hasCamera: boolean;
    isUseDemoVideo: boolean;
    isLoading: boolean;
  } => {
    return {
      cameraList: initDemoVideoList(),
      currentCamera: null,
      currentResolution: EnumResolution.HD,
      hasCamera: true,
      isUseDemoVideo: false,
      isLoading: true
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
      
      const _demoVideoList = this.$state.cameraList.filter(camera => camera._isDemoVideo);
      
      _cameraList.push(..._demoVideoList);

      this.$state.cameraList = _cameraList;
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
    updateHasCamera(value: boolean) {
      this.$state.hasCamera = value;
    },
    updateIsUseDemoVideo(value: boolean) {
      this.$state.isUseDemoVideo = value;
    },
    updateIsLoading(value: boolean) {
      this.$state.isLoading = value;
    }
  },
});
