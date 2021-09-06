<template>
  <div class="sidebar">
    <use-case-btn />
    <barcode-format-btn />
    <full-image-localization-btn />
    <scan-settings-btn />
  </div>
</template>

<script >
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
});
</script>

<style scoped>
.sidebar {
  position: absolute;
  display: flex;
  /* justify-content: space-around; */
  background-color: rgba(50, 50, 52, 0.9);
  z-index: 15;
  user-select: none;
}
@media (min-width: 981px),
  screen and (max-width: 980px) and (orientation: landscape) {
  .sidebar {
    flex-direction: column;
    top: 19.5vh;
    left: 3.2vw;
    width: 140px;
    min-width: 140px;
    height: 46.5vh;
    min-height: 360px;
  }
}

@media screen and (max-width: 980px) and (orientation: landscape) {
  .sidebar {
    flex-direction: row;
    top: auto;
    left: 50%;
    bottom: 1%;
    width: 70%;
    min-height: auto;
    height: 15%;
    min-height: auto;
    transform: translateX(-50%);
  }
}
/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .sidebar {
    flex-direction: row;
    left: 50%;
    bottom: 0;
    height: 9vh;
    width: 100%;
    transform: translateX(-50%);
  }
}
</style>
