<template>
  <div
    class="scanSettingsBtn"
    @click.stop="$store.commit('switchScanSettingsPopover')"
  >
    <a-popover
      :placement="popoverPlacement"
      trigger="click"
      :visible="$store.state.isShowScanSettingsPopover"
    >
      <template slot="content">
        <div class="scanSettingsOptions" @click.stop="">
          <div class="optionRows" v-show="!isShowSettings">
            <div
              class="optionRow1 optionRow"
              v-show="
                $store.state.selectedUseCase === 'general' ||
                $store.state.selectedUseCase === 'dpm'
              "
            >
              <div class="optionText">
                <div class="title">Single/Multi Barcode Scanning</div>
              </div>
              <div class="optionBtns">
                <label
                  class="optionBtn"
                  :class="{ selected: singleOrMul === 'single' }"
                >
                  <input
                    type="radio"
                    name="optionRow1"
                    class="optionBtn"
                    value="single"
                    v-model="singleOrMul"
                  />
                  Single
                </label>
                <label
                  class="optionBtn"
                  :class="{ selected: singleOrMul === 'multiple' }"
                >
                  <input
                    type="radio"
                    name="optionRow1"
                    class="optionBtn"
                    value="multiple"
                    v-model="singleOrMul"
                  />
                  Multiple
                </label>
              </div>
            </div>
            <div
              class="optionRow2 optionRow"
              v-show="
                $store.state.selectedUseCase === 'general' ||
                $store.state.selectedUseCase === 'dpm'
              "
            >
              <div class="optionText">
                <div class="title">Scan Mode</div>
              </div>
              <div class="optionBtns">
                <label
                  class="optionBtn"
                  :class="{ selected: scanMode === 'bestSpeed' }"
                >
                  <input
                    type="radio"
                    name="optionRow2"
                    class="optionBtn"
                    value="bestSpeed"
                    v-model="scanMode"
                  />
                  Best Speed
                </label>
                <label
                  class="optionBtn"
                  :class="{ selected: scanMode === 'balance' }"
                >
                  <input
                    type="radio"
                    name="optionRow2"
                    class="optionBtn"
                    value="balance"
                    v-model="scanMode"
                  />
                  Balance
                </label>
                <label
                  class="optionBtn"
                  :class="{ selected: scanMode === 'bestCoverage' }"
                >
                  <input
                    type="radio"
                    name="optionRow2"
                    class="optionBtn"
                    value="bestCoverage"
                    v-model="scanMode"
                  />
                  Best Coverage
                </label>
              </div>
            </div>
            <div
              class="optionRow3 optionRow"
              v-show="
                $store.state.selectedUseCase === 'general' ||
                $store.state.selectedUseCase === 'dpm'
              "
            >
              <div class="optionText">
                <div class="title">Scan Inverted Barcodes</div>
                <div class="shortIntro">
                  Scan light barcodes on dark background
                </div>
              </div>
              <div class="optionBtns barcodeBtns">
                <div style="display: flex">
                  <label
                    class="optionBtn"
                    style="margin-right: 0"
                    :class="{ selected: invertColourOn === 'true' }"
                  >
                    <input
                      ref="enableBtn"
                      type="radio"
                      name="optionRow3"
                      class="optionBtn"
                      value="true"
                      v-model="invertColourOn"
                    />
                    Enable
                  </label>
                  <div
                    @click="enableClick"
                    style="
                      height: 40px;
                      width: 80px;
                      padding: 5px 0;
                      margin-right: 10px;
                      background-color: black;
                    "
                  >
                    <img
                      src="../../assets/image/barcode.svg"
                      alt=""
                      style="width: 100%; height: 100%; cursor: pointer"
                    />
                  </div>
                </div>
                <div style="display: flex">
                  <label
                    class="optionBtn"
                    style="margin-right: 0"
                    :class="{ selected: invertColourOn === 'false' }"
                  >
                    <input
                      ref="disableBtn"
                      type="radio"
                      name="optionRow3"
                      class="optionBtn"
                      value="false"
                      v-model="invertColourOn"
                    />
                    Disable
                  </label>
                  <div
                    @click="disableClick"
                    style="
                      height: 40px;
                      width: 80px;
                      padding: 5px 0;
                      background-color: white;
                    "
                  >
                    <img
                      src="../../assets/image/barcode.svg"
                      alt=""
                      style="
                        cursor: pointer;
                        width: 100%;
                        height: 100%;
                        color: black;
                        -webkit-filter: invert(100%);
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="optionRow4 optionRow">
              <div class="optionText">
                <div class="title">Play Sound After Scan</div>
                <div class="shortIntro">
                  Play a "beep" sound upon a successful scan
                </div>
              </div>
              <div class="optionBtns">
                <label
                  class="optionBtn"
                  :class="{ selected: soundEffectsOn === 'true' }"
                >
                  <input
                    type="radio"
                    name="optionRow4"
                    class="optionBtn"
                    value="true"
                    v-model="soundEffectsOn"
                  />
                  Play
                </label>
                <label
                  class="optionBtn"
                  :class="{ selected: soundEffectsOn === 'false' }"
                >
                  <input
                    type="radio"
                    name="optionRow4"
                    class="optionBtn"
                    value="false"
                    v-model="soundEffectsOn"
                  />
                  Don’t Play
                </label>
              </div>
            </div>
          </div>
          <div class="settingsContainer" v-show="isShowSettings">
            <svg @click="$store.state.isShowSettings = false" t="1661248862703" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4901" width="25" height="25"><path d="M509.92 475.968l74.032-74.032a16 16 0 0 1 22.624 0l11.312 11.312a16 16 0 0 1 0 22.64L543.84 509.92l74.032 74.032a16 16 0 0 1 0 22.624l-11.312 11.312a16 16 0 0 1-22.624 0L509.92 543.84l-74.032 74.032a16 16 0 0 1-22.64 0l-11.312-11.312a16 16 0 0 1 0-22.624l74.032-74.032-74.032-74.032a16 16 0 0 1 0-22.64l11.312-11.312a16 16 0 0 1 22.64 0l74.032 74.032z m0 319.856c157.904 0 285.92-128 285.92-285.92C795.84 352 667.808 224 509.92 224 352 224 224 352 224 509.92c0 157.904 128 285.92 285.92 285.92z m0 48C325.504 843.84 176 694.336 176 509.92 176 325.52 325.504 176 509.92 176c184.416 0 333.92 149.504 333.92 333.92 0 184.416-149.504 333.92-333.92 333.92z" p-id="4902"></path></svg>
            <div class="codeArea" v-html="runtimeSettings"></div>
            <div class="copyCode" @click="copySettings">{{isCopied ? "Copied" : "Copy code snippets"}}</div>
          </div>
          <div class="optionRow5 optionRow" v-show="!isShowSettings">
            <div @click="viewSettings">View Settings<svg t="1661247660036" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2331" width="20" height="20"><path d="M593.450667 512.128L360.064 278.613333l45.290667-45.226666 278.613333 278.762666L405.333333 790.613333l-45.226666-45.269333z" p-id="2332"></path></svg></div>
          </div>
        </div>
      </template>
      <div
        class="sidebarBtn"
        :style="{
          color: $store.state.isShowScanSettingsPopover ? '#fe8e14' : '',
          backgroundColor: $store.state.isShowScanSettingsPopover
            ? 'rgba(34, 34, 34, .8)'
            : '',
        }"
      >
        <svg
          viewBox="0 0 19 19"
          :style="{
            stroke: $store.state.isShowScanSettingsPopover ? '#FE8E14' : '',
          }"
        >
          <g transform="translate(-230 -1618)">
            <g transform="translate(230.5 1618.5)">
              <g>
                <path
                  d="M245.96,1628.674h1.758a.783.783,0,0,0,.783-.782v-.782a.783.783,0,0,0-.783-.783h-1.758a9.237,9.237,0,0,0-.783-2.287l1.244-1.243a.783.783,0,0,0,0-1.106l-1.11-1.107a.783.783,0,0,0-1.107,0l-1.244,1.243a9.216,9.216,0,0,0-2.285-.782v-1.762a.783.783,0,0,0-.783-.783h-.783a.783.783,0,0,0-.783.783v1.76a9.243,9.243,0,0,0-2.286.783l-1.244-1.242a.783.783,0,0,0-1.107,0l-1.107,1.107a.784.784,0,0,0,0,1.107l1.244,1.243a9.239,9.239,0,0,0-.783,2.286h-1.761a.783.783,0,0,0-.783.782v.783a.783.783,0,0,0,.783.783h1.758a9.233,9.233,0,0,0,.783,2.286l-1.244,1.245a.783.783,0,0,0,0,1.106l1.111,1.106a.783.783,0,0,0,1.107,0l1.244-1.244a9.217,9.217,0,0,0,2.287.783v1.761a.783.783,0,0,0,.783.782h.783a.783.783,0,0,0,.783-.782v-1.757a9.217,9.217,0,0,0,2.285-.783l1.245,1.244a.783.783,0,0,0,1.107,0l1.107-1.106a.783.783,0,0,0,0-1.107l-1.244-1.244A9.253,9.253,0,0,0,245.96,1628.674Z"
                  transform="translate(-230.5 -1618.5)"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                />
                <path
                  d="M240.608,1631.717a3.108,3.108,0,1,0-3.108-3.108A3.109,3.109,0,0,0,240.608,1631.717Z"
                  transform="translate(-231.608 -1619.609)"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                />
              </g>
            </g>
          </g>
        </svg>
        <label> Scan Settings </label>
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

      if(this.invertColourOn) {
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
        config.icon = (
          <a-icon type="smile" style={{ color: "#FE8E14" }}></a-icon>
        );
        this.$message.open(config);
      }, err => {
        let config = {};
        config.content = "Failed!";
        config.icon = (
          <a-icon type="frown" style={{ color: "#FE8E14" }}></a-icon>
        );
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
  },
  watch: {},
});
</script>

<style scoped>
.sidebarBtn {
  height: 100%;
}
.scanSettingsOptions {
  margin: -12px -16px;
  background-color: rgba(50, 50, 52, 0.8);
}
.optionRows {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}
.settingsContainer {
  width: 100%;
  height: 450px;
  background-color: #323234;
  padding: 0 17px 55px 17px;
}
.settingsContainer svg {
  filter: invert(1);
  vertical-align: middle;
  position: absolute;
  right: 3%;
  cursor: pointer;
}
.settingsContainer .codeArea {
  position: absolute;
  top: 6%;
  left: 5%;
  right: 5%;
  bottom: 15%;
  background-color: #D5D5D5;
  padding: 5px;
  word-break: break-all;
  font-family: OpenSans-Regular;
  font-size: 14px;
  overflow: auto;
}
.settingsContainer .copyCode {
  position: absolute;
  bottom: 8%;
  color: #AAAAAA;
  font-size: 14px;
  cursor: pointer;
}
.settingsContainer .sendEmail {
  position: absolute;
  right: 5%;
  bottom: 5%;
  width: 128px;
  height: 35px;
  line-height: 35px;
  background-color: #FE8E14;
  color: #fff;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}
.optionRow5 {
  width: 100%;
  height: 39px;
  background-color: black;
  cursor: pointer;
}
.optionRow5 div {
  line-height: 39px;
  color: #DDDDDD;
  font-size: 16px;
  float: right;
  padding-right: 20px;
}
.optionRow5 div svg {
  vertical-align: middle;
  filter: invert(1);
}
.optionBtns {
  display: flex;
  flex-direction: row;
}
.optionBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: rgba(34, 34, 34);
  cursor: pointer;
  white-space: nowrap;
}
.optionBtn input {
  display: none;
}
.optionBtns img {
  height: 40px;
}
.optionBtn.unavailable {
  color: #676767;
  background-color: #4d4d4d;
}
.optionBtn.selected {
  background-color: #fe8e14;
}
.optionRow .optionText .title {
  color: #dddddd;
}
.optionRow .optionText .shortIntro {
  color: #aaaaaa;
  font-family: "OpenSans-Regular";
}
@media (min-width: 981px),
  screen and (max-width: 980px) and (orientation: landscape) {
  .scanSettingsBtn {
    flex-grow: 1;
  }
  .sidebarBtn svg {
    width: 27.02px;
    height: 27.02px;
  }
  .scanSettingsOptions {
    width: 400px;
    font-size: 18px;
  }
  .optionRows {
    padding-top: 25px;
    padding-bottom: 25px;
    padding-left: 25px;
  }
  .optionRows .optionRow {
    margin-top: 19px;
  }
  .optionRows .optionRow:nth-child(1) {
    margin-top: 0;
  }
  .optionRow5 div {
    padding-right: 10px;
  }
  .optionRow .optionText .shortIntro {
    font-size: 14px;
  }
  .optionBtns {
    margin-top: 10px;
  }
  .optionBtn {
    margin-right: 10px;
    padding: 10px 10px;
    min-width: 80px;
    height: 40px;
  }
  .optionBtn:last-child {
    margin-right: 0;
  }
}

@media screen and (max-width: 980px) {
  .barcodeBtns {
    width: 120px;
  }
  .barcodeBtns div div:nth-child(2) {
    width: 50px !important;
  }
}
@media screen and (max-width: 980px) and (orientation: landscape) {
  .scanSettingsBtn {
    flex-grow: 3;
  }
  .sidebarBtn svg {
    width: 17px;
    height: 17px;
  }
  .scanSettingsOptions {
    width: 300px;
    max-height: 65vh;
    font-size: 14px;
    overflow: auto;
  }
  .settingsContainer {
    height: 200px;
  }
  .settingsContainer .sendEmail {
    bottom: 8%;
    width: 128px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
  }
  .settingsContainer .codeArea {
    top: 12%;
    bottom: 20%;
  }
  .optionRows {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 18px;
  }
  .optionRows .optionRow {
    margin-top: 8px;
  }
  .optionRows .optionRow:nth-child(1) {
    margin-top: 0;
  }
  .optionRow .optionText .shortIntro {
    font-size: 10px;
  }
  .optionBtns {
    margin-top: 5px;
  }
  .optionBtn {
    margin-right: 10px;
    padding: 0 10px;
    min-width: 80px;
    /* height: 22px; */
  }
  .optionBtn:last-child {
    margin-right: 0;
  }
}
/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .scanSettingsBtn {
    flex-grow: 3;
  }
  .sidebarBtn svg {
    width: 17px;
    height: 17px;
  }
  .scanSettingsOptions {
    width: 300px;
    font-size: 14px;
  }
  .optionRows {
    padding-top: 25px;
    padding-bottom: 25px;
    padding-left: 18px;
  }
  .optionRows .optionRow {
    margin-top: 19px;
  }
  .optionRows .optionRow:nth-child(1) {
    margin-top: 0;
  }
  .optionRow .optionText .shortIntro {
    font-size: 10px;
  }
  .optionBtns {
    margin-top: 10px;
  }
  .optionBtn {
    margin-right: 10px;
    padding: 10px 10px;
    min-width: 80px;
    height: 40px;
  }
  .optionBtn:last-child {
    margin-right: 0;
  }
}
</style>
