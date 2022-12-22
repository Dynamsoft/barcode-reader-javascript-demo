<template>
  <div class="scanSettingsBtn" @mouseenter="$store.state.enableBtn && $store.state.curSystem === 'Windows' && !$store.state.isShowScanSettingsPopover && $store.commit('switchScanSettingsPopover')" @click.stop="$store.state.enableBtn && !($store.state.curSystem === 'Windows') && $store.commit('switchScanSettingsPopover')">
    <a-popover :placement="popoverPlacement" trigger="click" :visible="$store.state.isShowScanSettingsPopover">
      <template slot="content">
        <div class="scanSettingsOptions" @click.stop="">
          <div class="optionRows" v-show="!isShowSettings" :style="{'padding-top': $store.state.selectedUseCase === 'general' ? '25px' : '5px'}">
            <div class="optionRow1 optionRow">
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
            <div class="optionRow2 optionRow">
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
              <div class="cs-title">Auto Zoom</div>
              <a-switch @change="$store.commit('autoZoomSwitch', !$store.state.autoZoom)" />
            </div>
            <div class="autoFocus">
              <div class="cs-title">Auto Focus</div>
              <a-switch @change="$store.commit('autoFocusSwitch', !$store.state.autoFocus)" :disabled="!bSupportFocus"/>
            </div>
          </div>
          <div class="settingsContainer" v-show="isShowSettings">
            <div class="codeArea" v-html="runtimeSettings"></div>
            <div class="footer-btns">
              <div @click="$store.state.isShowSettings = false"><a-icon type="left"/>Back</div>
              <div class="copyCode" @click="copySettings" :style="{color: isCopied ? '#FE8E14' : '#ffffff'}">{{isCopied ? "Copied" : "Copy"}}</div>
            </div>
          </div>
          <div class="optionRow5 optionRow" v-show="!isShowSettings">
            <div @click="viewSettings">View Settings<svg t="1661247660036" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2331" width="20" height="20"><path d="M593.450667 512.128L360.064 278.613333l45.290667-45.226666 278.613333 278.762666L405.333333 790.613333l-45.226666-45.269333z" p-id="2332"></path></svg></div>
          </div>
        </div>
      </template>
      <div class="sidebarBtn" :style="{cursor: $store.state.enableBtn ? '' : 'not-allowed',color: fontAndIconColor,backgroundColor: bgColor}">
        <img v-show="$store.state.enableBtn" src="../../assets/image/icon-web-settings.svg" alt="settings">
        <img v-show="!$store.state.enableBtn" src="../../assets/image/icon-setting-disable.svg" alt="settings-disable">
        <label class="settingsLabel" :style="{cursor: $store.state.enableBtn ? '' : 'not-allowed', color: $store.state.enableBtn ? 'white' : '#676767'}"> Scan Settings </label>
      </div>
    </a-popover>
  </div>
</template>

<script >
import Vue from "vue";
import "../../assets/css/sidebarBtn.css";

export default Vue.extend({
  name: "scanSettingsBtn",
  components: {},
  props:["isUploadImage", "bSupportFocus"],
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
      this.$store.state.runtimeSettings += `await scanner.dce.setResolution(${this.$store.state.currentResolution[0]}, ${this.$store.state.currentResolution[1]});<br>`
      if (this.scanMode === "bestSpeed") {
        this.$store.state.runtimeSettings += 'await scanner.updateRuntimeSettings(`speed`);<br>';
      } else if (this.scanMode === "balance") {
        this.$store.state.runtimeSettings += 'await scanner.updateRuntimeSettings(`balance`);<br>';
      } else if (this.scanMode === "bestCoverage") {
        this.$store.state.runtimeSettings += 'await scanner.updateRuntimeSettings(`coverage`);<br>';
      }
      
      this.$store.state.runtimeSettings += 'const runtimeSettings = await scanner.getRuntimeSettings();<br>';
      if(this.selectedUseCase === "dl") {
        this.$store.state.runtimeSettings += 'runtimeSettings.barcodeFormatIds = 0x02000000;<br>';
        this.$store.state.runtimeSettings += 'runtimeSettings.barcodeFormatIds_2 = 0;<br>';
      } else if(this.selectedUseCase === 'vin') {
        this.$store.state.runtimeSettings += 'runtimeSettings.barcodeFormatIds = 0x1 | 0x2 | 0x4 | 0x400 | 0x8 | 0x10 | 0x200 | 0x04000000 | 0x08000000;<br>';
        this.$store.state.runtimeSettings += 'runtimeSettings.barcodeFormatIds_2 = 0;<br>';
      } else if(this.selectedUseCase === 'dpm') {
        this.$store.state.runtimeSettings += 'runtimeSettings.barcodeFormatIds = 0x08000000;<br>';
        this.$store.state.runtimeSettings += 'runtimeSettings.barcodeFormatIds_2 = 0;<br>';
      }

      if(this.singleOrMul === "single") {
        this.$store.state.runtimeSettings += 'runtimeSettings.expectedBarcodesCount = 1;<br>';
      } else {
        this.$store.state.runtimeSettings += 'runtimeSettings.expectedBarcodesCount = 512;<br>';
      }

      if(this.invertColourOn === "true") {
        this.$store.state.runtimeSettings += 'runtimeSettings.furtherModes.grayscaleTransformationModes = [1, 0, 0, 0, 0, 0, 0, 0];<br>';
      } else {
        this.$store.state.runtimeSettings += 'runtimeSettings.furtherModes.grayscaleTransformationModes = [2, 0, 0, 0, 0, 0, 0, 0];<br>';
      }

      switch (this.selectedUseCase) {
        case "vin":
          this.$store.state.runtimeSettings += 'runtimeSettings.localizationModes = [32, 8, 2, 0, 0, 0, 0, 0];<br>';
          this.$store.state.runtimeSettings += 'runtimeSettings.deblurLevel = 9;<br>';
          this.$store.state.runtimeSettings += 'runtimeSettings.scaleDownThreshold = 100000;<br>';
          this.$store.state.runtimeSettings += 'runtimeSettings.furtherModes.barcodeColourModes = [1, 2, 32, 0, 0, 0, 0, 0];<br>';
          break;
        case "dl": 
          this.$store.state.runtimeSettings += 'runtimeSettings.localizationModes = [16, 8, 2, 0, 0, 0, 0, 0];<br>';
          this.$store.state.runtimeSettings += 'runtimeSettings.deblurLevel = 9;<br>';
          this.$store.state.runtimeSettings += 'runtimeSettings.minResultConfidence = 0;<br>';
          break;
        case "dpm":
          this.$store.state.runtimeSettings += 'runtimeSettings.furtherModes.dpmCodeReadingModes[0] = 2;<br>';
          this.$store.state.runtimeSettings += 'runtimeSettings.localizationModes = [2, 32, 0, 0, 0, 0, 0, 0];<br>';
          break;
        default:
          break;
      }
      this.$store.state.runtimeSettings += 'await scanner.updateRuntimeSettings(runtimeSettings);<br>'
      this.$store.state.isShowSettings = true;
    },
    copySettings() {
      if(this.isCopied) return;
      navigator.clipboard.writeText(this.$store.state.runtimeSettings.replace(/<br>/g, "\n").replace(/"/g, "").replace(/&nbsp;/g, " ")).then(res => {
        this.isCopied = true;
        setTimeout(()=>{
          this.isCopied = false;
        },3000)
        let config = {};
        config.content = "Copied!";
        config.duration = 1;
        config.icon = (<a-icon type="smile" style={{ color: "#FE8E14" }}></a-icon>);
        this.$message.open(config);
      }, err => {
        let config = {};
        config.content = "Failed!";
        config.icon = (<a-icon type="frown" style={{ color: "#FE8E14" }}></a-icon>);
        this.$message.open(config);
      });
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
    autoFocus(){
      return this.$store.state.autoFocus;
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
      if (!this.$store.state.enableBtn) {
        return "#4D4D4D";
      } else {
        if (this.$store.state.isShowScanSettingsPopover) {
          return "rgba(64,63,63,.8)";
        } else {
          return "";
        }
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

.optionRow5 {width: 100%;height: 39px;background-color: rgba(34,34,34);}
.optionRow5 div {line-height: 39px;color: #DDDDDD;font-size: 16px;float: right;padding-right: 20px;cursor: pointer;}
.optionRow5 div svg {vertical-align: middle;filter: invert(1);}

.optionBtns {display: flex;flex-direction: row;}
.optionBtns img {height: 40px;}

.optionBtn {display: flex;justify-content: center;align-items: center;color: #fff;background-color: rgba(34, 34, 34);cursor: pointer;white-space: nowrap;}
.optionBtn input {display: none;}
.optionBtn.unavailable {color: #676767;background-color: #4d4d4d;}
.optionBtn.selected {background-color: #fe8e14;}

.optionRow .optionText .title {color: #dddddd;}
.optionRow .optionText .shortIntro {color: #aaaaaa;font-family: "OpenSans-Regular";}

.scanSettingsOptions .camera-settings{width: 100%; height: 80px;background-color: rgb(42,42,43);font-size: 14px; color: #DDDDDD;}
.scanSettingsOptions .camera-settings .autoZoom{width:100%;height:50%;display: flex;justify-content: space-between;align-items: center;border-bottom: 1px solid rgb(50,50,52);padding: 0 18px;}
.scanSettingsOptions .camera-settings .autoFocus{width: 100%;height: 50%;display: flex;justify-content: space-between;align-items: center;padding: 0 18px;}

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
  .sidebarBtn img {/* width: 17px;height: 17px; */display: none;}
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
