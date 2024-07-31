import { defineStore } from "pinia";

export const usePopoverOpenStore = defineStore("popoverOpen", {
  state: (): {
    useCaseSelector: boolean;
    formatSelector: boolean;
    settingsController: boolean;
  } => {
    return {
      useCaseSelector: false,
      formatSelector: false,
      settingsController: false,
    };
  },
  actions: {
    updatePopoverStore(useCaseSelector: boolean, formatSelector: boolean, settingsController: boolean) {
      this.$state.useCaseSelector = useCaseSelector;
      this.$state.formatSelector = formatSelector;
      this.$state.settingsController = settingsController;
    },
  },
});
