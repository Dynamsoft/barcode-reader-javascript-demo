<template>
  <div class="fromImage" @click="trigger">
    <input
      v-on:change="onIptChange"
      ref="uploadImage"
      type="file"
      accept="image/png,image/jpeg,image/bmp,image/gif"
      style="display: none"
    />
    <!-- style="width: 1px; height: 1px" -->
    <img src="../assets/image/add-image.svg" alt="" />

    <!-- <a-modal title="Result" :visible="visible" cancelText="" :closable="false">
      <ul class="content">
        <li v-for="(item, fileIndex) in resultsInfo" :key="fileIndex"> -->
    <!-- {{ fileIndex + 1 + "." + item.fileName + ":" }} -->
    <!-- <ul>
            <li
              v-for="(result, resultIndex) in item.results"
              :key="resultIndex"
            >
              <span>
                {{ result.barcodeFormat + ":" }}
              </span>
              <span class="resultText" :data-clipboard-text="result.text">
                {{ result.text }}
                <a-icon type="copy" @click="copyResult()" />
              </span>
            </li>
          </ul>
        </li>
        <div class="currentImg">
          <img :src="currentImg" alt="" />
        </div>
      </ul>
      <template slot="footer">
        <a-button type="primary" @click="handleCancel"> OK </a-button>
      </template>
    </a-modal> -->
  </div>
</template>

<script >
import Vue from "vue";
import {BarcodeReader,EnumDPMCodeReadingMode,EnumLocalizationMode,EnumGrayscaleTransformationMode} from "dynamsoft-javascript-barcode";
import BarcodeFormatMap from "../assets/enum/BarcodeFormatMap.js";
import BarcodeFormatMap_2 from "../assets/enum/BarcodeFormatMap_2.js";
import Clipboard from "clipboard";

export default Vue.extend({
  name: "FromImage",
  components: {},
  data() {
    return {
      reader: null,
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
      let _this = this;
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
          // render uploaded image
          let fr = new FileReader();
          fr.readAsDataURL(file);
          // eslint-disable-next-line no-unused-vars
          fr.onload = function (e) {
            _this.currentImg = this.result;
          };

          resultInfo.fileName = file.name;
          this.$store.commit("startDecodingFile");
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
          for (let result of results) {
            let barcodeFormat = "";
            if (result.barcodeFormatString.includes("No Barcode Format")) {
              barcodeFormat = result.barcodeFormatString_2;
            } else {
              barcodeFormat = result.barcodeFormatString;
            }
            resultInfo.results.push({
              barcodeFormat: barcodeFormat,
              text: result.barcodeText,
            });
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
          } else {
            this.$emit("showResults", this.resultsInfo, this.currentImg);
            config.content = "Complete!";
            config.duration = 1;
            config.icon = (
              <a-icon type="smile" style={{ color: "#FE8E14" }}></a-icon>
            );
            // this.visible = true;
            // config = {};
            // config.content = "Complete!";
            // config.duration = 1;
            // config.icon = (
            //   <a-icon type="smile" style={{ color: "#FE8E14" }}></a-icon>
            // );
          }
          this.$message.open(config);
        }
        this.$store.commit("finishDecodingFile");
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
  },
  asyncComputed: {
    runtimeSettings: {
      async get() {
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
            await this.reader.updateRuntimeSettings(runtimeSettings);
            return runtimeSettings;
          }, 500);
        }
      },
      watch: [
        "selectedBarcodes",
        "invertColourOn",
        "scanMode",
      ],
    },
  },
  computed: {
    selectedBarcodes() {
      return this.$store.getters.selectedBarcodes;
    },
    invertColourOn() {
      return this.$store.state.invertColourOn;
    },
    scanMode() {
      return this.$store.state.scanMode;
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
