<template>
  <div class="guide">
    <header>
      <div class="headerLeft">
        <a class="dynamsoftLogo" href="https://www.dynamsoft.com/" target="_blank">
          <img src="../assets/image/logo-dynamsoft-blackBg-190x47.png" alt="dynamsoft"/>
          dynamsoft
        </a>
      </div>
    </header>
    <div class="guideContainer">
      <div class="guideTitle">
        <h1>Dynamsoft Barcode Reader | JavaScript Barcode Reader Demo</h1>
        <img src="../assets/image/dbr.svg" alt="dynamsoft-barcode-reader" />
      </div>
      <p class="guideTextPart1" style="color: white">
        Using JavaScript barcode reader web SDK, you can turn any device with a camera into an enterprise-grade barcode scanner with high-speed functionalities and customization settings for different usage scenarios. Take this JavaScript barcode scanner demo and see how it works in different modes.
      </p>
      <div class="guideOptions">
        <div class="optionRow1 optionRow">
          <div class="optionItemContainer" :class="{ selected: guideSelection == 'common-oned' }">
            <label>
              <input type="radio" name="guideOptions" value="common-oned" v-model="guideSelection"/>
              <div class="itemHeader">
                <div class="headerLeft">Common 1D Barcodes</div>
                <div class="headerRight">
                  <div class="circle">
                    <a-icon type="check" v-show="guideSelection == 'common-oned'"/>
                  </div>
                </div>
              </div>
              <div class="itemBody">
                Code 39, Code 128, Code 93, Codabar, EAN 13, EAN 8, UPC A, UPC
                E, Industrial 25, Code39 Extended, MSI Code
              </div>
            </label>
          </div>
        </div>
        <div class="optionRow2 optionRow">
          <div class="optionItemContainer" :class="{ selected: guideSelection == 'common-twod' }">
            <label>
              <input type="radio" name="guideOptions" value="common-twod" v-model="guideSelection"/>
              <div class="itemHeader">
                <div class="headerLeft">Common 2D Barcodes</div>
                <div class="headerRight">
                  <div class="circle">
                    <a-icon type="check" v-show="guideSelection == 'common-twod'"/>
                  </div>
                </div>
              </div>
              <div class="itemBody">QR Code, Data Matrix, PDF417</div>
            </label>
          </div>
        </div>
        <div class="optionRow3 optionRow">
          <div class="optionItemContainer" :class="{ selected: guideSelection == 'common-oned-twod' }">
            <label>
              <input type="radio" name="guideOptions" value="common-oned-twod" v-model="guideSelection"/>
              <div class="itemHeader">
                <div class="headerLeft">Common 1D + 2D</div>
                <div class="headerRight">
                  <div class="circle">
                    <a-icon type="check" v-show="guideSelection == 'common-oned-twod'"/>
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div class="optionItemContainer" :class="{ selected: guideSelection == 'driver-license' }">
            <label>
              <input type="radio" name="guideOptions" value="driver-license" v-model="guideSelection"/>
              <div class="itemHeader">
                <div class="headerLeft">USA/CAN/ZA Driver's License</div>
                <div class="headerRight">
                  <div class="circle">
                    <a-icon type="check" v-show="guideSelection == 'driver-license'" />
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
        <div class="optionRow4 optionRow">
          <div class="optionItemContainer" :class="{ selected: guideSelection == 'vin' }">
            <label>
              <input type="radio" name="guideOptions" value="vin" v-model="guideSelection"/>
              <div class="itemHeader">
                <div class="headerLeft">
                  <span>VIN</span>
                  <svg width="34" height="16.783" viewBox="0 0 34 16.783" class="vinIcon invert"><g transform="translate(-522 -549.5)"><g transform="translate(522.5 550)"><g><path d="M542.37,562.739a2.87,2.87,0,1,0-2.87-2.87A2.869,2.869,0,0,0,542.37,562.739Z" transform="translate(-515.109 -546.957)" fill="none" stroke="#606060" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path d="M526.8,559h-4.3" transform="translate(-522.5 -546.087)" fill="none" stroke="#606060" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path d="M528.37,562.739a2.87,2.87,0,1,0-2.87-2.87A2.869,2.869,0,0,0,528.37,562.739Z" transform="translate(-521.196 -546.957)" fill="none" stroke="#606060" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path d="M543.848,559H529.5" transform="translate(-519.457 -546.087)" fill="none" stroke="#606060" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path d="M523.5,562.913v-5.022a2.153,2.153,0,0,1,2.152-2.152H527.8l2.474-4.946a1.433,1.433,0,0,1,1.283-.793h11.857a1.433,1.433,0,0,1,1.283.793l2.474,4.946h5.739a2.153,2.153,0,0,1,2.152,2.152v3.587a1.435,1.435,0,0,1-1.435,1.435H552.2" transform="translate(-522.065 -550)" fill="none" stroke="#606060" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path d="M545.87,554H526.5" transform="translate(-520.761 -548.261)" fill="none" stroke="#606060" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path d="M533,550v5.739" transform="translate(-517.935 -550)" fill="none" stroke="#606060" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/></g></g></g></svg>
                </div>
                <div class="headerRight">
                  <div class="circle">
                    <a-icon type="check" v-show="guideSelection == 'vin'" />
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div class="optionItemContainer" :class="{ selected: guideSelection == 'dpm' }">
            <label>
              <input type="radio" name="guideOptions" value="dpm" v-model="guideSelection"/>
              <div class="itemHeader">
                <div class="headerLeft">
                  <span> DPM Codes</span>
                  <div class="dpmIcon">
                    <svg width="24" height="24" viewBox="0 0 24 24" class="invert"><path d="M10.661,10A1.664,1.664,0,1,1,9,11.667v-.006A1.665,1.665,0,0,1,10.661,10Zm0,4.164A1.641,1.641,0,1,1,9,15.805,1.642,1.642,0,0,1,10.661,14.164Zm0,4.119A1.654,1.654,0,1,1,9,19.937,1.654,1.654,0,0,1,10.661,18.283Zm0,4.145A1.654,1.654,0,1,1,9,24.082,1.655,1.655,0,0,1,10.661,22.428Zm0,4.125A1.664,1.664,0,1,1,9,28.221v-.006A1.661,1.661,0,0,1,10.661,26.553Zm0,4.119A1.664,1.664,0,1,1,9,32.339H9A1.667,1.667,0,0,1,10.661,30.672Zm20.679,0a1.664,1.664,0,1,1-1.667,1.667,1.664,1.664,0,0,1,1.667-1.667Zm-4.145,0a1.664,1.664,0,1,1-1.641,1.686v-.019a1.653,1.653,0,0,1,1.638-1.667Zm-4.132,0a1.664,1.664,0,1,1-1.654,1.674v-.006A1.663,1.663,0,0,1,23.063,30.672Zm-4.145,0a1.664,1.664,0,1,1-1.654,1.674v-.006a1.66,1.66,0,0,1,1.653-1.667Zm-4.132,0a1.664,1.664,0,1,1-1.661,1.667h0a1.661,1.661,0,0,1,1.655-1.667Zm0-16.508a1.657,1.657,0,1,1-.008,0Zm0,8.264a1.657,1.657,0,1,1-.006,0ZM18.918,10a1.664,1.664,0,1,1-1.654,1.674v-.013A1.658,1.658,0,0,1,18.918,10Zm0,4.164a1.641,1.641,0,1,1-1.654,1.641,1.641,1.641,0,0,1,1.654-1.641Zm0,8.264a1.654,1.654,0,1,1-1.654,1.654h0a1.653,1.653,0,0,1,1.651-1.654Zm0,4.125a1.664,1.664,0,1,1-1.654,1.674v-.013a1.654,1.654,0,0,1,1.648-1.661Zm4.145-8.27a1.654,1.654,0,1,1-1.654,1.654h0A1.656,1.656,0,0,1,23.063,18.283Zm0,4.145a1.654,1.654,0,1,1-1.654,1.654h0A1.656,1.656,0,0,1,23.063,22.428Zm4.132-8.264a1.641,1.641,0,1,1-1.641,1.641h0a1.639,1.639,0,0,1,1.637-1.641Zm0,4.119a1.654,1.654,0,1,1-1.641,1.667v-.013a1.645,1.645,0,0,1,1.637-1.654Zm0,8.27a1.664,1.664,0,1,1-1.641,1.686v-.026a1.647,1.647,0,0,1,1.633-1.661ZM31.339,10a1.664,1.664,0,1,1-1.667,1.661A1.664,1.664,0,0,1,31.339,10Zm0,12.428a1.664,1.664,0,1,1-.005,0Z" transform="translate(-9 -10)" fill="#606060" fill-rule="evenodd"/></svg>
                  </div>
                </div>
                <div class="headerRight">
                  <div class="circle">
                    <a-icon type="check" v-show="guideSelection == 'dpm'" />
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="guideOptionsInDesktop">
        <div class="guideTextPart2">
          <!-- To try the library, select a mode below and hit 'Start Scan' : -->
          To experience online barcode scanning, select a mode below and start scannning
        </div>
        <div class="optionColumns">
          <div class="optionColumn1 optionColumn">
            <div class="optionItemContainer" :class="{ selected: guideSelection == 'common-oned' }">
              <label>
                <input type="radio" name="guideOptions" value="common-oned" v-model="guideSelection"/>
                <div class="circle">
                  <a-icon type="check" v-show="guideSelection == 'common-oned'" />
                </div>
                <div class="itemHeader">Common 1D Barcodes</div>
                <div class="itemBody">
                  Code 39, Code 128, Code 93, Codabar, EAN 13, EAN 8, UPC A, UPC
                  E, Industrial 25, Code39 Extended, MSI Code
                </div>
              </label>
            </div>
          </div>
          <div class="optionColumn2 optionColumn">
            <div class="optionItemContainer" :class="{ selected: guideSelection == 'common-twod' }">
              <label>
                <input type="radio" name="guideOptions" value="common-twod" v-model="guideSelection"/>
                <div class="circle">
                  <a-icon type="check" v-show="guideSelection == 'common-twod'" />
                </div>
                <div class="itemHeader">Common 2D barcodes</div>
                <div class="itemBody">QR Code, Data Matrix, PDF417</div>
              </label>
            </div>
            <div class="optionItemContainer" :class="{ selected: guideSelection == 'common-oned-twod' }">
              <label>
                <input type="radio" name="guideOptions" value="common-oned-twod" v-model="guideSelection"/>
                <div class="circle">
                  <a-icon type="check" v-show="guideSelection == 'common-oned-twod'"/>
                </div>
                <div class="itemHeader">Common 1D + 2D</div>
              </label>
            </div>
          </div>
          <div class="optionColumn3 optionColumn">
            <div class="optionItemContainer" :class="{ selected: guideSelection == 'vin' }">
              <label>
                <input type="radio" name="guideOptions" value="vin" v-model="guideSelection"/>
                <div class="circle">
                  <a-icon type="check" v-show="guideSelection == 'vin'" />
                </div>
                <div class="itemHeader">
                  <span>VIN</span>
                  <svg viewBox="0 0 34 16.783" class="vinIcon invert"><g transform="translate(-522 -549.5)"><g transform="translate(522.5 550)"><g><path d="M542.37,562.739a2.87,2.87,0,1,0-2.87-2.87A2.869,2.869,0,0,0,542.37,562.739Z" transform="translate(-515.109 -546.957)" fill="none" stroke="#606060" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path d="M526.8,559h-4.3" transform="translate(-522.5 -546.087)" fill="none" stroke="#606060" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path d="M528.37,562.739a2.87,2.87,0,1,0-2.87-2.87A2.869,2.869,0,0,0,528.37,562.739Z" transform="translate(-521.196 -546.957)" fill="none" stroke="#606060" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path d="M543.848,559H529.5" transform="translate(-519.457 -546.087)" fill="none" stroke="#606060" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path d="M523.5,562.913v-5.022a2.153,2.153,0,0,1,2.152-2.152H527.8l2.474-4.946a1.433,1.433,0,0,1,1.283-.793h11.857a1.433,1.433,0,0,1,1.283.793l2.474,4.946h5.739a2.153,2.153,0,0,1,2.152,2.152v3.587a1.435,1.435,0,0,1-1.435,1.435H552.2" transform="translate(-522.065 -550)" fill="none" stroke="#606060" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path d="M545.87,554H526.5" transform="translate(-520.761 -548.261)" fill="none" stroke="#606060" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path d="M533,550v5.739" transform="translate(-517.935 -550)" fill="none" stroke="#606060" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/></g></g></g></svg>
                </div>
              </label>
            </div>
            <div class="optionItemContainer" :class="{ selected: guideSelection == 'driver-license' }">
              <label>
                <input type="radio" name="guideOptions" value="driver-license" v-model="guideSelection"/>
                <div class="circle">
                  <a-icon type="check" v-show="guideSelection == 'driver-license'" />
                </div>
                <div class="itemHeader">USA/CAN/ZA Driver's License</div>
              </label>
            </div>
          </div>
          <div class="optionColumn4 optionColumn">
            <div class="optionItemContainer" :class="{ selected: guideSelection == 'dpm' }">
              <label>
                <input type="radio" name="guideOptions" value="dpm" v-model="guideSelection"/>
                <div class="circle">
                  <a-icon type="check" v-show="guideSelection == 'dpm'" />
                </div>
                <div class="itemHeader">
                  <span> DPM Codes</span>
                </div>
                <div class="itemBody">
                  <div>Support Data Matrix only</div>
                  <div class="dpmIcon">
                    <svg viewBox="0 0 24 24" class="invert"><path d="M10.661,10A1.664,1.664,0,1,1,9,11.667v-.006A1.665,1.665,0,0,1,10.661,10Zm0,4.164A1.641,1.641,0,1,1,9,15.805,1.642,1.642,0,0,1,10.661,14.164Zm0,4.119A1.654,1.654,0,1,1,9,19.937,1.654,1.654,0,0,1,10.661,18.283Zm0,4.145A1.654,1.654,0,1,1,9,24.082,1.655,1.655,0,0,1,10.661,22.428Zm0,4.125A1.664,1.664,0,1,1,9,28.221v-.006A1.661,1.661,0,0,1,10.661,26.553Zm0,4.119A1.664,1.664,0,1,1,9,32.339H9A1.667,1.667,0,0,1,10.661,30.672Zm20.679,0a1.664,1.664,0,1,1-1.667,1.667,1.664,1.664,0,0,1,1.667-1.667Zm-4.145,0a1.664,1.664,0,1,1-1.641,1.686v-.019a1.653,1.653,0,0,1,1.638-1.667Zm-4.132,0a1.664,1.664,0,1,1-1.654,1.674v-.006A1.663,1.663,0,0,1,23.063,30.672Zm-4.145,0a1.664,1.664,0,1,1-1.654,1.674v-.006a1.66,1.66,0,0,1,1.653-1.667Zm-4.132,0a1.664,1.664,0,1,1-1.661,1.667h0a1.661,1.661,0,0,1,1.655-1.667Zm0-16.508a1.657,1.657,0,1,1-.008,0Zm0,8.264a1.657,1.657,0,1,1-.006,0ZM18.918,10a1.664,1.664,0,1,1-1.654,1.674v-.013A1.658,1.658,0,0,1,18.918,10Zm0,4.164a1.641,1.641,0,1,1-1.654,1.641,1.641,1.641,0,0,1,1.654-1.641Zm0,8.264a1.654,1.654,0,1,1-1.654,1.654h0a1.653,1.653,0,0,1,1.651-1.654Zm0,4.125a1.664,1.664,0,1,1-1.654,1.674v-.013a1.654,1.654,0,0,1,1.648-1.661Zm4.145-8.27a1.654,1.654,0,1,1-1.654,1.654h0A1.656,1.656,0,0,1,23.063,18.283Zm0,4.145a1.654,1.654,0,1,1-1.654,1.654h0A1.656,1.656,0,0,1,23.063,22.428Zm4.132-8.264a1.641,1.641,0,1,1-1.641,1.641h0a1.639,1.639,0,0,1,1.637-1.641Zm0,4.119a1.654,1.654,0,1,1-1.641,1.667v-.013a1.645,1.645,0,0,1,1.637-1.654Zm0,8.27a1.664,1.664,0,1,1-1.641,1.686v-.026a1.647,1.647,0,0,1,1.633-1.661ZM31.339,10a1.664,1.664,0,1,1-1.667,1.661A1.664,1.664,0,0,1,31.339,10Zm0,12.428a1.664,1.664,0,1,1-.005,0Z" transform="translate(-9 -10)" fill="#606060" fill-rule="evenodd"/></svg>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="btnContainer">
        <button class="startBtn" @click.once="startScanning">START SCAN</button>
      </div>
    </div>
    <div class="supportedBrowsersInfo">
      <span class="guideText-main">
        <div class="guideText">
          Using JavaScript barcode reader web SDK, you can turn any device with a camera into an enterprise-grade barcode scanner with high-speed functionalities and customization settings for different usage scenarios. Take this JavaScript barcode scanner demo and see how it works in different modes.
        </div>
        <div>
          Supported Browsers: Safari v11+, Chrome v59+, Firefox v52+ (v55+ on Android/iOS) and Edge v16+ on Desktop/Android/iOS.
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "Guide",
  components: {
  },
  data() {
    return {
      guideSelection: "",
    };
  },
  mounted() {
    this.guideSelection = "common-oned-twod";
  },
  methods: {
    startScanning() {
      setTimeout(() => {
        this.$router.push(`/${this.guideSelection}/${location.search}`);
        this.$store.commit("startScanning", this.guideSelection);
      }, 0);
    },
  },
  computed: {},
  watch: {},
});
</script>

<style scoped>
.guide {position: absolute;display: flex;flex-direction: column;width: 100%;height: 100%;background-color: #444444;z-index: 15;overflow: auto;}
.guide header {display: flex;flex-direction: row;justify-content: space-between;flex: 0 0 auto;align-items: center;height: 6.9vh;background-color: #222222;}

header .headerLeft {display: flex;flex-direction: row;align-items: center;}

.headerLeft .dynamsoftLogo {margin-left: 15px;font-size: 0;overflow: hidden;}
.headerLeft .dynamsoftLogo img {height: 3.7vh;max-width: 100%;}

.guideContainer {display: flex;flex-direction: column;flex: 1 1 auto;color: white;}
.guideContainer .guideTitle {margin-top: 3.8vh;text-align: center;}
.guideContainer .guideTitle > h1 {display: none;}
.guideContainer .guideTitle img {height: 4.9vh;max-width: 100%;}
.guideContainer .guideTextPart1 {margin: 2.4vh auto 0;max-width: 78.7%;font-family: "OpenSans-Regular";font-size: 12px;line-height: 18px;}
.guideContainer .guideOptions {display: flex;flex-direction: column;margin-top: 2.5vh;margin-left: 4%;margin-right: 5.9%;}
.guideOptions .optionRow {margin-top: 2.2vh;width: 100%;}
.guideOptions .optionRow:first-child {height: 13.5vh;min-height: 50px;margin-top: 0;}
.guideOptions .optionRow:nth-child(2) {height: 9vh;min-height: 50px;}
.guideOptions .optionRow:nth-child(3), .guideOptions .optionRow:nth-child(4) {display: flex;flex-direction: row;align-items: center;justify-content: space-between;height: 6.7vh;min-height: 25px;}

.optionItemContainer {display: flex;flex-direction: column;justify-content: center;background-color: #222222;border: 1px solid transparent;}
.optionItemContainer .invert {filter: invert();}
.optionItemContainer.selected {border: 1px solid #fe8e14;}

.guideOptions .optionRow:nth-child(3) .optionItemContainer,
.guideOptions .optionRow:nth-child(4) .optionItemContainer {height: 100%;display: flex;flex-direction: column;/* align-items: center; */justify-content: center;}
.guideOptions .optionRow:nth-child(3) .optionItemContainer:first-child, .guideOptions .optionRow:nth-child(4) .optionItemContainer:first-child {width: 46.6%;}
.guideOptions .optionRow:nth-child(3) .optionItemContainer:nth-child(2), .guideOptions .optionRow:nth-child(4) .optionItemContainer:nth-child(2) {width: 50%;}

.optionItemContainer input {display: none;}
.optionRow .optionItemContainer .itemHeader {display: flex;align-items: center;justify-content: space-between;margin-left: 3.2vw;margin-right: 2.7vw;font-size: 14px;line-height: 21px;}
.itemHeader .headerLeft {color: #dddddd;}
.guideOptions .optionRow:nth-child(4) .optionItemContainer .itemHeader .headerLeft {display: flex;flex-direction: row;align-items: center;}

.optionItemContainer .circle {display: flex;justify-content: center;align-items: center;border-radius: 50%;background-color: #f5f5f5;}
.optionItemContainer.selected .circle {background-color: #fe8e14;}

.optionRow .optionItemContainer .itemBody {margin-top: 1.3vh;margin-left: 3.2vw;margin-right: 4.5vw;font-family: "OpenSans-Regular";color: #999999;font-size: 12px;line-height: 20px;}
.itemHeader .headerLeft .vinIcon {margin-left: 12px;}
.itemHeader .headerLeft .dpmIcon {height: 24px;margin-left: 11px;}

.guideContainer .btnContainer {position: relative;flex-direction: column;align-items: center;flex: 1 1 auto;margin-top: 15px;}
.guideContainer .btnContainer .startBtn {position: absolute;top: 22%;width: 120px;height: 6vh;max-height: 40px;font-size: 14px;color: #fff;background-color: #fe8e14;border: none;cursor: pointer;user-select: none;transition: background-color 0.3s;}
.guideContainer .btnContainer .startBtn:hover {background-color: #ffae38;}

.supportedBrowsersInfo {display: flex;justify-content: center;align-items: center;font-family: "OpenSans-Regular";color: #aaaaaa;flex: 0 0 auto;overflow: auto;}
.supportedBrowsersInfo .guideText-main {display: inline-block;width: 100%;height: 100%;}

.copyrightInfo {display: flex;justify-content: center;align-items: center;color: #fff;font-family: "OpenSans-Regular";}

@media (min-width: 981px),screen and (max-width: 980px) and (orientation: landscape) {
  .guide header {margin-top: 4.3vh;background-color: transparent;}
  header .headerLeft {display: none;}
  .headerLeft .dynamsoftLogo {margin: auto;}
  .headerLeft .dynamsoftLogo img {height: 4.5vh;}

  .guideContainer .guideTitle {margin-top: 1.5vh;}
  .guideContainer .guideTitle img {height: 5.8vh;}
  .guideContainer .guideTextPart1 {margin: 5vh auto 0;width: 60%;min-width: 750px;max-width: auto;font-size: 16px;line-height: 26px;}
  .guideContainer .guideOptions {display: none;}
  .guideContainer .guideOptionsInDesktop {margin: 0 auto;margin-top: 6vh;width: 66.8%;min-width: 980px;}
  .guideContainer .guideOptionsInDesktop .guideTextPart2 {color: #cccccc;font-size: 18px;line-height: 26px;}
  .guideContainer .guideOptionsInDesktop .optionColumns {display: flex;flex-direction: row;justify-content: space-between;margin-top: 3vh;width: 100%;height: 19.4vh;min-height: 150px;}

  .optionColumn .optionItemContainer {position: relative;}
  .optionColumn .optionItemContainer>label {width: 100%;height: 100%;padding-left: 6.25%;cursor: pointer;}
  
  .optionColumn .optionItemContainer .itemHeader {display: flex;flex-direction: row;align-items: center;font-size: 18px;line-height: 26px;}
  .optionColumn .optionItemContainer .itemBody {width: 82.6%;font-size: 12px;color: #fff;font-family: "OpenSans-Regular";line-height: 20px;}
  .optionColumn .optionItemContainer:hover {background-color: #2E2E2E;}

  .guideOptionsInDesktop .optionItemContainer .circle {position: absolute;top: 1.3vh;right: 5.2%;width: 18px;height: 18px;font-size: 16px;}
  .guideOptionsInDesktop .optionColumn {display: flex;flex-direction: column;justify-content: space-between;height: 100%;width: 23.5%;}
  .guideOptionsInDesktop .optionColumn:nth-child(2) .optionItemContainer:nth-child(2) label,
  .guideOptionsInDesktop .optionColumn:nth-child(3) .optionItemContainer:nth-child(1) label,
  .guideOptionsInDesktop .optionColumn:nth-child(3) .optionItemContainer:nth-child(2) label {display: flex;flex-direction: column;justify-content: center;}
  .guideOptionsInDesktop .optionColumn:nth-child(1) .optionItemContainer,
  .guideOptionsInDesktop .optionColumn:nth-child(4) .optionItemContainer {height: 100%;}
  .guideOptionsInDesktop .optionColumn:nth-child(2) .optionItemContainer,
  .guideOptionsInDesktop .optionColumn:nth-child(3) .optionItemContainer {height: 43.3%;}
  .guideOptionsInDesktop .optionColumn:nth-child(1) .optionItemContainer .itemHeader,
  .guideOptionsInDesktop .optionColumn:nth-child(2) .optionItemContainer:nth-child(1) .itemHeader,
  .guideOptionsInDesktop .optionColumn:nth-child(4) .optionItemContainer .itemHeader {margin-top: 1.4vh;}
  .guideOptionsInDesktop .optionColumn:nth-child(1) .optionItemContainer .itemBody {margin-top: 2.5vh;}
  .guideOptionsInDesktop .optionColumn:nth-child(2) .optionItemContainer:nth-child(1) .itemBody {margin-top: 0.5vh;}
  .guideOptionsInDesktop .optionColumn:nth-child(4) .optionItemContainer:nth-child(1) .itemBody {margin-top: 2vh; }
  .guideOptionsInDesktop .vinIcon {margin-left: 9.1%;width: 22.3%;}
  .guideOptionsInDesktop .dpmIcon {width: 38.5px;height: 38.5px;margin-top: 10px;}

  .guideContainer .btnContainer .startBtn {top: 20%;left: 50%;width: 140px;height: 46px;transform: translateX(-50%);font-size: 18px;}
  .supportedBrowsersInfo {margin-left: 50%;margin-bottom: 5vh;height: 5.2vh;width: 66.8%;min-width: 980px;font-size: 16px;text-align: center;transform: translateX(-50%);}

  .supportedBrowsersInfo .guideText {display: none;}

  .copyrightInfo {margin-top: 2.1vh;height: 7.6vh;font-size: 16px;background-color: #222222;}
}

@media screen and (max-width: 980px) and (orientation: landscape) {
  .guide header {margin-top: 0;background-color: #222222;}
  header .headerLeft {display: flex;}
  .headerLeft .dynamsoftLogo {margin-left: 4vw;}
  .headerLeft .dynamsoftLogo img {height: 24px;}

  .guideContainer {justify-content: space-around;}
  .guideContainer .guideTitle {margin-top: 0;}
  .guideContainer .guideTitle img {height: 32.7px;}

  .optionRow .optionItemContainer .itemBody {overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
  .optionRow .optionItemContainer {height: 100%;}
  .optionItemContainer>label {display: flex;flex-direction: column;justify-content: center;width:100%;height: 100%;}

  .guideContainer .guideOptions {display: flex;}
  .guideContainer .guideOptionsInDesktop {display: none;}
  .guideContainer .guideOptions {margin-top: 0;}

  .guide .guideOptions .optionRow {height: 9vh;min-height: 50px;}

  .optionItemContainer .circle {width: 14px;height: 14px;font-size: 10px;}
  .guideContainer .btnContainer {position: static;display: flex;height: auto;flex: 0 0 auto;}
  .guideContainer .guideTextPart1 {display: none;}
  .guideContainer .btnContainer .startBtn {position: static;height: 6vh;width: 120px;font-size: 14px;transform: translateX(0);}

  .supportedBrowsersInfo {display: none;}
  .copyrightInfo {display: none;}
}
/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .guideContainer .guideTextPart1 {display: none;}

  .optionItemContainer>label {display: flex;flex-direction: column;justify-content: center;width:100%;height: 100%;}
}
@media screen and (max-height: 500px) {
  .guide {padding-bottom: 10px;}
  .guideTitle {padding: 10px 0 0 0;}

  .optionItemContainer>label {display: flex;flex-direction: column;justify-content: center;width:100%;height: 100%;}
}
@media screen and (orientation: portrait) {
  .guideContainer {overflow: auto;}
}
@media screen and (max-width: 980px) {
  .guide {background-color: rgba(50, 50, 52);}
  .guideContainer .btnContainer {display: flex;}

  .optionItemContainer.selected {border: 1px solid #fe8e14;}

  .supportedBrowsersInfo {background-color: #212121;}
  .supportedBrowsersInfo .guideText-main .guideText {margin-bottom: 10px;}
}
@media screen and (max-width: 980px) {
  .guideContainer .guideTextPart1 {margin: 2.5vh auto 0;width: 84%;min-width: 300px;max-width: auto;font-size: 16px;line-height: 26px;}
  .guideContainer .guideOptions[data-v-730248fc] {margin-left: 4%;margin-right: auto;margin-top: 3.5vh;width: 90.1%;}
  .guideContainer .guideOptionsInDesktop {display: none;}

  .optionRow .optionItemContainer {height: 100%;}
  .optionItemContainer .circle {width: 14px;height: 14px;font-size: 10px;}
  .supportedBrowsersInfo {padding: 10px 2.9vw 10px 5.3vw;height: 15vh;min-height: 50px;font-size: 12px;}
  .copyrightInfo {display: none;}
}
@media screen and (max-height: 580px) {
  .supportedBrowsersInfo {display: none;}
  .guide header {margin-top: 0;}
}
@media screen and (max-width: 500px) {
  .guideContainer .guideTextPart1 {font-size: 12px;line-height: 20px;}
}
</style>
