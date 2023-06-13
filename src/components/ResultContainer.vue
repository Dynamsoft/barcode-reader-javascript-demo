<template>
  <div>
    <ul
      class="resultContainer"
    >
      <li
        v-for="(value, name) in decodeRecords"
        :key="name"
        class="result"
        :data-clipboard-text="name.slice(name.indexOf('_dbrkey_') + 8)"
        v-show="value > 1"
      >
        <div class="barcodeFormat">
          {{ name.slice(0, name.indexOf("_dbrkey_")) }}
          <div class="break">:</div>
        </div>
        <div class="resultMain">
          <div class="resultText" @click="copyResult('.result')">
            {{
              name.slice(0, name.indexOf("_dbrkey_")) ===
                "PHARMACODE_ONE_TRACK" ||
              name.slice(0, name.indexOf("_dbrkey_")) === "PHARMACODE_TWO_TRACK"
                ? pharmacodeResult
                : name.slice(name.indexOf("_dbrkey_") + 8)
            }}
          </div>
          <div class="break">-</div>
          <div class="copyBtn" @click="copyResult('.result')">Copy</div>
        </div>
        <div class="counter">
          {{ value + "x" }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from "vue";
import Clipboard from "clipboard";

export default Vue.extend({
  name: "ResultContainer",
  props: {
    decodeRecords: {
      type: Object,
      require: true
    },
    pharmacodeResult: {
      type: String,
      require: true
    }
  },
  data() {
    return {};
  },
  methods: {
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
  },
});
</script>

<style scoped>
.resultContainer {position: absolute;left: 50%;margin-bottom: 5px;min-width:600px;max-height: 30%;font-family: "OpenSans-Regular";text-align: center;transform: translateX(-50%);overflow: auto;}
.resultContainer>.result {display: flex;flex-direction: row;align-items: center;margin-bottom: 1px;padding: 5px 0;color: #dddddd;background-color: rgba(34, 34, 34, 0.42);border-left: none;border-right: none;}
.resultContainer>.result>.barcodeFormat {display: flex;flex-direction: row;justify-content: space-between;align-items: center;width: 25%;text-align: left;word-break: break-all;}
.resultContainer>.result>.resultMain {display: flex;flex-direction: row;align-items: center;max-width: 60%;flex: 1 1 auto;}
.resultContainer>.result>.resultMain>.resultText {white-space: nowrap;overflow: hidden;text-overflow: ellipsis;cursor: pointer;}
.resultContainer>.result>.resultMain>.copyBtn {color: #fe8e14;cursor: pointer;}
.resultContainer>.result>.counter {width: 15%;border-left: none;border-right: none;}

@media (min-width: 981px), screen and (max-width: 980px) and (orientation: landscape) {
  .resultContainer {width: 47.7%;bottom: 13%;font-size: 20px;line-height: 22px;}
  .resultContainer>.result {min-height: 60px;}
  .resultContainer>.result>.barcodeFormat {padding-left: 22px;}
  .resultContainer>.result>.resultMain {padding-left: 10px;}
  .resultContainer>.result>.resultMain>.break {padding-left: 10px;}
  .resultContainer>.result>.resultMain>.copyBtn {padding-left: 10px;font-size: 16px;}
  .resultContainer>.result>.counter {padding-right: 10px;padding-left: 10px;}
}

@media screen and (max-width: 980px) and (orientation: landscape) {
  .resultContainer {width: 73.9%;bottom: 22%;font-size: 12px;}
  .resultContainer>.result>.barcodeFormat {padding-left: 5px;}
  .resultContainer>.result>.resultMain {padding-left: 5px;}
  .resultContainer>.result>.resultMain>.break {padding-left: 5px;}
  .resultContainer>.result>.resultMain>.copyBtn {padding-left: 5px;}
  .resultContainer>.result>.counter {padding-right: 10px;padding-left: 10px;}
}

/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .resultContainer {min-width:330px;width: 73.9%;bottom: 17.1%;font-size: 12px;}
  .resultContainer>.result>.barcodeFormat {padding-left: 5px;}
  .resultContainer>.result>.resultMain {padding-left: 5px;}
  .resultContainer>.result>.resultMain>.break {padding-left: 5px;}
  .resultContainer>.result>.resultMain>.copyBtn {padding-left: 5px;}
  .resultContainer>.result>.counter {padding-right: 5px;padding-left: 5px;}
}
</style>
