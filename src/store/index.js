import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const COMMON1D = ['code39', 'code128', 'code93', 'codabar', 'ean13', 'ean8', 'upca', 'upce', 'industrial25', 'code39extended', 'itf', 'msicode'];
const COMMON2D = ['qrcode', 'pdf417', 'datamatrix'];
const GENERAL1D = ['code39', 'code128', 'code93', 'codabar', 'itf', 'ean13', 'ean8', 'upca', 'upce', 'industrial25', 'code39extended', 'msicode'];
const GENERAL2D = ['qrcode', 'pdf417', 'datamatrix'];
const VIN1D = ['code39', 'code128', 'code93', 'code39extended', 'codabar', 'itf', 'industrial25'];
const VIN2D = ['qrcode', 'datamatrix'];
const DL = ['pdf417'];
const DPM = ['datamatrix'];
export default new Vuex.Store({
  state: {
    isDecodingFile: false,
    // guide part
    isStartScanning: false,
    guideSelection: "common1d",
    // use case part
    isShowUseCasePopover: false,
    selectedUseCase: "general",
    previousSelected1d: [],
    previousSelected2d: [],
    previousSelectedOther: [],
    enableSelectBarcode: true,
    previousIsNotGeneral: false,
    // barcode format part  
    isShowBarcodeFormatPopover: false,
    all1dBarcodes: null,
    all2dBarcodes: null,
    allOtherBarcodes: null,
    selected1dBarcodes: [],
    selected2dBarcodes: [],
    selectedOtherBarcodes: [],
    // full image localization part
    isFullImageLocalization: false,
    // scan modes part
    isShowScanSettingsPopover: false,
    singleOrMul: 'single',
    scanMode: 'bestSpeed',
    invertColourOn: false,
    soundEffectsOn: true,
    isChanged: false,
    isShowSettings: false,
    runtimeSettings: "",
    isShowEmailInput: false,
    currentResolution: []
  },
  getters: {
    selectedBarcodes: state => {
      return state.selected1dBarcodes.concat(state.selected2dBarcodes).concat(state.selectedOtherBarcodes);
    }
  },
  mutations: {
    startDecodingFile(state) {
      state.isDecodingFile = true;
    },
    finishDecodingFile(state) {
      state.isDecodingFile = false;
    },

    // guide part
    startScanning(state, guideSelection) {
      state.isStartScanning = true;
      state.guideSelection = guideSelection;
      switch (state.guideSelection) {
        case "common-oned":
          this.commit("onSelectedUseCaseChange", 'general');
          state.selected1dBarcodes = COMMON1D.slice();
          state.selected2dBarcodes = [];
          state.selectedOtherBarcodes = [];
          state.enableSelectBarcode = true;
          state.previousIsNotGeneral = false;
          break;
        case "common-twod":
          this.commit("onSelectedUseCaseChange", 'general');
          state.selected1dBarcodes = [];
          state.selected2dBarcodes = COMMON2D.slice();
          state.selectedOtherBarcodes = [];
          state.enableSelectBarcode = true;
          state.previousIsNotGeneral = false;
          break;
        case "common-oned-twod":
          this.commit("onSelectedUseCaseChange", 'general');
          state.selected1dBarcodes = GENERAL1D.slice();
          state.selected2dBarcodes = GENERAL2D.slice();
          state.selectedOtherBarcodes = [];
          state.enableSelectBarcode = true;
          state.previousIsNotGeneral = false;
          break;
        case "driver-license":
          this.commit("onSelectedUseCaseChange", 'dl');
          break;
        case "vin":
          this.commit("onSelectedUseCaseChange", 'vin');
          break;
        case "dpm":
          this.commit("onSelectedUseCaseChange", 'dpm');
          break;
        default:
          break;
      }
    },

    // use case part
    switchUseCasePopover(state) {
      state.isShowUseCasePopover = !state.isShowUseCasePopover;
      state.isShowBarcodeFormatPopover = false;
      state.isShowScanSettingsPopover = false;
    },
    hideUseCasePopover(state) {
      state.isShowUseCasePopover = false;
    },
    onSelectedUseCaseChange(state, newValue) {
      state.runtimeSettings = "";
      state.isShowSettings = false;
      state.selectedUseCase = newValue;
      if (state.selectedUseCase === 'general') {
        if (state.previousIsNotGeneral) {
          state.selected1dBarcodes = GENERAL1D.slice();
          state.selected2dBarcodes = GENERAL2D.slice();
          state.selectedOtherBarcodes = [];
        }
        state.enableSelectBarcode = true;
        state.previousIsNotGeneral = false;
      }
      else if (state.selectedUseCase === 'vin') {
        // change selected barcode format
        state.selected1dBarcodes = VIN1D.slice();
        state.selected2dBarcodes = VIN2D.slice();
        state.selectedOtherBarcodes = [];
        // set single
        this.commit("singleOrMulSwitch", "single");
        // set scan mode
        this.commit("scanModeSwitch", "bestSpeed");
        // set invert colour off
        this.commit("invertColourSwitch", "false");

        state.enableSelectBarcode = false;
        state.previousIsNotGeneral = true;
      }
      else if (state.selectedUseCase === "dl") {
        // change selected barcode format
        state.selected1dBarcodes = [];
        state.selected2dBarcodes = DL.slice();
        state.selectedOtherBarcodes = [];
        // set single
        this.commit("singleOrMulSwitch", "single");
        // set scan mode
        this.commit("scanModeSwitch", "bestSpeed");
        // set invert colour off
        this.commit("invertColourSwitch", "false");

        state.enableSelectBarcode = false;
        state.previousIsNotGeneral = true;
      }
      else if (state.selectedUseCase === "dpm") {
        // change selected barcode format
        state.selected1dBarcodes = [];
        state.selected2dBarcodes = DPM.slice();
        state.selectedOtherBarcodes = [];

        state.enableSelectBarcode = false;
        state.previousIsNotGeneral = true;
      }
    },

    // barcode format part
    switchBarcodeFormatPopover(state) {
      state.isShowBarcodeFormatPopover = !state.isShowBarcodeFormatPopover;
      state.isShowUseCasePopover = false;
      state.isShowScanSettingsPopover = false;
    },
    hideBarcodeFormatPopover(state) {
      state.isShowBarcodeFormatPopover = false;
    },
    getAll1dBarcodes(state, resource) {
      state.all1dBarcodes = new Set();
      for (let i of resource) {
        for (let j of i) {
          state.all1dBarcodes.add(j.value);
        }
      }
    },
    getAll2dBarcodes(state, resource) {
      state.all2dBarcodes = new Set();
      for (let i of resource) {
        for (let j of i) {
          state.all2dBarcodes.add(j.value);
        }
      }
    },
    getAllOtherBarcodes(state, resource) {
      state.allOtherBarcodes = new Set();
      for (let i of resource) {
        for (let j of i) {
          state.allOtherBarcodes.add(j.value);
        }
      }
    },
    onCheckAll1dBarcodeChange(state, isChecked) {
      if (isChecked) {
        state.selected1dBarcodes = Array.from(state.all1dBarcodes);
      } else {
        state.selected1dBarcodes = []
      }
    },
    onCheckAll2dBarcodeChange(state, isChecked) {
      if (isChecked) {
        state.selected2dBarcodes = Array.from(state.all2dBarcodes);
      } else {
        state.selected2dBarcodes = []
      }
    },
    onCheckAllOtherBarcodeChange(state, isChecked) {
      if (isChecked) {
        state.selectedOtherBarcodes = Array.from(state.allOtherBarcodes);
      } else {
        state.selectedOtherBarcodes = []
      }
    },
    onSelected1dBarcodesChange(state, newValue) {
      state.selected1dBarcodes = newValue;
    },
    onSelected2dBarcodesChange(state, newValue) {
      state.selected2dBarcodes = newValue;
    },
    onSelectedOtherBarcodesChange(state, newValue) {
      state.selectedOtherBarcodes = newValue;
    },

    // full image localization part
    switchFullImageLocalization(state) {
      state.isFullImageLocalization = !state.isFullImageLocalization;
    },

    // scan modes part
    switchScanSettingsPopover(state) {
      state.isShowScanSettingsPopover = !state.isShowScanSettingsPopover;
      state.isShowUseCasePopover = false;
      state.isShowBarcodeFormatPopover = false;
    },

    hideScanSettingsPopover(state) {
      state.isShowScanSettingsPopover = false;
    },
    singleOrMulSwitch(state, newValue) {
      state.singleOrMul = newValue;
    },
    scanModeSwitch(state, newValue) {
      state.scanMode = newValue;
    },
    invertColourSwitch(state, newValue) {
      if (newValue === "true") {
        state.invertColourOn = true;
      } else if (newValue === "false") {
        state.invertColourOn = false;
      }
    },
    soundEffectsSwitch(state, newValue) {
      if (newValue === "true") {
        state.soundEffectsOn = true;
      } else if (newValue === "false") {
        state.soundEffectsOn = false;
      }
    },
  },
  actions: {
  },
  modules: {
  }
})
