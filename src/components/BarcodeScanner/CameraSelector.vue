<script setup lang="ts">
import { reactive, watchEffect } from "vue";
import { Dropdown, Menu, message } from "ant-design-vue";
import { DownOutlined, UpOutlined } from "@ant-design/icons-vue";
import { MenuInfo } from "ant-design-vue/es/menu/src/interface";
import { PlayCallbackInfo, VideoDeviceInfo } from "dynamsoft-barcode-reader-bundle";
import { useCameraListStore, VideoDeviceInfoOther } from "../../stores/cameraList";
import { useCaptureImageStore } from "../../stores/captureImage";
import { judgeCurResolution } from "../../util";
import { ResolutionMap } from "../../assets/enum/Resolution";
import { useScanRegionStore } from "../../stores/scanRegion";
import { useScanOptionsStore } from "../../stores/scanOptions";
import { useDeviceType } from "../../hooks/useDeviceType";

const _window = window as any;

const cameraListStore = useCameraListStore();
const captureImageStore = useCaptureImageStore();
const scanRegionStore = useScanRegionStore();
const scanOptionsStore = useScanOptionsStore();
const deviceType = useDeviceType();

const state = reactive({
  collapsed: false, // Controls the state of the dropdown.
  selectedKeys: [0], // Stores the selected camera key.
  selectedCanmeraLabel: "Loading..."
});

watchEffect(() => {
  const _currentCameraName = cameraListStore.cameraList.filter((camera) => {
    return (
      camera.deviceId === cameraListStore.currentCamera?.deviceId &&
      camera.resolution === cameraListStore.currentResolution
    );
  })[0];
  state.selectedKeys = [_currentCameraName?.key];
  state.selectedCanmeraLabel = _currentCameraName?.label;
});

/**
 * Toggles the collapsed state of the dropdown.
 * @param {boolean} collapsed - new state of dropdown collapsed
 */
const toggleCollapsed = (collapsed: boolean) => {
  state.collapsed = collapsed;
};

/**
 * Changes the current camera based on the selected menu item.
 * @param {MenuInfo} info - The menu information containing the selected item.
 */
const changeCamera = async (info: MenuInfo) => {
  const _item = { ...info.item.originItemValue } as VideoDeviceInfo & VideoDeviceInfoOther;

  // Clears all drawings in the camera view. Recommended during all camera switch/pause events
  _window.cameraView?.clearAllInnerDrawingItems();
  captureImageStore.updateDlResultBoxVisibility(false);

  // Check if selected camera or resolution is different than current one
  if (
    _item.deviceId !== cameraListStore.currentCamera!.deviceId ||
    cameraListStore.currentResolution !== _item.resolution
  ) {
    _window.cameraView?.setScanLaserVisible(false);
    _window.cameraView?.setScanRegionMaskVisible(false);
    _window.cvRouter.stopCapturing();

    // Switches to the new camera if the device ID is different.
    if (cameraListStore.currentCamera?.deviceId !== _item.deviceId) {
      await _window.cameraEnhancer.selectCamera(_item);
    }

    // Set the camera resolution based on the selected resolution.
    const _currentResolution: PlayCallbackInfo = await _window.cameraEnhancer?.setResolution(ResolutionMap[_item.resolution]);

    // Updates the current camera and resolution in the store.
    cameraListStore.updateCurrentCamera(_item);
    cameraListStore.updateCameraResolution(_item.resolution);

    // Verify camera switch is successfull
    const currentCamera = _window.cameraEnhancer?.getSelectedCamera();
    if (currentCamera?.deviceId !== cameraListStore.currentCamera?.deviceId) {
      currentCamera && cameraListStore.updateCurrentCamera(currentCamera);
      message.error({
        content: "Switch camera failed!",
        duration: 1
      });
    } else if (cameraListStore.currentResolution !== judgeCurResolution(_currentResolution!)) {
      message.warn({
        content: `Switch resolution failed. ${cameraListStore.currentResolution} might be unsupported in the camera.`,
        duration: 1
      });
      _currentResolution && cameraListStore.updateCameraResolution(_currentResolution);
    } else {
      message.success({
        content: `Switched to ${currentCamera?.label}(${cameraListStore.currentResolution}) successfully!`,
        duration: 1
      });
    }
    _window.cameraView?.setScanLaserVisible(true);
    _window.cameraView?.setScanRegionMaskVisible(true);
    _window.cameraEnhancer.setScanRegion(scanRegionStore.region());
    await _window.cvRouter.startCapturing(scanOptionsStore.currentScanOption.templateName);
  }
  toggleCollapsed(false);
};
</script>

<template>
  <Dropdown :trigger="['click']" @openChange="toggleCollapsed" class="dbr-camera-selector" overlayClassName="dbr-dropdown-list" :placement="deviceType === 'pc' ? 'bottom' : 'bottomLeft'" :disabled="captureImageStore.isShowCaptureImagePage || !cameraListStore.hasCamera" arrow>
    <a class="dbr-dropdown-link" @click.prevent>
      <div class="dbr-camera-wrapper">
        <svg data-v-10660718="" viewBox="0 0 29.308 17" class="dbr-camera-svg">
          <g data-v-10660718="" transform="translate(-346.925 -627.702)">
            <g data-v-10660718="" transform="translate(347.425 628.202)">
              <g data-v-10660718="">
                <path data-v-10660718="" d="M365.791,644.2H348.656a1.231,1.231,0,0,1-1.231-1.231V629.433a1.231,1.231,0,0,1,1.231-1.231h16a1.231,1.231,0,0,1,1.231,1.231v14.733" transform="translate(-347.425 -628.202)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path>
                <path data-v-10660718="" d="M371.81,640.606a1.23,1.23,0,0,1-1.781,1.1l-4.923-2.462a1.229,1.229,0,0,1-.681-1.1v-4.633a1.232,1.232,0,0,1,.681-1.1l4.923-2.462a1.231,1.231,0,0,1,1.781,1.1Z" transform="translate(-343.502 -627.828)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path>
              </g>
            </g>
          </g>
        </svg>
      </div>
      <DownOutlined class="dbr-down-out-lined" v-if="!state.collapsed" />
      <UpOutlined class="dbr-up-out-lined" v-else />
      <div class="dbr-current-camera">{{ state.selectedCanmeraLabel }}</div>
    </a>
    <template #overlay>
      <Menu class="dbr-camera-list" :items="cameraListStore.cameraList" @click="changeCamera" v-model:selectedKeys="state.selectedKeys"></Menu>
    </template>
  </Dropdown>
</template>

<style scoped lang="less">
.dbr-camera-selector {
  width: 20%;
  height: 100%;
  max-width: 249px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(170, 170, 170);
  background-color: rgba(34, 34, 34);
  cursor: pointer;

  &:hover {
    background-color: #323234;
  }

  .dbr-camera-wrapper {
    width: 30%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .dbr-camera-svg {
      height: 42.2%;

      @media (max-width: 979.5px) {
        width: 33px;
        height: 19px;
      }
    }

    .dbr-camera-name {
      font-size: 12px;

      @media (min-width: 980px) {
        display: none;
      }
    }

    @media (max-width: 979.5px) {
      flex-direction: column;
      margin-right: 12px;
    }
  }

  .dbr-current-camera {
    width: 100px;
    word-break: break-all;
    font-size: 12px;
    text-align: start;
    font-family: "Oswald-Regular";

    @media (max-width: 979.5px) {
      display: none;
    }
  }

  .dbr-down-out-lined,
  .dbr-up-out-lined {
    margin-right: 12px;
  }

  @media (max-width: 979.5px) {
    max-width: 76px;
    justify-content: space-around;
    padding-left: 12px;
  }
}
</style>

<style lang="less">
.ant-dropdown {
  .ant-dropdown-menu {
    @media (max-height: 500px) {
      max-height: 180px;
      overflow: auto;
    }

    .ant-dropdown-menu-item {
      font-family: "Oswald-Regular";
      &:hover {
        background-color: rgb(50, 50, 52);
      }
    }
  }
}
</style>
