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
import DBR from "../dbr";
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
    };
  },
  async mounted() {
    this.reader || (this.reader = await DBR.BarcodeReader.createInstance());
    if (DBR.BarcodeReader._bUseFullFeature) {
      let runtimeSettings = await this.reader.getRuntimeSettings();
      runtimeSettings.barcodeFormatIds = DBR.EnumBarcodeFormat.BF_ALL =
        -31457281;
      for (let i in DBR.EnumBarcodeFormat_2) {
        runtimeSettings.barcodeFormatIds_2 |= DBR.EnumBarcodeFormat_2[i];
      }
      runtimeSettings.furtherModes.dpmCodeReadingModes[0] =
        DBR.EnumDPMCodeReadingMode.DPMCRM_GENERAL;
      let locModes = runtimeSettings.localizationModes;
      for (let i in locModes) {
        if (locModes[i] == DBR.EnumLocalizationMode.LM_STATISTICS_MARKS) {
          break;
        }
        if (locModes[i] == 0) {
          locModes[i] = DBR.EnumLocalizationMode.LM_STATISTICS_MARKS;
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
