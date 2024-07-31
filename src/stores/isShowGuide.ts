import { defineStore } from "pinia";

export const useIsShowGuideStore = defineStore("isShowGuide", {
  state: (): { isShowGuide: boolean } => {
    return {
      isShowGuide: false,
    };
  },
  actions: {
    updateIsShowGuide(value: boolean) {
      this.$state.isShowGuide = value;
    },
  },
});
