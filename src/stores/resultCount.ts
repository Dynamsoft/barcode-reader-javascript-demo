import { defineStore } from "pinia";
import { BarcodeResultItem } from "dynamsoft-barcode-reader-bundle";

const resultCountMap = new Map();

export const useResultCountStore = defineStore("resultCount", {
  state: (): Map<string, { format: string; text: string; count: number; timer: any }> => {
    return resultCountMap;
  },
  actions: {
    updateResultCount(items: Array<BarcodeResultItem>) {
      for (let item of items) {
        const format = item.formatString;
        const text = item.text;
        const formatConcatText = format + text;
        let map_getObj = this.$state.get(formatConcatText);
        if (!map_getObj) {
          this.$state.set(formatConcatText, { format, text, count: 1, timer: null });
        } else {
          map_getObj.count++;
        }
        map_getObj = this.$state.get(formatConcatText);
        map_getObj!.timer && clearTimeout(map_getObj!.timer);
        map_getObj!.timer = setTimeout(() => {
          this.$state.delete(formatConcatText);
        }, 3000);
      }
    },
  },
});
