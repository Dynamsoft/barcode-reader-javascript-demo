<script setup lang="ts">
import HeaderInMobile from "../components/HeaderInMobile.vue";
import { onBeforeMount, onMounted } from 'vue';
import { useIsShowGuideStore } from "../stores/isShowGuide";
import { useCameraListStore } from "../stores/cameraList";
import { ScanOption, useScanOptionsStore } from '../stores/scanOptions';
import { useSettingsStore } from "../stores/settings";
import { useDeviceType } from "../hooks/useDeviceType";
import { Router, useRouter } from 'vue-router';

const isShowGuideStore = useIsShowGuideStore();
const cameraListStore = useCameraListStore();
const scanOptionsStore = useScanOptionsStore();
const settingsStore = useSettingsStore();
const deviceType = useDeviceType();

const router: Router = useRouter();

onBeforeMount(() => {
  isShowGuideStore.updateIsShowGuide(true);
  cameraListStore.updateHasCamera(true);
});


onMounted(() => {
  settingsStore.updateSingleOrMulti("Single");
  settingsStore.updateColourMode("Both");
});

const scanOptionChanged = (option: ScanOption) => {
  scanOptionsStore.updateScanOption(option);
}

const startScan = async () => {
  const selectedOption = scanOptionsStore.scanOptions.find(option => option.checked);
  await router.push(selectedOption!.urlName + location.search);
  isShowGuideStore.updateIsShowGuide(false);
};
</script>

<template>
  <HeaderInMobile />
  <div class="dbr-guide">
    <div class="dbr-guide-main">
      <header class="dbr-demo-header">
        <h1 class="dbr-demo-title">Dynamsoft Barcode Reader JavaScript Demo</h1>
        <p class="dbr-demo-description">With Dynamsoft Barcode Reader JavaScript Edition, turn any camera-equipped device into a fast, customizable enterprise-grade barcode scanner. Try our demo to see it in action!</p>
      </header>
      <section class="dbr-scan-options">
        <label v-for="option of scanOptionsStore.guideOptions" class="dbr-scan-option" :style="{ border: option.checked ? '1px solid #FE8E14' : 'unset' }">
          <div class="dbr-option-svg" v-html="option.svg"></div>
          <div class="dbr-option-content">
            <div class="dbr-option-name">{{ option.name }}</div>
            <div class="dbr-option-format" v-show="deviceType === 'pc' && !!option.format">{{ option.format?.join(", ") }}</div>
          </div>
          <input type="radio" name="dbr-scan-option" :checked="option.checked" @change="() => { scanOptionChanged(option) }">
        </label>
      </section>
      <button class="dbr-start-scan-btn" @click="() => { startScan(); }">Start Scan</button>
    </div>
  </div>
</template>

<style scoped lang="less">
.dbr-guide {
  width: 100%;
  height: 94vh;
  display: flex;
  align-items: center;
  background-color: #323234;
  overflow: auto;

  .dbr-guide-main {
    width: 45%;
    height: 70%;
    min-width: 979px;
    max-height: 579px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin: 0 auto;

    .dbr-demo-header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 2;

      .dbr-demo-title {
        font-size: 36px;
        color: #fff;
        font-family: Oswald-Light;
        font-weight: 100;
        margin-bottom: 16px;

        @media (max-width: 979.5px) {
          font-size: 24px;
        }

        @media (max-height: 500px) {
          margin-bottom: 0;
        }
      }

      .dbr-demo-description {
        width: 70%;
        font-size: 16px;
        color: #F5F5F5;
        font-family: "OpenSans-Regular";
        text-align: center;

        @media (max-width: 979.5px) {
          display: none;
        }
      }

      @media (max-width: 979.5px) {
        display: unset;
        width: 75%;
        text-align: center;
        flex: 1;
      }
    }

    .dbr-scan-options {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1.1fr 1fr 1fr;
      gap: 25px;
      flex: 7;
      margin: 58px 0;
      padding: 10px 0;

      .dbr-scan-option {
        color: #F5F5F5;
        background-color: #1D1D1D;
        font-size: 14px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: relative;
        padding: 0 10px;
        cursor: pointer;

        .dbr-option-svg {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          ::v-deep(._1DRetail) {
            width: 35px;
            height: 28.26px;

            @media (max-width: 979.5px) and (max-height: 500px) {
              width: 30px;
              height: 23.26px;
            }
          }

          ::v-deep(._1DIndustrial) {
            width: 34px;
            height: 41px;

            @media (max-width: 979.5px) and (max-height: 500px) {
              width: 29px;
              height: 36px;
            }
          }

          ::v-deep(._Common2DCodes) {
            width: 30px;
            height: 30px;

            @media (max-width: 979.5px) and (max-height: 500px) {
              width: 25px;
              height: 25px;
            }
          }

          ::v-deep(._DataMatrix) {
            width: 34px;
            height: 41px;

            @media (max-width: 979.5px) and (max-height: 500px) {
              width: 29px;
              height: 36px;
            }
          }

          ::v-deep(._Common1DAnd2D) {
            width: 30px;
            height: 30px;

            @media (max-width: 979.5px) and (max-height: 500px) {
              width: 25px;
              height: 25px;
            }
          }

          ::v-deep(._QRCode) {
            width: 30px;
            height: 30px;

            @media (max-width: 979.5px) and (max-height: 500px) {
              width: 25px;
              height: 25px;
            }
          }

          ::v-deep(._DriversLicense) {
            width: 38.06px;
            height: 24.84px;

            @media (max-width: 979.5px) and (max-height: 500px) {
              width: 33.06px;
              height: 19.84px;
            }
          }

          ::v-deep(._VIN) {
            width: 44px;
            height: 22px;

            @media (max-width: 979.5px) and (max-height: 500px) {
              width: 39px;
              height: 17px;
            }
          }

          ::v-deep(._ScanfromDistance) {
            width: 52.84px;
            height: 30px;

            @media (max-width: 979.5px) and (max-height: 500px) {
              width: 47.84px;
              height: 25px;
            }
          }

          @media (max-width: 979.5px) {
            height: unset;
          }

          @media (max-width: 979.5px) and (min-height: 500px) {
            margin-bottom: 5px;
          }
        }

        .dbr-option-content {
          width: 50%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-family: "OpenSans-Regular";

          .dbr-option-name {
            width: 100%;

            @media (max-width: 979.5px) and (min-height: 500px) {
              width: 100%;
              text-align: center;
              font-size: 12px;
            }
          }

          .dbr-option-format {
            color: #AAAAAA;
            font-size: 11px;
            word-wrap: break-word;
            margin-top: 5px;
          }

          @media (max-width: 979.5px) {
            width: 100%;
            height: unset;
          }

          @media (max-width: 979.5px) and (max-height: 500px) {
            width: 60%;
          }
        }

        input[type="radio"] {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;

          &:checked {
            border: 1px solid #FE8E14;
            background-color: white;

            &::before {
              content: "";
              display: block;
              width: 10px;
              height: 10px;
              background-color: #FE8E14;
              border-radius: 50%;

              @media (max-width: 979.5px) {
                width: 8px;
                height: 8px;
              }
            }
          }

          @media (max-width: 979.5px) and (min-height: 500px) {
            width: 12px;
            height: 12px;
            position: absolute;
            top: 12px;
            left: 12px;
            background-color: #343434;
          }
        }

        @media (max-width: 979.5px) and (min-height: 500px) {
          flex-direction: column;
          justify-content: center;
          padding: unset;
        }
      }

      @media (max-width: 979.5px) {
        gap: 15px;
        margin: unset;
        grid-template-rows: 1fr 1fr 1fr;
      }

      @media (max-height: 500px) {
        padding: 10px 0;
      }

      @media (min-width: 980px) and (max-height: 770px) {
        margin: 40px 0;
      }

      @media (min-width: 980px) and (max-height: 600px) {
        margin: 20px 0;
      }
    }

    .dbr-start-scan-btn {
      width: 150px;
      max-height: 45px;
      min-height: 40px;
      background-color: #FE8E14;
      font-size: 20px;
      color: #fff;
      font-family: "Oswald-Regular";
      flex: 1;
      cursor: pointer;
    }

    @media (max-width: 979.5px) {
      width: 90%;
      height: 100%;
      min-width: unset;
      max-height: unset;
      min-height: unset;
      padding: 20px 0;
    }

    @media (max-height: 500px) {
      padding: 5px 0;
    }

    @media (min-width: 980px) and (max-height: 770px) {
      height: 80%;
    }

    @media (min-width: 980px) and (max-height: 600px) {
      height: 90%;
    }
  }

  @media (max-width: 979.5px) {
    height: calc(93% - 70px);
  }

  @media (max-height: 500px) and (max-width: 979.5px) {
    height: 93%;
  }

  @media (max-height: 500px) and (min-width: 980px) {
    height: 100%;
  }
}
</style>