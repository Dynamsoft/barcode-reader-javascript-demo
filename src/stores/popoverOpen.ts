import { defineStore } from "pinia";

export const usePopoverOpenStore = defineStore("popoverOpen", {
  state: (): {
    formatSelector: boolean;
    settingsController: boolean;
  } => {
    return {
      formatSelector: false,
      settingsController: false,
    };
  },
  actions: {
    updatePopoverStore(formatSelector: boolean, settingsController: boolean) {
      this.$state.formatSelector = formatSelector;
      this.$state.settingsController = settingsController;
    },
    
  },
});
