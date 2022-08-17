<template>
  <div class="fromImage" @click="trigger">
    <input
      v-on:change="onIptChange"
      ref="uploadImage"
      type="file"
      accept="image/png,image/jpeg,image/bmp,image/gif"
      style="display: none"
    />
    <img src="../assets/image/add-image.svg" alt="" />
  </div>
</template>

<script >
import Vue from "vue";
import {BarcodeReader,EnumDPMCodeReadingMode,EnumLocalizationMode,EnumGrayscaleTransformationMode} from "dynamsoft-javascript-barcode";
import { CodeParser } from "dynamsoft-code-parser";
import BarcodeFormatMap from "../assets/enum/BarcodeFormatMap.js";
import BarcodeFormatMap_2 from "../assets/enum/BarcodeFormatMap_2.js";
import Clipboard from "clipboard";

export default Vue.extend({
  name: "FromImage",
  components: {},
  data() {
    return {
      reader: null,
      parser: null,
      resultsInfo: [],
      visible: false,
      currentImg: null,
      changeRuntimeSettingsTimeoutId: null,
    };
  },
  async mounted() {
    this.reader || (this.reader = await BarcodeReader.createInstance());
    if (BarcodeReader._bUseFullFeature) {
      let runtimeSettings = await this.reader.getRuntimeSettings();
      runtimeSettings.barcodeFormatIds = 0;
      runtimeSettings.barcodeFormatIds_2 = 0;
      let newValue = this.selectedBarcodes;
      for (let i = 0; i < newValue.length; i++) {
        let n1 = BarcodeFormatMap.get(newValue[i]);
        let n2 = BarcodeFormatMap_2.get(newValue[i]);
        if (n1 !== undefined) {
          runtimeSettings.barcodeFormatIds |= n1;
        }
        if (n2 !== undefined) {
          runtimeSettings.barcodeFormatIds_2 |= n2;
        }
      }
      runtimeSettings.furtherModes.dpmCodeReadingModes[0] = EnumDPMCodeReadingMode.DPMCRM_GENERAL;
      let locModes = runtimeSettings.localizationModes;
      for (let i in locModes) {
        if (locModes[i] == EnumLocalizationMode.LM_STATISTICS_MARKS) {
          break;
        }
        if (locModes[i] == 0) {
          locModes[i] = EnumLocalizationMode.LM_STATISTICS_MARKS;
          break;
        }
      }
      await this.reader.updateRuntimeSettings(runtimeSettings);
    }
  },
  methods: {
    copyResult() {
      let clipboard = new Clipboard(".resultText");
      clipboard.on("success", () => {
        let config = {};
        config.content = "Copied!";
        config.duration = 1;
        config.icon = (
          <a-icon type="smile" style={{ color: "#FE8E14" }}></a-icon>
        );
        this.$message.open(config);
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        let config = {};
        config.content = "Failed!";
        config.icon = (
          <a-icon type="frown" style={{ color: "#FE8E14" }}></a-icon>
        );
        this.$message.open(config);
        clipboard.destroy();
      });
    },
    async onIptChange(event) {
      this.$emit("clearResultsCvs");
      try {
        this.resultsInfo = [];
        let input = event.target;
        let files = input.files;
        for (let i = 0; i < files.length; ++i) {
          let file = files[i];
          let resultInfo = {
            fileName: "",
            results: [],
          };
          this.reader.ifSaveOriginalImageInACanvas = true;
          resultInfo.fileName = file.name;
          this.$store.commit("startDecodingFile");
          this.$emit("removeDLResults");

          // show tip
          this.$message.destroy();
          let config = {};
          config.content = "Decoding...";
          config.icon = (
            <a-icon type="loading" style={{ color: "#FE8E14" }}></a-icon>
          );
          config.duration = 0;
          this.$message.open(config);
          let results = await this.reader.decode(file);
          let cvs = this.reader.getOriginalImageInACanvas();
          cvs.style.width = "100%";
          cvs.style.height = "100%";
          cvs.style.objectFit = "contain";
          this.currentImg = cvs;
          for(let result of results) {
            let barcodeFormat = "";
            if (result.barcodeFormatString.includes("No Barcode Format")) {
              barcodeFormat = result.barcodeFormatString_2;
            }else {
              barcodeFormat = result.barcodeFormatString;
            }
            if(this.selectedUseCase === "dl" && result.barcodeFormatString === "PDF417" && result.barcodeFormatString_2.includes("No Barcode Format")){
              if(!this.parser) {
                this.parser = await CodeParser.createInstance();
              }
              resultInfo.results.push({
                barcodeFormat: barcodeFormat,
                json: JSON.stringify(await this.parser.parseData(result.barcodeBytes)),
                text: result.barcodeText
              });
            }
            else {
              resultInfo.results.push({
                barcodeFormat: barcodeFormat,
                text: result.barcodeText,
              });
            }
          }
          this.resultsInfo.push(resultInfo);
          this.$message.destroy();
          if (results.length === 0) {
            config = {};
            config.content = "No barcodes found!";
            config.icon = (
              <a-icon type="close" style={{ color: "#FE8E14" }}></a-icon>
            );
            config.duration = 1;
            this.$store.commit("finishDecodingFile");
            this.$emit("clearResultList");
          } else {
            config.content = "Complete!";
            config.duration = 1;
            config.icon = (
              <a-icon type="smile" style={{ color: "#FE8E14" }}></a-icon>
            );
          }
          this.$emit("showResults", this.resultsInfo, this.currentImg, results);
          this.$message.open(config);
        }
        input.value = "";
      } catch (ex) {
        this.resultsInfo.push(ex.message);
        console.error(ex);
      }
    },
    handleCancel() {
      this.visible = false;
    },
    trigger() {
      this.$refs.uploadImage.click();
    },
    async changeSettings() {
      if(this.reader) {
        let runtimeSettings = null;
        this.changeRuntimeSettingsTimeoutId && clearTimeout(this.changeRuntimeSettingsTimeoutId);
        this.changeRuntimeSettingsTimeoutId = setTimeout(async () => {
          // scan mode
          if (this.scanMode === "bestSpeed") {
            await this.reader.updateRuntimeSettings("speed");
          } else if (this.scanMode === "balance") {
            await this.reader.updateRuntimeSettings("balance");
          } else if (this.scanMode === "bestCoverage") {
            await this.reader.updateRuntimeSettings("coverage");
          }
          runtimeSettings = await this.reader.getRuntimeSettings();
          // colour invert
          runtimeSettings.furtherModes.grayscaleTransformationModes = [
            this.invertColourOn
              ? EnumGrayscaleTransformationMode.GTM_INVERTED
              : EnumGrayscaleTransformationMode.GTM_ORIGINAL,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ];
          // barcode format part
          runtimeSettings.barcodeFormatIds = 0;
          runtimeSettings.barcodeFormatIds_2 = 0;
          let newValue = this.selectedBarcodes;
          for (let i = 0; i < newValue.length; i++) {
            let n1 = BarcodeFormatMap.get(newValue[i]);
            let n2 = BarcodeFormatMap_2.get(newValue[i]);
            if (n1 !== undefined) {
              runtimeSettings.barcodeFormatIds |= n1;
            }
            if (n2 !== undefined) {
              runtimeSettings.barcodeFormatIds_2 |= n2;
            }
          }
          if (this.selectedUseCase === "vin") {
            runtimeSettings.localizationModes = [32, 8, 2, 0, 0, 0, 0, 0];
            runtimeSettings.deblurLevel = 9;
            runtimeSettings.scaleDownThreshold = 100000;
            runtimeSettings.furtherModes.barcodeColourModes = [1, 2, 32, 0, 0, 0, 0, 0];
          } else if (this.selectedUseCase === "dl") {
            runtimeSettings.localizationModes = [16, 8, 2, 0, 0, 0, 0, 0];
            runtimeSettings.deblurLevel = 9;
            runtimeSettings.minResultConfidence = 0;
          } else if (this.selectedUseCase === "dpm") {
            runtimeSettings.furtherModes.dpmCodeReadingModes[0] =
              EnumDPMCodeReadingMode.DPMCRM_GENERAL;
            let locModes = runtimeSettings.localizationModes;
            for (let i in locModes) {
              if (locModes[i] == EnumLocalizationMode.LM_STATISTICS_MARKS) {
                break;
              }
              if (locModes[i] == 0) {
                locModes[i] = EnumLocalizationMode.LM_STATISTICS_MARKS;
                break;
              }
            }
          }
          await this.reader.updateRuntimeSettings(runtimeSettings);
          return runtimeSettings;
        }, 500);
      }
    }
  },
  computed: {
    selectedUseCase() {
      return this.$store.state.selectedUseCase;
    },
    selectedBarcodes() {
      return this.$store.getters.selectedBarcodes;
    },
    invertColourOn() {
      return this.$store.state.invertColourOn;
    },
    scanMode() {
      return this.$store.state.scanMode;
    }
  },
  watch: {
    async selectedBarcodes() {
      this.changeSettings();
    },
    invertColourOn() {
      this.changeSettings();
    },
    scanMode() {
      this.changeSettings();
    },
  }
});
</script>

<style scoped>
.fromImage {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fromImage img {
  height: 50%;
}

.currentImg {
  width: 100%;
  height: 100%;
}

.currentImg img {
  width: 100%;
  height: 100%;
}
</style>
