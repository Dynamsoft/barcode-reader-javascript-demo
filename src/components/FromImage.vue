<template>
  <div class="fromImage" @click="trigger">
    <input @change="onIptChange" ref="uploadImage" type="file" :accept="supportedImgFormat.toString()" style="display: none"/>
    <img src="../assets/image/Images-add.svg" alt="images-add" />
  </div>
</template>

<script>
import Vue from "vue";
import {BarcodeReader,EnumDPMCodeReadingMode,EnumLocalizationMode,EnumGrayscaleTransformationMode,EnumIntermediateResultType} from "dynamsoft-javascript-barcode";
import { CodeParser } from "dynamsoft-code-parser";
import BarcodeFormatMap from "../assets/enum/BarcodeFormatMap.js";
import BarcodeFormatMap_2 from "../assets/enum/BarcodeFormatMap_2.js";

export default Vue.extend({
  name: "FromImage",
  props: ["isUploadImage"],
  data() {
    return {
      reader: null,
      parser: null,
      visible: false,
      currentImg: null,
      changeRuntimeSettingsTimeoutId: null,
      resultsInfo: [],
      supportedImgFormat: ["image/jpeg", "image/png", "image/bmp", "image/gif", "image/svg+xml", "image/x-icon", "image/webp"]
    };
  },
  async mounted() {
    if (["iPhone", "iPad", "Mac"].includes(BarcodeReader.browserInfo.OS)) {
      this.supportedImgFormat.push("image/tiff");
    }
    this.reader || (this.reader = await BarcodeReader.createInstance());
    window.reader = this.reader;
    if (BarcodeReader._bUseFullFeature) {
      await this.changeSettings();
    }
  },
  methods: {
    async onIptChange(event) {
      this.$emit("clearResultsCvs");
      try {
        this.resultsInfo = [];
        let input = event.target;
        let file = input.files[0];
        
        if(!this.supportedImgFormat.includes(file.type)) {
          const message = `Sorry, the file format you selected is unsupported. Please select a file in JPEG, PNG, BMP, GIF, SVG, ICON${this.supportedImgFormat.includes("image/tiff")?", TIFF":""} or WebP format.`;
          this.$message.error({content: message, duration: 3});
          return;
        }

        let resultInfo = {
          fileName: "",
          results: [],
        };
        this.reader.ifSaveOriginalImageInACanvas = true;
        resultInfo.fileName = file.name;
        this.$store.commit("startDecodingFile");
        this.$emit("removeDLResults");

        // show tip
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
            let jsonRes = await this.parser.parseData(result.barcodeBytes);
            if(jsonRes.exception) {
              resultInfo.parseFailed = true;
              resultInfo.results = [];
              resultInfo.barcodeText = result.barcodeText;
            } else {
              resultInfo.results.push({
                barcodeFormat: barcodeFormat,
                json: JSON.stringify(jsonRes),
                text: result.barcodeText
              });
            }
          } else {
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
        runtimeSettings.furtherModes.grayscaleTransformationModes = [this.invertColourOn ? EnumGrayscaleTransformationMode.GTM_INVERTED : EnumGrayscaleTransformationMode.GTM_ORIGINAL,0,0,0,0,0,0,0,];
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
        this.singleOrMul === "single" ? (runtimeSettings.expectedBarcodesCount = 1) : (runtimeSettings.expectedBarcodesCount = 512);
        await this.reader.updateRuntimeSettings(runtimeSettings);
        return runtimeSettings;
      }
    },
    async reDecodeCurImage() {
      this.$emit("clearResultsCvs");
      try {
        this.resultsInfo = [];
        let resultInfo = {results: []};
        this.$store.commit("startDecodingFile");
        this.$emit("removeDLResults");
        // show tip
        let config = {};
        config.content = "Decoding...";
        config.icon = (<a-icon type="loading" style={{ color: "#FE8E14" }}></a-icon>);
        config.duration = 0;
        this.$message.open(config);
        let results = await this.reader.decode(this.currentImg);
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
            let jsonRes = await this.parser.parseData(result.barcodeBytes);
            if(jsonRes.exception) {
              resultInfo.parseFailed = true;
              resultInfo.results = [];
              resultInfo.barcodeText = result.barcodeText;
            } else {
              resultInfo.results.push({
                barcodeFormat: barcodeFormat,
                json: JSON.stringify(jsonRes),
                text: result.barcodeText
              });
            }
          } else {
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
      } catch (ex) {
        this.resultsInfo.push(ex.message);
        console.error(ex);
      }
    },
    async changeSettingsAndReDecode() {
      await this.changeSettings();
      if(this.isUploadImage && this.currentImg) {
        await this.reDecodeCurImage();
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
    },
    singleOrMul() {
      return this.$store.state.singleOrMul;
    },
  },
  watch: {
    selectedBarcodes() {
      this.changeSettingsAndReDecode();
    },
    invertColourOn() {
      this.changeSettingsAndReDecode();
    },
    scanMode() {
      this.changeSettingsAndReDecode();
    },
    singleOrMul() {
      this.changeSettingsAndReDecode();
    },
  }
});
</script>

<style scoped>
.fromImage {width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;}
.fromImage img {height: 50%;}

.currentImg, .currentImg img {width: 100%;height: 100%;}
</style>
