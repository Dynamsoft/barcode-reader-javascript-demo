import { defineStore } from "pinia";

type AllowNameSet = "1d" | "2d" | "1d2d" | "vin" | "dl" | "dpm";
type TypeUseCase = "general" | "vin" | "dl" | "dpm";

export const useUseCaseStore = defineStore("useCase", {
  state: (): { useCaseName: AllowNameSet } => {
    return {
      useCaseName: "1d2d",
    };
  },
  actions: {
    changeUseCase(useCaseName: AllowNameSet) {
      this.$state.useCaseName = useCaseName;
    },
  },
  getters: {
    isGeneral(state) {
      return ["1d", "2d", "1d2d"].includes(state.useCaseName);
    },
  },
});

export type { AllowNameSet, TypeUseCase };
