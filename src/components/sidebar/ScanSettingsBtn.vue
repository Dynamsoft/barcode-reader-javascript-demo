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
          <div class="optionRows">
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
  },
  computed: {
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
    padding-top: 25px;
    padding-bottom: 25px;
    padding-left: 25px;
    font-size: 18px;
  }
  .optionRows .optionRow {
    margin-top: 19px;
  }
  .optionRows .optionRow:nth-child(1) {
    margin-top: 0;
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
    max-height: 80vh;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 18px;
    font-size: 14px;
    overflow: auto;
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
    padding-top: 25px;
    padding-bottom: 25px;
    padding-left: 18px;
    font-size: 14px;
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
