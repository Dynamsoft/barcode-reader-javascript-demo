<template>
  <div class="scanSettingsBtn" @mouseenter="$store.state.curSystem === 'Windows' && !$store.state.isShowScanSettingsPopover && $store.commit('switchScanSettingsPopover')" @click.stop="!($store.state.curSystem === 'Windows') && $store.commit('switchScanSettingsPopover')">
    <a-popover :placement="popoverPlacement" :visible="$store.state.isShowScanSettingsPopover">
      <template slot="content">
        <div class="scanSettingsOptions" @click.stop="">
          <div class="optionRows" v-show="!isShowSettings" :style="{'padding-top': $store.state.selectedUseCase === 'general' ? '25px' : '5px'}">
            <div class="optionRow1 optionRow" v-show="$store.state.selectedUseCase === 'general'">
              <div class="optionText">
                <div class="title">Single/Multi Barcode Scanning</div>
              </div>
              <div class="optionBtns">
                <label class="optionBtn" :class="{ selected: singleOrMul === 'single' }">
                  <input type="radio" name="optionRow1" class="optionBtn" value="single" v-model="singleOrMul"/>
                  Single
                </label>
                <label class="optionBtn" :class="{ selected: singleOrMul === 'multiple' }">
                  <input type="radio" name="optionRow1" class="optionBtn" value="multiple" v-model="singleOrMul"/>
                  Multiple
                </label>
              </div>
            </div>
            <div class="optionRow2 optionRow" v-show="$store.state.selectedUseCase === 'general'">
              <div class="optionText">
                <div class="title">Scan Mode</div>
              </div>
              <div class="optionBtns">
                <label class="optionBtn" :class="{ selected: scanMode === 'bestSpeed' }">
                  <input type="radio" name="optionRow2" class="optionBtn" value="bestSpeed" v-model="scanMode"/>
                  Best Speed
                </label>
                <label class="optionBtn" :class="{ selected: scanMode === 'balance' }">
                  <input type="radio" name="optionRow2" class="optionBtn" value="balance" v-model="scanMode"/>
                  Balance
                </label>
                <label class="optionBtn" :class="{ selected: scanMode === 'bestCoverage' }">
                  <input type="radio" name="optionRow2" class="optionBtn" value="bestCoverage" v-model="scanMode"/>
                  Best Coverage
                </label>
              </div>
            </div>
            <div class="optionRow3 optionRow">
              <div class="optionText">
                <div class="title">Barcode Colour Option</div>
                <div class="shortIntro">
                  Scan light barcodes on dark background
                </div>
              </div>
              <div class="optionBtns barcodeBtns">
                <div style="display: flex;">
                  <label class="optionBtn" style="margin-right: 0" :class="{ selected: invertColourOn === 'true' }">
                    <input ref="enableBtn" type="radio" name="optionRow3" class="optionBtn" value="true" v-model="invertColourOn"/>
                    Inverted
                  </label>
                  <div @click="enableClick" style="height: 40px;width: 80px;padding: 5px 0;margin-right: 10px;background-color: black;">
                    <img src="../../assets/image/barcode.svg" alt="" style="width: 100%; height: 100%; cursor: pointer"/>
                  </div>
                </div>
                <div style="display: flex">
                  <label class="optionBtn" style="margin-right: 0" :class="{ selected: invertColourOn === 'false' }">
                    <input ref="disableBtn" type="radio" name="optionRow3" class="optionBtn" value="false" v-model="invertColourOn"/>
                    Normal
                  </label>
                  <div @click="disableClick" style="height: 40px;width: 80px;padding: 5px 0;background-color: white;">
                    <img src="../../assets/image/barcode.svg" alt="" style="cursor: pointer;width: 100%;height: 100%;color: black;-webkit-filter: invert(100%);"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="camera-settings" v-show="!isUploadImage && !isShowSettings">
            <div class="autoZoom">
              <div class="cs-title" :style="{'opacity': !bScannerCreated ? 0.2 : 1}">Auto Zoom</div>
              <a-switch @change="$store.commit('autoZoomSwitch', !$store.state.autoZoom)" :disabled="!bScannerCreated"/>
            </div>
          </div>
          <div class="settingsContainer" v-show="isShowSettings">
            <!-- <svg @click="$store.state.isShowSettings = false" t="1661248862703" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4901" width="25" height="25"><path d="M509.92 475.968l74.032-74.032a16 16 0 0 1 22.624 0l11.312 11.312a16 16 0 0 1 0 22.64L543.84 509.92l74.032 74.032a16 16 0 0 1 0 22.624l-11.312 11.312a16 16 0 0 1-22.624 0L509.92 543.84l-74.032 74.032a16 16 0 0 1-22.64 0l-11.312-11.312a16 16 0 0 1 0-22.624l74.032-74.032-74.032-74.032a16 16 0 0 1 0-22.64l11.312-11.312a16 16 0 0 1 22.64 0l74.032 74.032z m0 319.856c157.904 0 285.92-128 285.92-285.92C795.84 352 667.808 224 509.92 224 352 224 224 352 224 509.92c0 157.904 128 285.92 285.92 285.92z m0 48C325.504 843.84 176 694.336 176 509.92 176 325.52 325.504 176 509.92 176c184.416 0 333.92 149.504 333.92 333.92 0 184.416-149.504 333.92-333.92 333.92z" p-id="4902"></path></svg> -->
            <div class="codeArea" v-html="runtimeSettings"></div>
            <div class="footer-btns">
              <div @click="$store.state.isShowSettings = false"><a-icon type="left"/>Back</div>
              <div class="copyCode" @click="copySettings" :style="{color: isCopied ? '#FE8E14' : '#ffffff'}">{{isCopied ? "Copied" : "Copy"}}</div>
            </div>
          </div>
          <div class="optionRow5 optionRow" v-show="!isShowSettings">
            <div @click="viewSettings">View Setting Codes<svg t="1677204473794" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2865" id="mx_n_1677204473795" width="17" height="22"><path d="M723.1 483.4c-1.3-1.3-2.6-2.4-4-3.4L355.9 116c-14.6-14.6-38.4-14.6-53 0-14.6 14.6-14.6 38.5 0 53.1l340.4 341.2L302.9 851c-14.6 14.6-14.6 38.4 0 53 14.6 14.6 38.4 14.6 53 0l362.9-363.3c1.5-1.1 2.9-2.3 4.3-3.7 7.4-7.4 11-17.1 10.9-26.8 0.1-9.7-3.6-19.4-10.9-26.8z" fill="#fe8e14" p-id="2866"></path></svg></div>
          </div>
        </div>
      </template>
      <div class="sidebarBtn" :style="{color: fontAndIconColor,backgroundColor: bgColor}">
        <img src="../../assets/image/icon-web-settings.svg" alt="settings">
        <!-- <img v-show="!$store.state.enableBtn" src="../../assets/image/icon-setting-disable.svg" alt="settings-disable"> -->
        <label class="settingsLabel"> Scan Settings </label>
      </div>
    </a-popover>
  </div>
</template>

<script >
import Vue from "vue";
import Clipboard from "clipboard";
import "../../assets/css/sidebarBtn.css"; 

export default Vue.extend({
  name: "scanSettingsBtn",
  components: {},
  props:["isUploadImage", "bSupportFocus", "bScannerCreated"],
  data() {
    return {
      popoverPlacement: document.body.clientWidth > 980 ? 'rightBottom' : 'topRight',
      isCopied: false
    };
  },
  mounted() {
    document.addEventListener("click", () => {
      this.$store.commit("hideScanSettingsPopover");
    });
    window.addEventListener('resize', () => {
      if(document.body.clientWidth > 980) {
        this.popoverPlacement = 'rightBottom';
      } else {
        this.popoverPlacement = 'topRight';
      }
    })
  },
  methods: {
    enableClick() {
      this.$refs.enableBtn.click();
    },
    disableClick() {
      this.$refs.disableBtn.click();
    },
    viewSettings() {
      this.$store.state.runtimeSettings = "";
      if(!this.isUploadImage) {
        this.$store.state.runtimeSettings += `await scanner.dce.setResolution(${this.$store.state.currentResolution[0]}, ${this.$store.state.currentResolution[1]});<br>`
      }
      if (this.scanMode === "bestSpeed") {
        this.$store.state.runtimeSettings += `await ${this.scannerOrReader}.updateRuntimeSettings('speed');<br>`;
      } else if (this.scanMode === "balance") {
        this.$store.state.runtimeSettings += `await ${this.scannerOrReader}.updateRuntimeSettings('balance');<br>`;
      } else if (this.scanMode === "bestCoverage") {
        this.$store.state.runtimeSettings += `await ${this.scannerOrReader}.updateRuntimeSettings('coverage');<br>`;
      }
      
      this.$store.state.runtimeSettings += `const runtimeSettings = await ${this.scannerOrReader}.getRuntimeSettings();<br>`;
      if(this.selectedUseCase === "dl") {
        this.$store.state.runtimeSettings += `runtimeSettings.barcodeFormatIds = 0x02000000;<br>`;
        this.$store.state.runtimeSettings += `runtimeSettings.barcodeFormatIds_2 = 0;<br>`;
      } else if(this.selectedUseCase === 'vin') {
        this.$store.state.runtimeSettings += `runtimeSettings.barcodeFormatIds = 0x1 | 0x2 | 0x4 | 0x400 | 0x8 | 0x10 | 0x200 | 0x04000000 | 0x08000000;<br>`;
        this.$store.state.runtimeSettings += `runtimeSettings.barcodeFormatIds_2 = 0;<br>`;
      } else if(this.selectedUseCase === 'dpm') {
        this.$store.state.runtimeSettings += `runtimeSettings.barcodeFormatIds = 0x08000000;<br>`;
        this.$store.state.runtimeSettings += `runtimeSettings.barcodeFormatIds_2 = 0;<br>`;
      }

      this.$store.state.runtimeSettings += `runtimeSettings.expectedBarcodesCount = ${this.singleOrMul === "single" ? 1 : 512};<br>`;
      this.$store.state.runtimeSettings += `runtimeSettings.furtherModes.grayscaleTransformationModes = [${this.invertColourOn === "true" ? 1 : 2}, 0, 0, 0, 0, 0, 0, 0];<br>`;

      switch (this.selectedUseCase) {
        case "vin":
          this.$store.state.runtimeSettings += `runtimeSettings.localizationModes = [32, 8, 2, 0, 0, 0, 0, 0];<br>`;
          this.$store.state.runtimeSettings += `runtimeSettings.deblurLevel = 9;<br>`;
          this.$store.state.runtimeSettings += `runtimeSettings.scaleDownThreshold = 100000;<br>`;
          this.$store.state.runtimeSettings += `runtimeSettings.furtherModes.barcodeColourModes = [1, 2, 32, 0, 0, 0, 0, 0];<br>`;
          break;
        case "dl": 
          this.$store.state.runtimeSettings += `runtimeSettings.localizationModes = [16, 8, 2, 0, 0, 0, 0, 0];<br>`;
          this.$store.state.runtimeSettings += `runtimeSettings.deblurLevel = 9;<br>`;
          this.$store.state.runtimeSettings += `runtimeSettings.minResultConfidence = 0;<br>`;
          break;
        case "dpm":
          this.$store.state.runtimeSettings += `runtimeSettings.furtherModes.dpmCodeReadingModes[0] = 2;<br>`;
          this.$store.state.runtimeSettings += `runtimeSettings.localizationModes = [2, 32, 0, 0, 0, 0, 0, 0];<br>`;
          break;
        default:
          break;
      }
      this.$store.state.runtimeSettings += `await ${this.scannerOrReader}.updateRuntimeSettings(runtimeSettings);<br>`;
      if(this.autoZoom && !this.isUploadImage) {
        this.$store.state.runtimeSettings += `const s = await scanner.getScanSettings();<br>`;
        this.$store.state.runtimeSettings += `s.autoZoom = true;<br>`;
        this.$store.state.runtimeSettings += `await scanner.updateScanSettings(s);<br>`;
      }
      this.$store.state.isShowSettings = true;
    },
    copySettings(event) {
      if(this.isCopied) return;
      let btn = document.querySelector(".copyCode")
      let clipboard = new Clipboard(btn, {
        text: () => {
          return this.$store.state.runtimeSettings.replace(/<br>/g, "\n").replace(/"/g, "").replace(/&nbsp;/g, " ");
        },
      });
      clipboard.on("success", () => {
        this.isCopied = true;
        setTimeout(()=>{
          this.isCopied = false;
        },3000)
        let config = {};
        config.content = "Copied!";
        config.duration = 1;
        config.icon = (<a-icon type="smile" style={{ color: "#FE8E14" }}></a-icon>);
        this.$message.open(config);
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        let config = {};
        config.content = "Failed!";
        config.icon = (<a-icon type="frown" style={{ color: "#FE8E14" }}></a-icon>);
        this.$message.open(config);
        clipboard.destroy();
      });
      event.preventDefault();
      clipboard.onClick(event);
    },
  },
  computed: {
    runtimeSettings() {
      return this.$store.state.runtimeSettings;
    },
    selectedUseCase() {
      return this.$store.state.selectedUseCase;
    },
    isShowSettings() {
      return this.$store.state.isShowSettings;
    },
    singleOrMul: {
      get() {
        return this.$store.state.singleOrMul;
      },
      set(newValue) {
        return this.$store.commit("singleOrMulSwitch", newValue);
      },
    },
    scanMode: {
      get() {
        return this.$store.state.scanMode;
      },
      set(newValue) {
        return this.$store.commit("scanModeSwitch", newValue);
      },
    },
    autoZoom(){
      return this.$store.state.autoZoom;
    },
    autoSuggestTip() {
      return this.$store.state.autoSuggestTip;
    },
    invertColourOn: {
      get() {
        return String(this.$store.state.invertColourOn);
      },
      set(newValue) {
        this.$store.commit("invertColourSwitch", newValue);
      },
    },
    soundEffectsOn: {
      get() {
        return String(this.$store.state.soundEffectsOn);
      },
      set(newValue) {
        this.$store.commit("soundEffectsSwitch", newValue);
      },
    },
    bgColor() {
      if (this.$store.state.isShowScanSettingsPopover) {
        return "rgba(64,63,63,.8)";
      } else {
        return "";
      }
    },
    fontAndIconColor() {
      if (!this.$store.state.enableBtn) {
        return "#676767";
      } else {
        if (this.$store.state.isShowScanSettingsPopover) {
          return "#fe8e14";
        } else {
          return "";
        }
      }
    },
    scannerOrReader() {
      return this.isUploadImage ? "reader" : "scanner";
    }
  },
  watch: {},
});
</script>

<style scoped>
.sidebarBtn {height: 100%;}
.settingsLabel {font-family: "OpenSans-Regular";color: white;}

.scanSettingsOptions {margin: -12px -16px;background-color: rgba(50, 50, 52, 0.8);}
.optionRows {display: flex;flex-direction: column;justify-content: space-between;width: 100%;height:100%;}
.settingsContainer {width: 100%;height: 450px;background-color: #323234;padding: 0 17px 55px 17px;}
.settingsContainer svg {filter: invert(1);vertical-align: middle;position: absolute;right: 3%;cursor: pointer;}
.settingsContainer .codeArea {position: absolute;top: 4%;left: 5%;right: 6%;bottom: 15%;color:#fff;padding: 5px;word-break: break-all;font-family: "OpenSans-Regular";font-size: 14px;overflow: auto;}
.settingsContainer .footer-btns {width:90%;display:flex;justify-content: space-between; position: absolute;bottom: 5%;color: #fff;font-size: 14px;cursor: pointer;}
.settingsContainer .sendEmail {position: absolute;right: 5%;bottom: 5%;width: 128px;height: 35px;line-height: 35px;background-color: #FE8E14;color: #fff;text-align: center;font-size: 14px;cursor: pointer;}

.optionRow5 {width: 100%;height: 60px;background-color: #000000;}
.optionRow5 div {line-height: 60px;color: #FE8E14;font-size: 19px;float: right;padding-right: 20px;cursor: pointer;}
.optionRow5 div svg {margin-left: 16px; vertical-align: sub;}

.optionBtns {display: flex;flex-direction: row;}
.optionBtns img {height: 40px;}

.optionBtn {display: flex;justify-content: center;align-items: center;color: #fff;background-color: rgba(34, 34, 34);cursor: pointer;white-space: nowrap;}
.optionBtn input {display: none;}
.optionBtn.unavailable {color: #676767;background-color: #4d4d4d;}
.optionBtn.selected {background-color: #fe8e14;}

.optionRow .optionText .title {color: #dddddd;}
.optionRow .optionText .shortIntro {color: #aaaaaa;font-family: "OpenSans-Regular";}

.scanSettingsOptions .camera-settings{width: 100%; height: 40px;display:flex;align-items: center;background-color: rgb(42,42,43);font-size: 14px; color: #DDDDDD;}
.scanSettingsOptions .camera-settings .autoZoom{width:100%;height:50%;display: flex;justify-content: space-between;align-items: center;padding: 0 18px;}

@media screen and (min-width: 980px) {
  .scanSettingsBtn {height: 25%;}
  .settingsLabel {margin-top: 5px;}
}

@media screen and (max-width: 980px) {
  .barcodeBtns {width: 120px;}
  .barcodeBtns div div:nth-child(2) {width: 50px !important;}
}

@media (min-width: 981px), screen and (max-width: 980px) and (orientation: landscape) {
  .sidebarBtn img {width: 27.02px;height: 27.02px;}
  .scanSettingsOptions {width: 430px;font-size: 16px;}

  .barcodeBtns > div {margin-right: 10px;}

  .optionRows {padding-top: 25px;padding-bottom: 13px;padding-left: 25px;padding-right: 20px;}
  .optionRows .optionRow {margin-top: 19px;}
  .optionRows .optionRow:nth-child(1) {margin-top: 0;}
  .optionBtns {margin-top: 10px;}

  .optionRow5 div {padding-right: 10px;}
  .optionRow .optionText .shortIntro {font-size: 14px;}

  .optionBtn {margin-right: 20px;padding: 10px 20px;min-width: 80px;height: 40px;}
  .optionBtn:last-child {margin-right: 0;}
}

@media screen and (max-width: 980px) and (orientation: landscape) {
  .scanSettingsBtn {width: 25%;}
  
  .scanSettingsOptions {width: 330px;max-height: 65vh;font-size: 14px;overflow: auto;}
  
  .settingsContainer {height: 200px;}
  .settingsContainer .sendEmail {bottom: 8%;width: 128px;height: 20px;line-height: 20px;font-size: 12px;}
  .settingsContainer .codeArea {top: 12%;bottom: 20%;}

  .optionRows {padding-top: 10px;padding-bottom: 10px;padding-left: 18px;padding-right: 20px;}
  .optionRows .optionRow {margin-top: 8px;}
  .optionRows .optionRow:nth-child(1) {margin-top: 0;}

  .optionRow .optionText .shortIntro {font-size: 10px;}
  .optionBtns {margin-top: 5px;}
  .optionBtn {margin-right: 10px;padding: 0 10px;min-width: 80px;}
  .optionBtn:last-child {margin-right: 0;}
}

@media screen and (max-height: 500px) {
  .sidebarBtn img {width: 17px;height: 17px;display: none;}
}
/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .scanSettingsBtn {width: 25%;}
  .sidebarBtn img {width: 18px;height: 18px;}
  .scanSettingsOptions {width: 330px;font-size: 14px;}

  .optionRows {padding-top: 25px;padding-bottom: 13px;padding-left: 18px;padding-right: 20px;}
  .optionRows .optionRow {margin-top: 19px;}
  .optionRows .optionRow:nth-child(1) {margin-top: 0;}
  
  .optionRow .optionText .shortIntro {font-size: 10px;}
  .optionBtns {margin-top: 10px;}
  .optionBtn {margin-right: 10px;padding: 10px 20px;min-width: 80px;height: 40px;}
  .optionBtn:last-child {margin-right: 0;}
}

@media screen and (max-width: 420px) {
  .settingsLabel {font-family: "Oswald-Regular";}
}
</style>
