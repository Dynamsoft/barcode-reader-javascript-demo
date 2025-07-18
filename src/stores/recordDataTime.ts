import { defineStore } from "pinia";
import { AllowNameSet, TypeUseCase } from "./useCase";
import { EnumResolution } from "../assets/enum/Resolution";

export const useRecordDataTimeStore = defineStore("recordDataTime", {
  state: (): {
    startUseCaseTime: number;
    endUseCaseTime: number;
    endMainTime: number;
    startResolutionTime: number;
    endResolutionTime: number;
    mainPageTime: number;
    startMainTime: number;
    useCaseTime: {
      general: number;
      vin: number;
      dl: number;
      dpm: number;
    },
    resolutionUsedTime: {
      HD: number;
      "FULL HD": number;
    },
    scanSuccessfullyList: string[]
  } => {
    return {
      startUseCaseTime: 0,
      endUseCaseTime: 0,
      endMainTime: 0,
      startResolutionTime: 0,
      endResolutionTime: 0,
      mainPageTime: 0,
      startMainTime: 0,
      useCaseTime: {
        general: 0,
        vin: 0,
        dl: 0,
        dpm: 0
      },
      resolutionUsedTime: {
        HD: 0,
        "FULL HD": 0
      },
      scanSuccessfullyList: []
    };
  },
  actions: {
    updateDataTime(type: Exclude<keyof typeof this.$state, "useCaseTime" | "resolutionUsedTime" | "scanSuccessfullyList">, time: number) {
      this[type] = time;
    },
    updateUseCaseTime(useCaseName: TypeUseCase, time: number) {
      this.useCaseTime[useCaseName] += time;
    },
    updateResolutionUsedTime(resolution: EnumResolution, time: number) {
      this.resolutionUsedTime[resolution] += time;
    },
    updateScanSuccessfullyList(useCaseName: AllowNameSet) {
      if (!this.scanSuccessfullyList.includes(useCaseName)) {
        this.scanSuccessfullyList.push(useCaseName);
      }
    }
  },
  getters: {
    useCaseRecordTime(state) {
      return state.endUseCaseTime - state.startUseCaseTime;
    },
    mainPageRecordTime(state) {
      return state.endMainTime - state.startMainTime;
    },
    resolutionRecordTime(state) {
      return state.endResolutionTime - state.startResolutionTime;
    }
  }
});
