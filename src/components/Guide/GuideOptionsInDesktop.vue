<script setup lang="ts">
import Circle from "./Circle.vue";
import { useUseCaseStore } from "../../stores/useCase";
const useCaseStore = useUseCaseStore();
</script>

<template>
  <div class="dbr-guide-options-in-desktop">
    <div class="dbr-option-columns">
      <div
        class="dbr-option-column-1 dbr-option-column"
        @click="useCaseStore.useCaseName = '1d'"
        :style="{ border: useCaseStore.useCaseName === '1d' ? '1px solid #fe8e14' : 'none' }"
      >
        <div class="dbr-option-title">Common 1D Barcodes</div>
        <div class="dbr-option-desc">
          Code 11, Code 39, Code 128, Code 93, Codabar, EAN 13, EAN 8, UPC A, UPC E, Industrial 25, Code39 Extended, MSI
          Code
        </div>
        <Circle :name="'1d'" :width="16" :height="16" />
      </div>
      <div class="dbr-option-column-2 dbr-option-column">
        <div
          class="dbr-option-item dbr-option-item-1"
          @click="useCaseStore.useCaseName = '2d'"
          :style="{ border: useCaseStore.useCaseName === '2d' ? '1px solid #fe8e14' : 'none' }"
        >
          <div class="dbr-option-title">Common 2D Barcodes</div>
          <div class="dbr-option-desc">QR Code, Data Matrix, PDF417</div>
          <Circle :name="'2d'" :width="16" :height="16" />
        </div>
        <div
          class="dbr-option-item dbr-option-item-2"
          @click="useCaseStore.useCaseName = '1d2d'"
          :style="{ border: useCaseStore.useCaseName === '1d2d' ? '1px solid #fe8e14' : 'none' }"
        >
          <div class="dbr-option-title">Common 1D + 2D</div>
          <Circle :name="'1d2d'" :width="16" :height="16" />
        </div>
      </div>
      <div class="dbr-option-column-3 dbr-option-column">
        <div
          class="dbr-option-item dbr-option-item-1"
          @click="useCaseStore.useCaseName = 'vin'"
          :style="{ border: useCaseStore.useCaseName === 'vin' ? '1px solid #fe8e14' : 'none' }"
        >
          <div class="dbr-option-title">VIN</div>
          <svg data-v-509bb99c="" viewBox="0 0 34 16.783" class="dbr-vin-icon">
            <g data-v-509bb99c="" transform="translate(-522 -549.5)">
              <g data-v-509bb99c="" transform="translate(522.5 550)">
                <g data-v-509bb99c="">
                  <path
                    data-v-509bb99c=""
                    d="M542.37,562.739a2.87,2.87,0,1,0-2.87-2.87A2.869,2.869,0,0,0,542.37,562.739Z"
                    transform="translate(-515.109 -546.957)"
                    fill="none"
                    stroke="#606060"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                  ></path>
                  <path
                    data-v-509bb99c=""
                    d="M526.8,559h-4.3"
                    transform="translate(-522.5 -546.087)"
                    fill="none"
                    stroke="#606060"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                  ></path>
                  <path
                    data-v-509bb99c=""
                    d="M528.37,562.739a2.87,2.87,0,1,0-2.87-2.87A2.869,2.869,0,0,0,528.37,562.739Z"
                    transform="translate(-521.196 -546.957)"
                    fill="none"
                    stroke="#606060"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                  ></path>
                  <path
                    data-v-509bb99c=""
                    d="M543.848,559H529.5"
                    transform="translate(-519.457 -546.087)"
                    fill="none"
                    stroke="#606060"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                  ></path>
                  <path
                    data-v-509bb99c=""
                    d="M523.5,562.913v-5.022a2.153,2.153,0,0,1,2.152-2.152H527.8l2.474-4.946a1.433,1.433,0,0,1,1.283-.793h11.857a1.433,1.433,0,0,1,1.283.793l2.474,4.946h5.739a2.153,2.153,0,0,1,2.152,2.152v3.587a1.435,1.435,0,0,1-1.435,1.435H552.2"
                    transform="translate(-522.065 -550)"
                    fill="none"
                    stroke="#606060"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                  ></path>
                  <path
                    data-v-509bb99c=""
                    d="M545.87,554H526.5"
                    transform="translate(-520.761 -548.261)"
                    fill="none"
                    stroke="#606060"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                  ></path>
                  <path
                    data-v-509bb99c=""
                    d="M533,550v5.739"
                    transform="translate(-517.935 -550)"
                    fill="none"
                    stroke="#606060"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
          <Circle :name="'vin'" :width="16" :height="16" />
        </div>
        <div
          class="dbr-option-item dbr-option-item-2"
          @click="useCaseStore.useCaseName = `dl`"
          :style="{ border: useCaseStore.useCaseName === 'dl' ? '1px solid #fe8e14' : 'none' }"
        >
          <div class="dbr-option-title">USA/CAN/ZA Driver's License</div>
          <Circle :name="'dl'" :width="16" :height="16" />
        </div>
      </div>
      <div
        class="dbr-option-column-4 dbr-option-column"
        @click="useCaseStore.useCaseName = 'dpm'"
        :style="{ border: useCaseStore.useCaseName === 'dpm' ? '1px solid #fe8e14' : 'none' }"
      >
        <div class="dbr-option-title">Direct Part Marking Codes</div>
        <div class="dbr-option-desc">Currently only Data Matrix</div>
        <div class="dbr-dpm-icon">
          <svg data-v-509bb99c="" viewBox="0 0 24 24">
            <path
              data-v-509bb99c=""
              d="M10.661,10A1.664,1.664,0,1,1,9,11.667v-.006A1.665,1.665,0,0,1,10.661,10Zm0,4.164A1.641,1.641,0,1,1,9,15.805,1.642,1.642,0,0,1,10.661,14.164Zm0,4.119A1.654,1.654,0,1,1,9,19.937,1.654,1.654,0,0,1,10.661,18.283Zm0,4.145A1.654,1.654,0,1,1,9,24.082,1.655,1.655,0,0,1,10.661,22.428Zm0,4.125A1.664,1.664,0,1,1,9,28.221v-.006A1.661,1.661,0,0,1,10.661,26.553Zm0,4.119A1.664,1.664,0,1,1,9,32.339H9A1.667,1.667,0,0,1,10.661,30.672Zm20.679,0a1.664,1.664,0,1,1-1.667,1.667,1.664,1.664,0,0,1,1.667-1.667Zm-4.145,0a1.664,1.664,0,1,1-1.641,1.686v-.019a1.653,1.653,0,0,1,1.638-1.667Zm-4.132,0a1.664,1.664,0,1,1-1.654,1.674v-.006A1.663,1.663,0,0,1,23.063,30.672Zm-4.145,0a1.664,1.664,0,1,1-1.654,1.674v-.006a1.66,1.66,0,0,1,1.653-1.667Zm-4.132,0a1.664,1.664,0,1,1-1.661,1.667h0a1.661,1.661,0,0,1,1.655-1.667Zm0-16.508a1.657,1.657,0,1,1-.008,0Zm0,8.264a1.657,1.657,0,1,1-.006,0ZM18.918,10a1.664,1.664,0,1,1-1.654,1.674v-.013A1.658,1.658,0,0,1,18.918,10Zm0,4.164a1.641,1.641,0,1,1-1.654,1.641,1.641,1.641,0,0,1,1.654-1.641Zm0,8.264a1.654,1.654,0,1,1-1.654,1.654h0a1.653,1.653,0,0,1,1.651-1.654Zm0,4.125a1.664,1.664,0,1,1-1.654,1.674v-.013a1.654,1.654,0,0,1,1.648-1.661Zm4.145-8.27a1.654,1.654,0,1,1-1.654,1.654h0A1.656,1.656,0,0,1,23.063,18.283Zm0,4.145a1.654,1.654,0,1,1-1.654,1.654h0A1.656,1.656,0,0,1,23.063,22.428Zm4.132-8.264a1.641,1.641,0,1,1-1.641,1.641h0a1.639,1.639,0,0,1,1.637-1.641Zm0,4.119a1.654,1.654,0,1,1-1.641,1.667v-.013a1.645,1.645,0,0,1,1.637-1.654Zm0,8.27a1.664,1.664,0,1,1-1.641,1.686v-.026a1.647,1.647,0,0,1,1.633-1.661ZM31.339,10a1.664,1.664,0,1,1-1.667,1.661A1.664,1.664,0,0,1,31.339,10Zm0,12.428a1.664,1.664,0,1,1-.005,0Z"
              transform="translate(-9 -10)"
              fill="#606060"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
        <Circle :name="'dpm'" :width="16" :height="16" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.dbr-guide-options-in-desktop {
  margin: 0 auto;
  margin-top: 6vh;
  width: 66.8%;
  min-width: 980px;

  .dbr-option-columns {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 19.4vh;
    min-height: 150px;

    .dbr-option-column {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      width: 23.5%;
      color: #fff;
    }

    .dbr-option-column-2 {
      .dbr-option-item-1 {
        .dbr-option-title {
          font-size: 18px;
          margin-top: 1.3vh;
        }

        .dbr-option-desc {
          width: 82.6%;
          font-size: 12px;
          font-family: "OpenSans-Regular";
          margin-top: 1vh;
        }
      }

      .dbr-option-item-2 {
        position: relative;
        display: flex;
        align-items: center;

        .dbr-option-title {
          font-size: 18px;
        }
      }
    }

    .dbr-option-column-3 {
      .dbr-option-item-1 {
        display: flex;
        align-items: center;

        .dbr-option-title {
          font-size: 18px;
        }

        .dbr-vin-icon {
          width: 22.3%;
          margin-left: 9.1%;
        }
      }

      .dbr-option-item-2 {
        position: relative;
        display: flex;
        align-items: center;

        .dbr-option-title {
          font-size: 18px;
        }
      }
    }

    .dbr-option-column-4 {
      .dbr-dpm-icon {
        width: 38.5px;
        height: 38.5px;
        margin-top: 10px;

        svg {
          filter: invert();
        }
      }
    }

    .dbr-option-column-1,
    .dbr-option-column-4 {
      position: relative;
      justify-content: start;
      padding-left: 18px;
      background-color: #222222;
      cursor: pointer;

      .dbr-option-title {
        margin-top: 1.4vh;
        font-size: 18px;
      }

      .dbr-option-desc {
        width: 82.6%;
        font-size: 12px;
        font-family: "OpenSans-Regular";
        margin-top: 2.5vh;
      }

      &:hover {
        background-color: #2e2e2e;
      }
    }

    .dbr-option-column-2,
    .dbr-option-column-3 {
      .dbr-option-item {
        height: 43.3%;
        background-color: #222222;
        border: 1px solid transparent;
        padding-left: 18px;
        cursor: pointer;

        &:hover {
          background-color: #2e2e2e;
        }
      }

      .dbr-option-item-1,
      .dbr-option-item-2 {
        position: relative;
      }
    }
  }

  // ipad or mobile
  @media (max-width: 980px) {
    display: none;
  }
}
</style>
