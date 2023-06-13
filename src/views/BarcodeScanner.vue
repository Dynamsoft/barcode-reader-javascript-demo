<template>
  <div>
    <div :class="{mask: true, maskHidden: isShowMask}"></div>
    <focus-box @switchFocusBoxShow="switchFocusBoxShow" v-if="bMountFocusBox && currentEnv.OS === 'Android' && currentEnv.browser === 'Chrome'"></focus-box>
    <home />
    <sidebar :isUploadImage="isUploadImage" @getImages="getImages" :bSupportFocus="bSupportFocus" :bScannerCreated="bScannerCreated"/>
    <div class="barcodeScanner">
      <div v-once class="videoContainer" ref="videoContainer" style="width: 100%;height: 100%;min-width: 100px;min-height: 100px;background: #ddd;position: absolute;">
        <div class="dce-video-container" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%"></div>
        <div ref="scanArea" class="dce-scanarea" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%">
          <div class="dce-scanlight" style="display: none;position: absolute;width: 100%;height: 3px;border-radius: 50%;box-shadow: 0px 0px 2vw 1px #fe8e14;background: #fe8e14;animation: 3s infinite dce-scanlight;user-select: none;"></div>
        </div>
        <div class="copyright"><span>Powered by Dynamsoft</span></div>
      </div>
      <div class="cameraAndSoundsContainer">
        <div class="cameraDropdown" @click.stop="showCameraList">
          <div class="cameraIconContainer">
            <svg viewBox="0 0 29.308 17"><g transform="translate(-346.925 -627.702)"><g transform="translate(347.425 628.202)"><g><path d="M365.791,644.2H348.656a1.231,1.231,0,0,1-1.231-1.231V629.433a1.231,1.231,0,0,1,1.231-1.231h16a1.231,1.231,0,0,1,1.231,1.231v14.733" transform="translate(-347.425 -628.202)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path d="M371.81,640.606a1.23,1.23,0,0,1-1.781,1.1l-4.923-2.462a1.229,1.229,0,0,1-.681-1.1v-4.633a1.232,1.232,0,0,1,.681-1.1l4.923-2.462a1.231,1.231,0,0,1,1.781,1.1Z" transform="translate(-343.502 -627.828)" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/></g></g></g></svg>
            <label>Camera</label>
          </div>
          <a-icon type="down" style="margin-right: 8px; font-size: 16px" :rotate="isShowCameraList ? 180 : 0"/>
          <div class="cameraInfo">
            {{ this.cameraInfo }}
          </div>
        </div>
        <div class="localImages">
          <from-image ref="fromimage" @showResults="showResults" :isUploadImage="isUploadImage" :selectedUseCase="selectedUseCase" @clearResultsCvs="clearResultsCvs" @clearResultList="clearResultList" @removeDLResults="removeDLResults"/>
        </div>
        <div class="soundEffects" @click="soundEffectsSwitch" :style="{backgroundColor: $store.state.soundEffectsOn? 'rgba(110, 110, 110, .8)': '',}">
          <img :src="soundEffectsIconPath" :class="{ musicSelected: soundEffectsOn, musicUnSelected: !soundEffectsOn }"/>
        </div>
      </div>
      <div class="curUseCaseTip" v-show="!isUploadImage">
        {{ this.curUseCase }}
      </div>
      <div v-show="selectedUseCase !== 'dl' && !isUploadImage">
        <result-bubble v-for="(result, name) in videoResults" :key="name" :result="result" :scanner="scanner" />
      </div>
      <div class="torchContainer" :style="torchContainerStyle" v-show="!isResizing && !isUploadImage">
        <a-icon v-show="isShowTorchIcon" type="funnel-plot" @click="flashlightSwitch" style=" position: absolute; left: 50%; bottom: 0; font-size: 30px; color: rgb(254, 142, 20); transform: translateX(-50%);"/>
      </div>
      <result-container v-show="selectedUseCase !== 'dl' && !isUploadImage" :decodeRecords="decodeRecords" :pharmacodeResult="pharmacodeResult"/>
      <div class="dlResultContainer" v-show="isDLResultShow && !isUploadImage">
        <ul class="dlInfo">
          <li v-for="(info, infoIndex) in dlInfo" :key="infoIndex">
            <span class="description"> {{ info.description }}: </span>
            <span class="value">
              {{ info.value }}
            </span>
          </li>
        </ul>
        <div class="footer">
          <div @click="copyDLInfo" class="copyBtn">Copy all</div>
          <div class="closeBtn" @click="closeDLResult">Close</div>
        </div>
      </div>
      <div class="driverLicenseTip" :style="driverLicenseTipStyle">
        <div class="tipImg">
          <img src="../../src/assets/image/tipImage.svg" alt="tipImage" :style="tipImgStyle">
        </div>
        <div class="tipText">Scan barcode on the back of license</div>
      </div>
      <div class="loadingImg" v-show="isShowLoadingImg">
        <a-icon type="loading" />
      </div>
      <div class="loadingCameraImg" v-show="isLoadingCamera">
        <svg class="dbrScanner-bg-loading" viewBox="0 0 1792 1792"><path d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z"/></svg>
        <div></div>
      </div>
      <div class="qrcode" v-show="!ifHasCamera">
        <div>
          <h2 style="margin-bottom: 50px">
            <a-icon type="warning" style="margin-right: 10px" />No camera detected
          </h2>
          <p class="scan-on-phone">Scan the QR code and try the demo on your phone</p>
          <div id="qrcode" ref="qrcode" style="margin-bottom: 50px"></div>
          <div>
            <p @click="triggerUploadImg" style="font-size: 18px" class="web-upload">OR Upload from local</p>
          </div>
          <button style="display: none" @click="triggerUploadImg">
            UPLOAD IMAGE FROM LOCAL
          </button>
        </div>
      </div>
      <div class="decodeRes" v-show="isUploadImage">
        <div class="resContainer">
          <div class="imgContainer" ref="imgContainer">
            <div class="resultsPanel" ref="resultsPanel"></div>
            <div class="cvsPanel" ref="cvsPanel"></div>
          </div>
          <div class="resList">
            <div class="results-header">
              <div class="results-header-title">Results</div>
              <div v-show="(selectedUseCase === 'dl' && results.length && results[0].results.length)" class="copyBtnForDl" @click="copyDLResult(copiedDLInfo(getDLInfo(results[0].results[0].json)))">Copy</div>
            </div>
            <ul v-for="(item, index) in results" :key="index">
              <div class="no-pdf417" v-if="selectedUseCase === 'dl' && !item.results.length && !item.parseFailed">No PDF417 code is found !</div>
              <div class="parse-failed" v-if="selectedUseCase === 'dl' && item.parseFailed">Driver's License parse failed!</div>
              <div class="parse-failed-ori-string" v-if="selectedUseCase === 'dl' && item.parseFailed">
                <div :style="{fontFamily: 'Oswald-Regular', fontSize: '16px', marginBottom: '10px'}">Original Text:</div>
                <div :style="{wordWrap: 'break-word'}">{{item.barcodeText}}</div>
              </div>
              <div class="no-barcode" v-if="!item.results.length && selectedUseCase !== 'dl'">No barcodes found !</div>
              <li v-for="(result, i) in item.results" :key="i">
                <ul class="dlInfo" v-if="(selectedUseCase === 'dl' && result.json)">
                  <li v-for="(info, infoIndex) in getDLInfo(result.json)" :key="infoIndex">
                    <span class="description">{{ info.description }}: </span>
                    <span class="value">{{ info.value }}</span>
                  </li>
                </ul>
                <template v-else>
                  <span :title="result.text">{{ i+1 + ". " + result.barcodeFormat + ": " + result.text }}</span>
                </template>
                <div v-show="selectedUseCase !== 'dl'" class="resListCopyBtn" @click="copyResText(result.text, i)">
                  <div :class="[{orangeFont: isCopied[i]}]">{{!isCopied[i] ? "Copy" : "Copied"}}</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="restartVideo">
            <button @click="hideResults">RESTART VIDEO</button>
            <a href="javascript:void(0)" @click="triggerUploadImg">Upload Image from local</a>
          </div>
        </div>
      </div>
      <ul class="cameraList" v-show="isShowCameraList">
        <!-- <li>
          <from-image />
        </li> -->
        <li v-for="(item, index) in cameraAndResolutionList" :key="index" @click="onChangeCameraAndResolution(item)" :class="{ selected: currentCamera && item[0].deviceId == currentCamera.deviceId && item[1] === judgeCurResolution(),}">
          <div class="cameraOption" :style="{color:currentCamera && item[0].deviceId == currentCamera.deviceId && item[1] === judgeCurResolution() ? '#fe8e14' : '#aaaaaa',}">
            {{ item[0].label }}({{ item[1] }})
          </div>
        </li>
      </ul>
      <div class="advancedSettings" v-show="isShowAdvancedSettingsBtn" @click="showAdvancedSettings">
        AdvancedSettings
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import {BarcodeScanner,EnumGrayscaleTransformationMode,EnumDPMCodeReadingMode,EnumLocalizationMode,EnumIntermediateResultType} from "dynamsoft-javascript-barcode";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';  
import { CodeParser } from "dynamsoft-code-parser";
import musicIcon from "../assets/image/music-unselected.svg";
import checkedMusicIcon from "../assets/image/Music-selected.svg";
import BarcodeFormatMap from "../assets/enum/BarcodeFormatMap.js";
import BarcodeFormatMap_2 from "../assets/enum/BarcodeFormatMap_2.js";
import CodeParserFields from "../assets/enum/CodeParserFields";
import CodeParserFieldsZA from "../assets/enum/CodeParserFieldsZA";
import FromImage from "../components/FromImage.vue";
import Home from "../components/Home.vue";
import Sidebar from "../components/Sidebar.vue";
import FocusBox from "../components/FocusBox.vue";
import ResultContainer from "../components/ResultContainer.vue";
import ResultBubble from "../components/ResultBubble.vue";
import Clipboard from "clipboard";
// generate qr code
import QRCode from "qrcodejs2";

export default Vue.extend({ 
  name: "BarcodeScanner",
  components: {
    FromImage,
    Home,
    Sidebar,
    FocusBox,
    ResultContainer,
    ResultBubble
  },
  data() {
    return {
      soundEffectsIconPath: checkedMusicIcon,
      scanner: null,
      parser: null,
      isDestroyed: false,
      resultsInfo: [],
      resolutionList: ["HD", "FULL HD"],
      cameraList: [],
      currentCamera: null,
      cameraAndResolutionList: [],
      baseRegionRatio: 0.4,
      dpmRegionRatio: 0.7,
      clientWidth: 0,
      clientHeight: 0,
      visibleRegionInPixels: null,
      maskCanvas: null,
      isShowTorchIcon: false,
      flashlightOn: false,
      isShowCameraList: false,
      dlText: "",
      changeClientTimeoutId: null,
      changeRuntimeSettingsTimeoutId: null,
      isResizing: true,
      ifHasCamera: true,
      isShowTipImg: true,
      isShowLoadingImg: true,
      isLoadingCamera: false,
      ifSaveImages: false,
      saveImagesCount: 0,
      videoResults: [],
      curImg: null,
      results: [],
      isCopied: [],
      isUploadImage: false,
      pharmacodeResult: '',
      oriRes: [],
      downloadImg: [],
      isShowMask: false,
      isShowAdvancedSettingsBtn: false,
      dbrTemplate: "",
      bSupportFocus: false,
      bScannerCreated: false,
      bMountFocusBox: false,
      currentEnv : BarcodeScanner.browserInfo
    };
  },
  beforeCreate() {
    let splitArr = location.pathname.split("/");
    let useCaseName = splitArr[splitArr.length - 2];
    this.$store.commit("startScanning", useCaseName);
  },

  async mounted() {
    this.clientHeight = document.body.clientHeight;
    this.clientWidth = document.body.clientWidth;
    if (["Android", "iPhone"].includes(BarcodeScanner.browserInfo.OS) && BarcodeScanner.browserInfo.version >= 17) {
      this.isShowTorchIcon = true;
    } else {
      this.isShowTorchIcon = false;
    }
    window.addEventListener("resize", ()=>{ this.resizeEvent(1000) });
    document.addEventListener("click", this.hideCameraList);
    await this.showScanner();
    if (this.scanner && this.scanner.isOpen()) {
      this.visibleRegionInPixels = this.getVisibleRegion();
    }
    try {
      this.cameraList = await this.scanner.getAllCameras();
      this.currentCamera = await this.scanner.getCurrentCamera();
    } catch (e) {
      let config = {};
      config.content = e.message;
      config.duration = 3;
      this.$message.warning(config);
    }
    for (let i of this.cameraList) {
      for (let j of this.resolutionList) {
        this.cameraAndResolutionList.push([i, j]);
      }
    }

    if (this.selectedUseCase === "dl") {
      this.isShowTipImg = true;
      setTimeout(() => {
        this.isShowTipImg = false;
      }, 5000);
    }
    if (["Android", "iPhone"].includes(BarcodeScanner.browserInfo.OS) && ["vin", "dl"].includes(this.selectedUseCase) && [0,180].includes(window.orientation)) {
      let config = {};
      config.duration = 2;
      config.content = "Rotate your device.";
      config.icon = (<a-icon type="mobile" spin style={{ color: "#FE8E14" }}></a-icon>);
      this.$message.open(config);
    }
  },
  beforeDestroy() {
    this.isDestroyed = true;
    if (this.scanner) {
      this.scanner.destroyContext();
    }
  },
  methods: {
    resizeEvent(delay) {
      if(this.$store.state.isShowAdvancedSettings || this.$store.state.isShowEmailInput) return;
      if (this.isUploadImage) {
        this.drawResults();
        return;
      }
      if(!this.scanner) return;
      if (this.scanner.isOpen() && !this.scanner._bPauseScan) {
        this.scanner.pauseScan();
      }
      this.changeClientTimeoutId && clearTimeout(this.changeClientTimeoutId);
      this.scanner.ifShowScanRegionMask = false;
      this.changeClientTimeoutId = setTimeout(async () => {
        this.clientHeight = document.body.clientHeight;
        this.clientWidth = document.body.clientWidth;
        if (this.scanner && this.scanner.isOpen()) {
          this.$store.state.currentResolution = this.scanner.getResolution();
          this.visibleRegionInPixels = this.getVisibleRegion();
          if(this.dlText.length === 0) {
            this.scanner.resumeScan();
          }
        }
        this.scanner.ifShowScanRegionMask = true;
      }, delay);
      if(document.body.clientWidth > 980 && this.bDebug) {
        this.$refs.webScreenshot.style.display = "";
        this.$refs.screenshot.style.display = "none";
      } else if(document.body.clientWidth <= 980 && this.bDebug) {
        this.$refs.webScreenshot.style.display = "none";
        this.$refs.screenshot.style.display = "";
      }
    },
    closeDLResult() {
      this.dlText = "";
      this.scanner.resumeScan();
    },
    getDLInfo(txt) {
      let dlInfo = [];
      if (!txt) {
        return dlInfo;
      }
      if(txt.startsWith("parse failed.")) {
        return [
          {description: "Error", value: "parse failed"},
          {description: "Original text", value: txt.substring("parse failed. Original text: ".length)}
        ];
      }
      const json = JSON.parse(txt);
      let fieldsMap = CodeParserFields;
      if(json.resultInfoType === 4) {
        fieldsMap = CodeParserFieldsZA;
      }
      let originaInfo = {};
      if (json.resultInfo && json.resultInfo.AAMVADLInfo) {
        originaInfo = {
          ...json.basicPersonalInfo,
          ...json.resultInfo,
          ...json.resultInfo.AAMVADLInfo,
        };
        Reflect.deleteProperty(originaInfo, "AAMVADLInfo");
      } else {
        originaInfo = { ...json.basicPersonalInfo, ...json.resultInfo };
      }
      let abbrs = Object.keys(originaInfo);
      const dataDictionary = {
        issuedDay: {
          description: "Document Issue Date",
          value: ["issuedDay", "issuedMonth", "issuedYear"],
        },
        birthDay: {
          description: "Date of Birth",
          value: ["birthDay", "birthMonth", "birthYear"],
        },
        expirationDay: {
          description: "Document Expiration Date",
          value: ["expirationDay", "expirationMonth", "expirationYear"],
        },
      };
      abbrs.forEach((abbr) => {
        if (originaInfo[abbr]) {
          if (abbr in fieldsMap) {
            dlInfo.push({
              description: fieldsMap[abbr],
              value: originaInfo[abbr],
            });
          } else if (abbr in dataDictionary) {
            const value =
              this.toTwoDigit(originaInfo[dataDictionary[abbr].value[0]]) +
              "/" +
              this.toTwoDigit(originaInfo[dataDictionary[abbr].value[1]]) +
              "/" +
              originaInfo[dataDictionary[abbr].value[2]];
            dlInfo.push({
              description: dataDictionary[abbr].description,
              value,
            });
          }
        }
      });
      return dlInfo;
    },
    async getImages() {
      if(this.isUploadImage) return;
      this.isShowMask = true;
      this.scanner.pauseScan();
      this.$message.loading({content: "Capturing...", duration: 0});
      await this.saveImages();
      const zip = new JSZip();
      for(let i=0;i<this.downloadImg.length;i++) {
        zip.file(this.downloadImg[i].name, this.downloadImg[i].blob);
      }
      const content = await zip.generateAsync({type: "blob"});
      saveAs(content, `screenshot-${this.getDate()}.zip`);
      this.downloadImg = [];
      this.$message.destroy();
      this.isShowMask = false;
      this.scanner.resumeScan();
    },
    async saveImages() {
      return new Promise(async (rs,rj)=>{
        let index = 0;
        while(index < 8) {
          const cvs = this.scanner.dce.getFrame().toCanvas();
          if (cvs != null) {
            const blob = cvs.convertToBlob ? await cvs.convertToBlob() : await new Promise(resolve => {
              cvs.toBlob(blob => resolve(blob));
            });
            this.downloadImg.push({ name: "Screenshot - " + new Date().toISOString().replace(/\:/g, "-") + ".png", blob});
            index++;
          }
        }
        rs();
      })
    },
    getDate() {
      const date = new Date();
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    },
    async getAdvancedSettings(advancedSettings, modeArguments) {
      const as =  JSON.parse(JSON.stringify(advancedSettings));
      const ma = [];
      for(let i=0;i<modeArguments.length;i++){
        ma.push(JSON.parse(JSON.stringify(modeArguments[i])));
      }
      if(this.$store.state.isChanged) {
        await this.changeAdvancedSettings(as, ma);
      }
      this.scanner.resumeScan();
    },
    async changeAdvancedSettings(advancedSettings, modeArguments) {
      try {
        this.$message.loading({content: "setting...", duration: 0});
        const settings = await this.scanner.getRuntimeSettings();
        for(let setting in advancedSettings) {
          if(setting === "enableQRCodeModel1") {
            if(this.dbrTemplate.length === 0) {
              this.dbrTemplate = await this.scanner.outputRuntimeSettingsToString();
            }
            const s = JSON.parse(this.dbrTemplate);
            s.FormatSpecification.EnableQRCodeModel1 = advancedSettings[setting].default;
            this.dbrTemplate = JSON.stringify(s);
            await this.scanner.initRuntimeSettingsWithString(JSON.stringify(s));
          }
          if(advancedSettings[setting].type === "mode") {
            settings[setting] = advancedSettings[setting].value;
          } else if(advancedSettings[setting].type === "obj") {
            for(let further in advancedSettings[setting].inside) {
              if(advancedSettings[setting].inside[further].type === "mode") {
                settings.furtherModes[further] = advancedSettings[setting].inside[further].value;
              } else {
                settings.furtherModes[further] = advancedSettings[setting].inside[further].default;
              }
            }
          } else {
            settings[setting] = advancedSettings[setting].default;
          }
        }
        await this.scanner.updateRuntimeSettings(settings);
        if(modeArguments) {
          for(let i=0;i<modeArguments.length;i++){
            await this.scanner.setModeArgument(this.handleString(modeArguments[i].modesName), modeArguments[i].index, modeArguments[i].argumentName, modeArguments[i].argumentValue);
          }
        }
      } catch(ex) {
        alert(ex.message || ex);
        console.log(ex.message || ex);
        this.$message.destroy();
      }
      this.$message.destroy();
    },
    handleString(str) {
      let strArr = str.split("");
      strArr[0] = strArr[0].toUpperCase();
      str = strArr.join("");
      return str;
    },
    showAdvancedSettings() {
      this.$store.state.isShowAdvancedSettings = true;
      this.$store.state.isChanged = false;
      this.scanner.pauseScan();
    },
    showCameraList() {
      this.isShowCameraList = !this.isShowCameraList;
    },
    hideCameraList() {
      this.isShowCameraList = false;
    },
    copyResult(target) {
      let clipboard = new Clipboard(target);
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
    copyDLInfo() {
      let clipboard = new Clipboard(".copyBtn", {
        text: () => {
          let copyContent = "";
          for (let i in this.dlInfo) {
            copyContent +=
              this.dlInfo[i].description + ": " + this.dlInfo[i].value + "\n";
          }
          return copyContent;
        },
      });
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
    async flashlightSwitch() {
      try {
        if (this.flashlightOn) {
          await this.scanner.turnOffTorch();
          this.flashlightOn = false;
        } else {
          await this.scanner.turnOnTorch();
          this.flashlightOn = true;
        }
      } catch (e) {
        let config = {};
        config.duration = 2;
        config.content = "Not supported.";
        config.icon = (
          <a-icon type="frown" style={{ color: "#FE8E14" }}></a-icon>
        );
        this.$message.open(config);
        this.isShowTorchIcon = false;
      }
    },
    soundEffectsSwitch() {
      if (this.$store.state.soundEffectsOn) {
        this.$store.commit("soundEffectsSwitch", "false");
      } else {
        this.$store.commit("soundEffectsSwitch", "true");
      }
    },
    async initDcp() {
      this.parser || (this.parser = await CodeParser.createInstance());
    },
    async showScanner() {
      this.isLoadingCamera = true;
      try {
        this.scanner || (this.scanner = await BarcodeScanner.createInstance());
        window.scanner = this.scanner;
        this.scanner.bPlaySoundOnSuccessfulRead = this.soundEffectsOn;
        this.scanner.setVideoFit("cover");
        if (this.selectedUseCase === "dl") {
          await this.initDcp();
        }
      } catch (e) {
        let config = {};
        config.content = e.message;
        config.duration = 0;
        this.$message.warning(config);
        return Promise.reject(e.message);
      }
      if (this.isDestroyed) {
        this.scanner.destroyContext();
        return;
      }

      try {
        if (this.scanner) {
          await this.scanner.setUIElement(this.$refs.videoContainer);
          this.scanner.ifSaveOriginalImageInACanvas = true;
          this.scanner.setResolution([1280, 720]);
          if (["vin", "dl"].includes(this.selectedUseCase)) {
            this.scanner.setResolution([1920, 1080]);
          }
          this.scanner.onFrameRead = async (results) => {
            this.videoResults = results;
            for (let i = 0; i < results.length; i++) {
              let result = results[i];
              if (this.selectedUseCase === "dl" && result.barcodeFormatString === "PDF417") {
                this.scanner.pauseScan({keepResultsHighlighted: true});
                const data = await this.parser.parseData(result.barcodeBytes);
                if(data.exception) {
                  this.dlText = "parse failed. Original text: "+ result.barcodeText;
                } else {
                  this.dlText = JSON.stringify(data); // use stringify to avoid render ui everytime
                }
              } else if (result.barcodeFormatString_2 === "PHARMACODE_ONE_TRACK") {
                if (result.localizationResult.x1 < result.localizationResult.x2) {
                  this.pharmacodeResult = result.barcodeText;
                } else if (result.localizationResult.x1 > result.localizationResult.x2) {
                  this.getPharmacodeResult(result);
                }
              } else if (result.barcodeFormatString_2 === "PHARMACODE_TWO_TRACK") {
                this.getPharmacodeResult(result);
              }
            }
          };
          let callBackInfo = await this.scanner.open();
          this.bScannerCreated = true;
          this.bMountFocusBox = true;
          this.$store.state.currentResolution[0] = callBackInfo.width;
          this.$store.state.currentResolution[1] = callBackInfo.height;
          this.isLoadingCamera = false;
          this.isResizing = false;
        }
      } catch (e) {
        let config = {};
        // config.content = `Unable to connect to the camera, make sure it is not used by other apps and try again. Alternatively, you can click "From Image" in the "Camera" drop-down list to read barcodes from an existing image.`;
        config.content = `Unable to connect to the camera, make sure it is not used by other apps and try again. Alternatively, you can read barcodes by uploading local images`;
        config.duration = 3;
        // show qrcode if no camera
        this.ifHasCamera = false;
        this.generateQRcode();
        this.$message.warning(config);

        return Promise.reject(e.message);
      }
    },
    getPharmacodeResult(result) {
      for (let i = 0; i < 2; i++) {
        let res = "";
        for (let j = 0; j < result.results[i].bytes.length; j++) {
          res += String.fromCharCode(result.results[i].bytes[j]);
        }
        if (res !== result.barcodeText) {
          this.pharmacodeResult = res;
          break;
        }
      }
    },
    async onChangeCameraAndResolution(item) {
      let config = {};
      this.isLoadingCamera = true;
      let resulution = item[1] === "HD" ? [1280, 720] : [1920, 1080];
      await this.scanner.setCurrentCamera(item[0].deviceId);
      await this.scanner.setResolution(resulution);
      this.$store.state.currentResolution = this.scanner.getResolution();
      this.currentCamera = await this.scanner.getCurrentCamera();
      if (this.currentCamera.deviceId !== item[0].deviceId) {
        config.icon = (
          <a-icon type="frown" style={{ color: "#FE8E14" }}></a-icon>
        );
        config.content = "Switch camera failed!";
      } else if (this.judgeCurResolution() !== item[1]) {
        config.icon = <a-icon type="meh" style={{ color: "#FE8E14" }}></a-icon>;
        config.content = "Switch resolution failed. " + item[1] + " might be unsupported in the camera.";
      } else {
        config.icon = (
          <a-icon type="smile" style={{ color: "#FE8E14" }}></a-icon>
        );
        config.content = "Switched to " + this.cameraInfo + " successfully!";
        this.$store.state.currentResolution = this.scanner.getResolution();
      }
      this.$message.open(config);
      this.$store.state.isShowSettings = false;
      this.isLoadingCamera = false;
    },
    //qrcode
    generateQRcode() {
      // eslint-disable-next-line no-unused-vars
      var qrcode = new QRCode(this.$refs.qrcode, {
        width: 160,
        height: 160,
        text: window.location.href,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
    // trigger upload images from local files
    triggerUploadImg() {
      this.$refs.fromimage.trigger();
    },
    clearResultsCvs() {
      this.$refs.resultsPanel.innerHTML = "";
    },
    clearResultList() {
      this.results = [];
      this.curImg = null;
    },
    // show decode results
    async showResults(results, image, oriRes) {
      this.$refs.cvsPanel.innerHTML = "";
      this.$refs.cvsPanel.appendChild(image);
      this.$refs.scanArea.style.display = "none";
      this.isCopied = [];
      this.isUploadImage = true;
      this.results = results;
      this.curImg = image;
      this.oriRes = oriRes;
      await this.scanner.close();
      Vue.nextTick(() => {
        this.drawResults();
      });
    },
    drawResults() {
      if (!this.curImg) return;
      this.clearResultsCvs();
      let widthZoom;
      let heightZoom;
      let oriWidth = this.curImg.width;
      let oriHeight = this.curImg.height;
      let oriWHRatio = oriWidth / oriHeight;
      let imgWidth = parseInt(getComputedStyle(this.curImg).width);
      let imgHeight = parseInt(getComputedStyle(this.curImg).height);
      let imgWHRatio = imgWidth / imgHeight;
      for (let i = 0; i < this.oriRes.length; i++) {
        let cvs = document.createElement("canvas");
        let ctx = cvs.getContext("2d");
        ctx.globalCompositeOperation = "destination-over";
        let loc = this.oriRes[i].localizationResult;
        let locXArr = [loc.x1, loc.x2, loc.x3, loc.x4];
        let locYArr = [loc.y1, loc.y2, loc.y3, loc.y4];
        let maxX = Math.max(loc.x1, loc.x2, loc.x3, loc.x4);
        let minX = Math.min(loc.x1, loc.x2, loc.x3, loc.x4);
        let maxY = Math.max(loc.y1, loc.y2, loc.y3, loc.y4);
        let minY = Math.min(loc.y1, loc.y2, loc.y3, loc.y4);
        let minXToY = locYArr[locXArr.indexOf(minX)];
        let minYToX = locXArr[locYArr.indexOf(minY)];
        let maxXToY = locYArr[locXArr.indexOf(maxX)];
        let maxYToX = locXArr[locYArr.indexOf(maxY)];

        if (oriWHRatio > imgWHRatio) {
          widthZoom = imgWidth / oriWidth;
          heightZoom = imgWidth / oriWHRatio / oriHeight;
          cvs.style.top = minY * heightZoom + (imgHeight - imgWidth / oriWHRatio) * 0.5 + "px";
          cvs.style.left = minX * widthZoom + "px";
          cvs.width = (maxX - minX) * widthZoom;
          cvs.height = (maxY - minY) * widthZoom;
          cvs.style.width = (maxX - minX) * widthZoom + "px";
          cvs.style.height = (maxY - minY) * widthZoom + "px";
        } else {
          heightZoom = imgHeight / oriHeight;
          widthZoom = (imgHeight * oriWHRatio) / oriWidth;
          cvs.style.top = minY * heightZoom + "px";
          cvs.style.left = minX * widthZoom + (imgWidth - imgHeight * oriWHRatio) * 0.5 + "px";
          cvs.width = (maxX - minX) * heightZoom;
          cvs.height = (maxY - minY) * heightZoom;
          cvs.style.width = (maxX - minX) * heightZoom + "px";
          cvs.style.height = (maxY - minY) * heightZoom + "px";
        }
        cvs.style.position = "absolute";
        if (this.oriRes[i].barcodeFormatString === "PatchCode") {
          ctx.fillStyle = "rgba(97, 189, 79, 0.2)";
          cvs.style.zIndex = 1;
        } else {
          ctx.fillStyle = "rgba(97, 189, 79, 0.5)";
          cvs.style.zIndex = 2;
        }
        let allowAngle = [358, 359, 0, 1, 268, 269, 270, 271, 272, 178, 179, 180, 181, 182, 88, 89, 90, 91, 92];
        if (!allowAngle.includes(loc.angle)) {
          ctx.moveTo(0, minXToY * heightZoom - minY * heightZoom);
          ctx.lineTo(minYToX * widthZoom - minX * widthZoom, 0);
          ctx.lineTo(cvs.width, maxXToY * heightZoom - minY * heightZoom);
          ctx.lineTo(maxYToX * widthZoom - minX * widthZoom, cvs.height);
          ctx.fill();
        } else {
          ctx.fillRect(0, 0, cvs.width, cvs.height);
        }
        cvs.title = i+1 + ". " + this.oriRes[i].barcodeFormatString + " : " + this.oriRes[i].barcodeText;
        this.$refs.resultsPanel.appendChild(cvs);
      }
    },
    // hide decode results
    async hideResults() {
      this.isUploadImage = false;
      this.$store.commit("finishDecodingFile");
      this.isLoadingCamera = true;
      await this.scanner.open();
      this.scanner.pauseScan();
      this.isLoadingCamera = false;
      this.resizeEvent(0);
    },
    // copy decoded result
    copyResText(text, index) {
      if(this.isCopied[index]) return;
      let clipboard = new Clipboard(".resListCopyBtn", {
        text: () => {
          return text;
        },
      });
      clipboard.on("success", () => {
        this.$set(this.isCopied, index, true);
        setTimeout(()=>{
          this.$set(this.isCopied, index, false);
        },5000);
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        this.$message.success({content: "Failed!", duration: 1});
        clipboard.destroy();
      })
    },
    copyDLResult(text) {
      let clipboard = new Clipboard(".copyBtnForDl", {
        text: () => {
          return text;
        },
      });
      clipboard.on("success", () => {
        this.$message.success({content: "Copied!", duration: 1});
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        this.$message.success({content: "Failed!", duration: 1});
        clipboard.destroy();
      })
    },
    judgeCurResolution() {
      let minValue = Math.min(this.$store.state.currentResolution[0],this.$store.state.currentResolution[1]);
      let maxValue = Math.max(this.$store.state.currentResolution[0],this.$store.state.currentResolution[1]);
      if (minValue > 480 && minValue < 960 && maxValue > 960 && maxValue < 1440) {
        return "HD";
      } else if (minValue > 900 && minValue < 1440 && maxValue > 1400 && maxValue < 2160) {
        return "FULL HD";
      }
    },
    // get visible region
    getVisibleRegion() {
      if (!this.scanner.isOpen()) return;
      let width, height;
      width = this.scanner.video.videoWidth;
      height = this.scanner.video.videoHeight;
      const getVisibleRegionInPixels = () => {
        const videoCSSWidth = parseFloat(window.getComputedStyle(this.scanner.video).width),videoCSSHeight = parseFloat(window.getComputedStyle(this.scanner.video).height);
        const videoCSSRatio = videoCSSWidth / videoCSSHeight, videoRatio = width / height;
        let resizedRatio;
        let regionInPixels = {
          regionBottom: height,
          regionRight: width,
          regionLeft: 0,
          regionTop: 0,
          regionMeasuredByPercentage: false,
        };
        if (videoCSSRatio < videoRatio) {
          // a part of length is invisible
          resizedRatio = height / videoCSSHeight;
          regionInPixels.regionLeft = Math.floor((width - resizedRatio * videoCSSWidth) / 2);
          regionInPixels.regionRight = Math.ceil(width - regionInPixels.regionLeft);
          regionInPixels.regionTop = 0;
          regionInPixels.regionBottom = height;
        } else {
          // a part of height is invisible
          resizedRatio = width / videoCSSWidth;
          regionInPixels.regionTop = Math.floor((height - resizedRatio * videoCSSHeight) / 2);
          regionInPixels.regionBottom = Math.ceil(height - regionInPixels.regionTop);
          regionInPixels.regionLeft = 0;
          regionInPixels.regionRight = width;
        }
        return regionInPixels;
      };
      let visibleRegion = getVisibleRegionInPixels();
      return visibleRegion;
    },
    removeDLResults() {
      this.dlText = "";
    },
    // change runtimeSettings
    changeSettings() {
      if(this.isUploadImage) return null;
      if (!this.scanner) return null;
      if (!this.scanner.isOpen()) return null;
      this.$store.state.isShowSettings = false;
      this.isShowLoadingImg = true;
      if(!this.scanner._bPauseScan) {
        this.scanner.pauseScan();
      }
      this.$refs.scanArea.style.display = "none";
      this.scanner.ifShowScanRegionMask = false;
      let runtimeSettings = null;
      this.changeRuntimeSettingsTimeoutId && clearTimeout(this.changeRuntimeSettingsTimeoutId);
      this.changeRuntimeSettingsTimeoutId = setTimeout(async () => {
        // scan mode
        if (this.scanMode === "bestSpeed") {
          await this.scanner.updateRuntimeSettings("speed");
        } else if (this.scanMode === "balance") {
          await this.scanner.updateRuntimeSettings("balance");
        } else if (this.scanMode === "bestCoverage") {
          await this.scanner.updateRuntimeSettings("coverage");
        }
        runtimeSettings = await this.scanner.getRuntimeSettings();
        // colour invert
        runtimeSettings.furtherModes.grayscaleTransformationModes = [this.invertColourOn ? EnumGrayscaleTransformationMode.GTM_INVERTED : EnumGrayscaleTransformationMode.GTM_ORIGINAL,0,0,0,0,0,0,0,];
        // set scan region
        if (this.isFullImageLocalization) {
          runtimeSettings.region = null;
        } else {
          this.$refs.scanArea.style.display = "";
          runtimeSettings.region = this.region;
        }
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
          runtimeSettings.furtherModes.dpmCodeReadingModes[0] = EnumDPMCodeReadingMode.DPMCRM_GENERAL;
          let locModes = runtimeSettings.localizationModes;
          for (let i in locModes) {
            if (locModes[i] == EnumLocalizationMode.LM_STATISTICS_MARKS) break;
            if (locModes[i] == 0) {
              locModes[i] = EnumLocalizationMode.LM_STATISTICS_MARKS;
              break;
            }
          }
        }

        // single or multiple
        this.singleOrMul === "single" ? (runtimeSettings.expectedBarcodesCount = 1) : (runtimeSettings.expectedBarcodesCount = 512);
        await this.scanner.updateRuntimeSettings(runtimeSettings);
        this.isShowTipImg = true;
        setTimeout(() => {
          this.isShowTipImg = false;
        }, 5000);
        this.isShowLoadingImg = false;
        if(this.dlText.length === 0) {
          this.scanner.resumeScan();
        }
        this.scanner.ifShowScanRegionMask = true;
        return runtimeSettings;
      }, 300);
    }
  },
  computed: {
    toTwoDigit() {
      return (num) => (num < 9 ? "0" + num : num);
    },
    driverLicenseTipStyle() {
      if (this.selectedUseCase !== "dl") return { display: "none" };
      if (!this.cssRegionLeft || !this.cssRegionTop) return { display: "none" };
      let width = ((100 - 2 * this.cssRegionLeft) / 100) * this.clientWidth;
      let height = ((100 - 2 * this.cssRegionTop) / 100) * this.clientHeight;
      return {
        top: this.cssRegionTop + "%",
        height: height + "px",
        width: width + "px",
      };
    },
    tipImgStyle: {
      get() {
        if (!this.cssRegionTop) return {};
        if (this.selectedUseCase !== "dl") return {};
        if (!this.isShowTipImg) return { display: "none" };
        let height = ((100 - 2 * this.cssRegionTop) / 100) * this.clientHeight * 0.278;
        return {
          marginTop: "50%",
          height: height + "px",
        };
      },
      set(newValue) {
        return newValue;
      },
    },
    cameraInfo() {
      const minValue = Math.min(this.$store.state.currentResolution[0],this.$store.state.currentResolution[1]);
      const maxValue = Math.max(this.$store.state.currentResolution[0],this.$store.state.currentResolution[1]);
      if (this.currentCamera) {
        return this.currentCamera.label + " " + (minValue > 480 && minValue < 960 && maxValue > 960 && maxValue < 1440 ? "HD" : "FULL HD");
      } else {
        return "";
      }
    },
    curUseCase() {
      switch (this.selectedUseCase) {
        case "general":
          return "General";
        case "vin":
          return "Vehicle Identification Number (VIN)";
        case "dl":
          return "USA/CAN/ZA Driver's License";
        case "dpm":
          return "DPM Codes";
        default:
          return "";
      }
    },
    isDLResultShow() {
      return this.selectedUseCase === "dl" && this.dlInfo.length !== 0;
    },
    dlInfo() {
      if (this.selectedUseCase === "dl") {
        return this.getDLInfo(this.dlText);
      } else {
        return [];
      }
    },
    copiedDLInfo() {
      return (data) => {
        let copiedDLInfo = "";
        for (let i in data) {
          copiedDLInfo += data[i].description + ": " + data[i].value + "\n";
        }
        return copiedDLInfo;
      };
    },
    isDecodingFile() {
      return this.$store.state.isDecodingFile;
    },
    decodeRecords() {
      if (this.selectedUseCase !== "dl" && this.scanner && this.scanner.decodeRecords) {
        return this.scanner.decodeRecords;
      } else {
        return {};
      }
    },
    selectedUseCase() {
      // if(this.$store.state.selectedUseCase === "dl"){
      //   this.initDcp();
      // }
      return this.$store.state.selectedUseCase;
    },
    selectedBarcodes() {
      return this.$store.getters.selectedBarcodes;
    },
    // scan modes part
    singleOrMul() {
      return this.$store.state.singleOrMul;
    },
    scanMode() {
      return this.$store.state.scanMode;
    },
    autoZoom() {
      return this.$store.state.autoZoom;
    },
    autoSuggestTip() {
      return this.$store.state.autoSuggestTip;
    },
    invertColourOn() {
      return this.$store.state.invertColourOn;
    },
    soundEffectsOn() {
      return this.$store.state.soundEffectsOn;
    },
    isFullImageLocalization() {
      return this.$store.state.isFullImageLocalization;
    },
    regionEdgeLength() {
      if (!this.visibleRegionInPixels) return 0;
      if (!this.scanner || !this.scanner.isOpen()) return 0;
      const visibleRegionWidth = this.visibleRegionInPixels.regionRight - this.visibleRegionInPixels.regionLeft;
      const visibleRegionHeight = this.visibleRegionInPixels.regionBottom - this.visibleRegionInPixels.regionTop;
      let regionEdgeLength = this.baseRegionRatio * Math.min(visibleRegionWidth, visibleRegionHeight);
      return Math.round(regionEdgeLength);
    },
    regionLeft() {
      if (!this.visibleRegionInPixels) return 0;
      if (!this.scanner || !this.scanner.isOpen() || this.$store.state.currentResolution.length != 2) return 0;
      const vw = this.$store.state.currentResolution[0];
      const visibleRegionWidth = this.visibleRegionInPixels.regionRight - this.visibleRegionInPixels.regionLeft;
      let left = 0.5 - this.regionEdgeLength / vw / 2;
      if (["vin", "dl"].includes(this.selectedUseCase)) {
        if (this.clientWidth > this.clientHeight) {
          left = Math.round((left - (0.25 * visibleRegionWidth) / vw) * 100);
        } else {
          left = Math.round((left - (0.2 * visibleRegionWidth) / vw) * 100);
        }
      } else if (this.selectedUseCase === "general") {
        if (this.clientWidth > this.clientHeight) {
          left = Math.round((left - (0.1 * visibleRegionWidth) / vw) * 100);
        } else {
          left = Math.round((left - (0.2 * visibleRegionWidth) / vw) * 100);
        }
      } else if (this.selectedUseCase === "dpm") {
        const visibleRegionHeight = this.visibleRegionInPixels.regionBottom - this.visibleRegionInPixels.regionTop;
        left = 0.5 - this.dpmRegionRatio * Math.min(visibleRegionWidth, visibleRegionHeight) / vw / 2;
        left = Math.round(left * 100);
      }
      left = left < 0 || left >= 50 ? 0 : left;
      return left;
    },
    regionTop() {
      if (!this.visibleRegionInPixels) return 0;
      if (!this.scanner || !this.scanner.isOpen() || this.$store.state.currentResolution.length != 2) return 0;
      const vh = this.$store.state.currentResolution[1];
      const visibleRegionHeight = this.visibleRegionInPixels.regionBottom - this.visibleRegionInPixels.regionTop;
      let top = 0.5 - this.regionEdgeLength / vh / 2;
      if (this.selectedUseCase === "vin") {
        if (this.clientWidth > this.clientHeight) {
          top = Math.round((top + (0.05 * visibleRegionHeight) / vh) * 100);
        } else {
          top = Math.round((top + (0.05 * visibleRegionHeight) / vh) * 100);
        }
      } else if (this.selectedUseCase === "dl") {
        if (this.clientWidth > this.clientHeight) {
          top = Math.round((top - (0.05 * visibleRegionHeight) / vh) * 100);
        } else {
          top = Math.round((top - (0.05 * visibleRegionHeight) / vh) * 100);
        }
      } else if (this.selectedUseCase === "general") {
        if (this.clientWidth > this.clientHeight) {
          top = Math.round((top - (0.1 * visibleRegionHeight) / vh) * 100);
        } else {
          top = Math.round((top - (0.1 * visibleRegionHeight) / vh) * 100);
        }
      } else if (this.selectedUseCase === "dpm") {
        const visibleRegionWidth = this.visibleRegionInPixels.regionRight - this.visibleRegionInPixels.regionLeft;
        top = 0.5 - this.dpmRegionRatio * Math.min(visibleRegionWidth, visibleRegionHeight) / vh / 2;
        top = Math.round(top * 100);
      }
      top = top < 0 || top >= 50 ? 0 : top;
      return top;
    },
    region() {
      let region = {
        regionLeft: this.regionLeft,
        regionRight: 100 - this.regionLeft,
        regionTop: this.regionTop,
        regionBottom: 100 - this.regionTop,
        regionMeasuredByPercentage: 1,
      };
      return region;
    },
    cssRegionLeft() {
      if (!this.visibleRegionInPixels) return 0;
      if (!this.scanner || !this.scanner.isOpen() || this.$store.state.currentResolution.length != 2) return 0;
      const vw = this.$store.state.currentResolution[0];
      const visibleRegionWidth = this.visibleRegionInPixels.regionRight - this.visibleRegionInPixels.regionLeft;
      let left = ((this.regionLeft / 100) * vw - this.visibleRegionInPixels.regionLeft) / visibleRegionWidth;
      left = Math.round(left * 100);
      return left;
    },
    cssRegionTop() {
      if (!this.visibleRegionInPixels) return 0;
      if (!this.scanner || !this.scanner.isOpen() || this.$store.state.currentResolution.length != 2) return 0;
      const vh = this.$store.state.currentResolution[1];
      const visibleRegionHeight = this.visibleRegionInPixels.regionBottom - this.visibleRegionInPixels.regionTop;
      let top = ((this.regionTop / 100) * vh - this.visibleRegionInPixels.regionTop) / visibleRegionHeight;
      top = Math.round(top * 100);
      return top;
    },
    torchContainerStyle() {
      let left = this.cssRegionLeft;
      let right = left;
      let top = this.cssRegionTop;
      let bottom = top;
      let style = {
        left: left + "%",
        right: right + "%",
        top: top + "%",
        bottom: bottom + "%",
      };
      return style;
    },
    currentResolution() {
      return this.$store.state.currentResolution;
    }
  },
  watch: {
    currentResolution(newValue, oldValue) {
      this.visibleRegionInPixels = this.getVisibleRegion();
    },
    isDLResultShow(newValue) {
      if (!newValue) {
        this.dlText = "";
      }
    },
    async isDecodingFile(newValue) {
      if (this.scanner && this.scanner.isOpen() && newValue) {
        this.scanner.pauseScan();
      } else if (this.scanner && this.scanner.isOpen() && !newValue) {
        await this.scanner.resumeScan();
      }
    },
    soundEffectsOn(newValue) {
      this.soundEffectsIconPath = newValue ? checkedMusicIcon : musicIcon;
      this.scanner.bPlaySoundOnSuccessfulRead = newValue;
    },
    async selectedUseCase(newUseCase, oldUseCase) {
      if(!this.scanner) return;
      this.results = [];
      if (["vin", "dl"].includes(newUseCase) && this.judgeCurResolution() !== "FULL HD") {
        this.isLoadingCamera = true;
        await this.scanner.setResolution([1920, 1080]);
        this.$store.state.currentResolution = this.scanner.getResolution();

        this.isLoadingCamera = false;
      }
      if (["general", "dpm"].includes(newUseCase) && this.judgeCurResolution() !== "HD") {
        this.isLoadingCamera = true;
        await this.scanner.setResolution([1280, 720]);
        this.$store.state.currentResolution = this.scanner.getResolution();

        this.isLoadingCamera = false;
      }
      if (["Android", "iPhone"].includes(BarcodeScanner.browserInfo.OS) && ["vin","dl"].includes(newUseCase) && [0,180].includes(window.orientation)) {
        let config = {};
        config.duration = 2;
        config.content = "Rotate your device.";
        config.icon = (
          <a-icon type="mobile" spin style={{ color: "#FE8E14" }}></a-icon>
        );
        this.$message.open(config);
      }
      if (newUseCase === "dl") {
        await this.initDcp();
      }
    },
    selectedBarcodes() {
      this.changeSettings();
    },
    region() {
      this.changeSettings();
    },
    singleOrMul() {
      this.changeSettings();
    },
    invertColourOn() {
      this.changeSettings();
    },
    scanMode() {
      this.changeSettings();
    },
    async autoZoom(newValue,_) {
      const s = await this.scanner.getScanSettings();
      s.autoZoom = newValue;
      await this.scanner.updateScanSettings(s);
    },
    isFullImageLocalization() {
      this.changeSettings();
    },
    isUploadImage() {
      this.$store.state.isShowSettings = false;
    }
  },
});
</script>

<style scoped>
.orangeFont {color: #fe8e14 !important;}

.mask {position: absolute;top: 0;left: 0;right: 0;bottom: 0;background-color: rgba(0,0,0,0.3);z-index: 20;display: none;}

.maskHidden {display: block;}

.barcodeScanner {position: absolute;width: 100%;height: 100%;min-width: 100px;min-height: 100px;background: #d1d1d1;}

.copyright {color: white;font-size: 12px;font-family: "Oswald-Light";position: absolute;left: 50%;transform: translateX(-50%);user-select: none;}

.loadingImg {position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);}
.loadingCameraImg {width: 100%;height: 100%;background: #ddd;position: absolute;}

.qrcode {width: 100%;height: 100%;background: #585757;position: absolute;color: white;}
.qrcode p {font-size: 24px;text-align: center;}
.qrcode div:first-child {height: 400px;display: flex;flex-direction: column;align-items: center;justify-content: space-between;position: absolute;top: 42%;left: 50%;transform: translate(-50%, -50%);}
.qrcode p:last-child {cursor: pointer;color: #fe8e14;}
.qrcode h2:first-child {width: 300px;height: 55px;padding: 10px 20px;background-color: #222222;color: white;text-align: center;font-size: 24px;}
.qrcode #qrcode {background-color: white;padding: 44px;}

.decodeRes {position: absolute;width: 100%;height: 100%;background-color: #585757;}
.decodeRes .resContainer {position: absolute;left: 50%;top: 19.5vh;transform: translateX(-50%);width: 70%;height: 50%;background-color: #464545;}
.decodeRes .imgContainer {width: 50%;position: relative;background-color: #262626;display: flex;justify-content: center;align-items: center;}
.decodeRes .imgContainer .resultsPanel, .decodeRes .imgContainer .cvsPanel {position: absolute;width: 100%;height: 100%;}
.decodeRes .resList {width: 50%;padding: 10px 20px 24px 20px;color: white;}
.decodeRes .resList .results-header {display: flex;align-items: center;margin-bottom:15px;font-size:16px;}
.decodeRes .resList .results-header .results-header-title {margin-right: 15px;}
.decodeRes .resList .results-header .copyBtnForDl {color: rgb(254,142,20);cursor: pointer;}
.decodeRes .resList .parse-failed {margin-bottom: 10px;}
.decodeRes .resList .parse-failed, .decodeRes .resList .parse-failed-ori-string, .decodeRes .resList .no-barcode, .decodeRes .resList .no-pdf417 {font-family: "OpenSans-Regular";}
.decodeRes .resList ul {width:100%;height: 88%;padding-right: 15px;overflow: auto;}
.decodeRes .resList li {display:flex;justify-content: space-between;font-size: 16px;font-family: OpenSans-Regular;margin-bottom: 7px;word-break: break-all;white-space: pre-wrap;}
.decodeRes .resList li span{display: inline-block;width: calc(100% - 45px);}
.decodeRes .resList li .resListCopyBtn {width:45px;position:relative;}
.decodeRes .resList li .resListCopyBtn div {position:absolute;bottom: 0;}
.decodeRes .resList li div {font-size: 16px;color: #aaaaaa;font-family: Oswald-Regular;cursor: pointer;}
.decodeRes .restartVideo button {background: #fe8e14;width: 166px;height: 50px;font-size: 18px;text-align: center;outline: none;border: none;color: white;margin-right: 17px;cursor: pointer;}
.decodeRes .restartVideo a {font-size: 16px;}

.localImages {width: 100px;}
.cameraIconContainer label {font-size: 12px;}

.cameraDropdown .cameraIconContainer {display: flex;flex-direction: column;justify-content: center;align-items: center;padding-top: 5px;padding-right: 13px;height: 100%;}
.cameraDropdown .cameraInfo {word-break: break-all;}

.cameraAndSoundsContainer {position: absolute;display: flex;flex-direction: row;align-items: center;top: 0;left: 0;cursor: pointer;z-index: 10;user-select: none;}
.cameraAndSoundsContainer .cameraDropdown {display: flex;flex-direction: row;justify-content: flex-end;align-items: center;height: 100%;width: 250px;color: rgba(170, 170, 170);background-color: rgba(34, 34, 34);}
.cameraAndSoundsContainer .soundEffects, 
.cameraAndSoundsContainer .web-screenshot {display: flex;justify-content: center;align-items: center;height: 100%;width: 100px;}
.cameraAndSoundsContainer .web-screenshot {border-right: 1px solid rgb(98, 96, 94);background-color: rgba(34, 34, 34);}
.cameraAndSoundsContainer .web-screenshot img {height: 50%;}
.cameraAndSoundsContainer .soundEffects .musicUnSelected {height: 50%;margin-top: 0;}
.cameraAndSoundsContainer .soundEffects .musicSelected {height: 60%;margin-top: 7px;}

.curUseCaseTip {width: 100%;position: absolute;left: 50%;color: #fff;text-align: center;transform: translateX(-50%);z-index: 15;user-select: none;font-family: "OpenSans-Regular";}

.dlResultContainer {position: absolute;top: 50%;left: 50%;width: 85%;max-height: 65vh;padding: 20px;color: #dddddd;background-color: rgba(34, 34, 34, 0.5);padding: 17px 25px 13px;transform: translate(-50%, -50%);z-index: 20;}
.dlResultContainer .dlInfo {height: 100%;max-height: calc(60vh - 25px);overflow: auto;}
.resContainer .dlInfo li span {word-break: break-word;}
.resContainer .dlInfo li .description {width: 55%;color: #cccccc;}
.dlResultContainer .dlInfo li, .resContainer .dlInfo li {display: flex;flex-direction: row;align-items: center;justify-content: space-around;padding-bottom: 2px;font-size: 14px;}

.dlResultContainer .dlInfo li .description, .dlResultContainer .dlInfo li .value, .resContainer .dlInfo li .value {width: 40%;color: white;}

.dlResultContainer .footer {display: flex;flex-direction: row;align-items: center;justify-content: space-between;color: #fe8e14;font-size: 16px;}
.dlResultContainer .footer .copyBtn,
.dlResultContainer .footer .closeBtn {cursor: pointer;user-select: none;}

.torchContainer {position: absolute;user-select: none;transform: translateY(35px);}

.driverLicenseTip {display: flex;position: absolute;flex-direction: column;align-items: center;justify-content: space-between;left: 50%;font-family: "OpenSans-Regular";color: #fff;transform: translateX(-50%);user-select: none;pointer-events: none;}

.cameraList {position: absolute;left: 0;background-color: rgba(34, 34, 34);z-index: 50;animation: fade-in 0.2s;}
.cameraList li .cameraOption {padding: 5px 12px;cursor: pointer;user-select: none;}
.cameraList .selected {background-color: black !important;}

.advancedSettings {position: absolute;top: 8vh;right: 20PX;color: #fff;cursor: pointer;}
.advancedSettings:hover {color: #fe8e14;}

.dbrScanner-bg-loading {animation: 1s linear infinite dbrScanner-rotate;width: 40vmin;height: 40vmin;position: absolute;margin: auto;left: 0;top: 0;right: 0;bottom: 0;fill: #aaa;}

@media (hover: hover) {.cameraList li:hover {background-color: rgba(50, 50, 52);}}
@keyframes dbrScanner-rotate {from {transform: rotate(0turn);}to {transform: rotate(1turn);}}
@keyframes dbrScanner-scanlight {from {top: 0;}to {top: 97%;}}
@keyframes fade-in {from {opacity: 0;} to {opacity: 1;}}

@media screen and (max-width: 1199px) {
  .cameraAndSoundsContainer .cameraDropdown {width: 210px;}
  .cameraAndSoundsContainer .cameraDropdown .cameraInfo {margin: 0;}
  .cameraAndSoundsContainer .soundEffects, .localImages {width: 75px;}

  .decodeRes .resContainer {width: 60%;}
  .decodeRes .resContainer .restartVideo {text-align: center;width: 100%;}
}

@media (max-width: 759px) {
  .decodeRes .resContainer {width: 90%;}

  #qrcode {display: none;}
  .qrcode .scan-on-phone {display: none;}
  .qrcode div:first-child {height: auto !important;top: 48%;}
}

@media (max-width: 572px) {
  .qrcode div:nth-child(3) {display: none;}
  .qrcode .web-upload {display: none;}
  .qrcode button {display: block !important;width: 200px;height: 46px;margin: 40px 0 0 0;background-color: #fe8e14;outline: none;border: none;}
}

@media (min-width: 981px), screen and (max-width: 980px) and (orientation: landscape) {
  .copyright {display: none;}

  .cameraDropdown {padding-left: 43px;}
  .cameraDropdown .cameraIconContainer {margin-top: 0;}
  .cameraDropdown .cameraIconContainer svg {height: 42.2%;}
  .cameraDropdown .cameraIconContainer label {display: none;}
  .cameraDropdown .cameraInfo {margin-left: 14px;margin-right: 30px;width: 190px;font-size: 12px;}

  .localImages {background-color: rgba(34, 34, 34);height: 100%;border-left: 1px solid rgb(98, 96, 94);}

  .curUseCaseTip {top: 35px;width: 25%;font-size: 20px;transform: translate(-50%, -50%);overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}

  .dlResultContainer {max-width: 500px;}

  .driverLicenseTip .tipText {margin-bottom: 10px;font-size: 14px;}

  .loadingImg {font-size: 60px;}

  .cameraList {top: 70px;font-size: 16px;}
}

@media screen and (min-width: 980px) {
  .cameraAndSoundsContainer {height: 70px;}

  .decodeRes .resList .results-header {justify-content: space-between;margin-top: 10px;}
  .decodeRes .resList .results-header .results-header-title {font-size:20px;}
  .decodeRes .resContainer {display: flex;}
  .decodeRes .restartVideo {position: absolute;left: 50%;bottom: -35%;transform: translateX(-50%);height: 10vh;}
}

@media screen and (max-width: 980px) {

  .screenshot {position: absolute;bottom: 10px;right: 10px;width: 50px;height: 50px;background-color: rgba(0,0,0,0.6);border-radius: 50%;color: #ffffff;cursor: pointer;font-size: 18px;z-index: 30;}
  .screenshotIcon {position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);width: 20px;height: 20px;fill: #fff;vertical-align: baseline;}

  .decodeRes .resContainer {top: 6.9vh;width: 100%;height: calc(100% - 15.9vh);}
  .decodeRes .resContainer .imgContainer {width: 100%;height: 30%;}
  .decodeRes .resContainer .resList {width: 100%;height: calc(70% - 80px);margin-bottom: 20px;padding-top: 10px;}
  .decodeRes .resContainer .resList ul {height: calc(100% - 30px);overflow: auto;padding-right: 10px;}
  .decodeRes .resContainer .restartVideo button {width: 140px;height: 40px;font-size: 14px;}
  .decodeRes .resContainer .restartVideo a {width: auto;bottom: -35%;}
}

@media screen and (max-width: 980px) and (orientation: landscape) {
  .decodeRes .resContainer {top: 7.7vh;width: 100%;height: calc(100% - 17.7vh);}

  .copyright {display: block;font-size: 12px;bottom: 13%;}
  .cameraAndSoundsContainer {height: 7.7vh;}
  .cameraAndSoundsContainer .cameraDropdown {padding-left: 10px;width: 100px;}
  .cameraAndSoundsContainer .soundEffects {width: 60px;}
  
  .cameraDropdown .cameraIconContainer {margin-top: 5px;}
  .cameraDropdown .cameraIconContainer svg {height: auto;}
  .cameraDropdown .cameraIconContainer label {display: block;}
  .cameraDropdown .cameraInfo {display: none;}

  .curUseCaseTip {top: 10vh;width: auto;font-size: 14px;transform: translateX(-50%);}

  .dlResultContainer {max-height: 55vh;}
  .dlResultContainer .dlInfo {max-height: calc(50vh - 25px);}


  .driverLicenseTip .tipText {margin-bottom: 10px;font-size: 14px;transform: scale(0.7);}
  .loadingImg {font-size: 30px;}
  .cameraList {top: 7.7vh;font-size: 14px;}
}

/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .copyright {bottom: 11.7vh;}
  .cameraAndSoundsContainer {height: 6.9vh;}
  .cameraAndSoundsContainer .cameraDropdown {width: 76px;}
  .cameraAndSoundsContainer .soundEffects {width: 60px;}

  .cameraDropdown .cameraInfo {display: none;}

  .localImages {background-color: rgba(34, 34, 34);width: 60px;height: 100%;border-left: 1px solid rgb(98, 96, 94);}
  .curUseCaseTip {top: 8.5vh;font-size: 14px;}

  .driverLicenseTip .tipText {margin-bottom: 10px;font-size: 14px;transform: scale(0.7);}
  .loadingImg {font-size: 30px;}
  .cameraList {top: 6.9vh;font-size: 14px;}
}

@media screen and (max-width: 980px) and (max-height: 500px) {
  .decodeRes .resContainer {display: flex;position: absolute;top: 15%;}
  .decodeRes .resContainer .imgContainer {width: 50%;height: 60%;}
  .decodeRes .resContainer .resList {width: 50%;height: 60%;background-color: #303030;}
  .decodeRes .resContainer .restartVideo {position: absolute;left: 50%;bottom: 20%;transform: translateX(-50%);height: 10vh;}
}

@media screen and (max-width: 350px) {
  .localImages,.cameraAndSoundsContainer .soundEffects {width: 45px;}
}
</style>