<template>
  <div class="sidebar">
    <use-case-btn />
    <barcode-format-btn />
    <full-image-localization-btn />
    <scan-settings-btn :isUploadImage="isUploadImage" :bScannerCreated="bScannerCreated"/>
  </div>
</template>

<script>
import Vue from "vue";
import BarcodeFormatBtn from "./sidebar/BarcodeFormatBtn.vue";
import FullImageLocalizationBtn from "./sidebar/FullImageLocalizationBtn.vue";
import ScanSettingsBtn from "./sidebar/ScanSettingsBtn.vue";
import UseCaseBtn from "./sidebar/UseCaseBtn.vue";

export default Vue.extend({
  name: "Sidebar",
  components: {
    BarcodeFormatBtn,
    FullImageLocalizationBtn,
    ScanSettingsBtn,
    UseCaseBtn,
  },
  props: ["isUploadImage", "bSupportFocus", "bScannerCreated"],
  data() {
    return {
      clientWidth: document.body.clientWidth,
      bDebug: location.search.includes('debug=true')
    }
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.clientWidth = document.body.clientWidth;
    })
  },
});
</script>

<style scoped>
.sidebar {position: absolute;display: flex;background-color: #000000;z-index: 40;user-select: none;}

.screenshot {position: absolute;right: 20px;top: -70px;width: 50px;height: 50px;background-color: rgba(0,0,0,0.6);border-radius: 50%;color: #ffffff;cursor: pointer;font-size: 18px;z-index: 30;}

.screenshotIcon {position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);width: 20px;height: 20px;fill: #fff;vertical-align: baseline;}

@media (min-width: 981px), screen and (max-width: 980px) and (orientation: landscape) {
  .sidebar {flex-direction: column;top: 19.5vh;left: 3.2vw;width: 140px;min-width: 140px;height: 40vh;min-height: 360px;}
}

@media screen and (max-width: 980px) and (orientation: landscape) {
  .sidebar {flex-direction: row;top: auto;left: 50%;bottom: 0;width: 100%;min-height: auto;height: 10%;min-height: auto;transform: translateX(-50%);}
}

/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .sidebar {flex-direction: row;left: 50%;bottom: 0;height: 9vh;width: 100%;transform: translateX(-50%);}
}
</style>
