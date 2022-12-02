<template>
  <div class="fullImageLocalizationBtn sidebarBtn" @click="$store.commit('switchFullImageLocalization')" @mouseenter="closeOtherPopover">
    <img v-show="$store.state.isFullImageLocalization" src="../../assets/image/icon-web-full-image.svg" alt="full-image">
    <img v-show="!$store.state.isFullImageLocalization" src="../../assets/image/icon-web-zonal.svg" alt="zonal">
    <label class="fullImageLabel"> {{$store.state.isFullImageLocalization ? "Full Image Scan" : "Zonal Scan"}} </label>
  </div>
</template>

<script >
import Vue from "vue";
import "../../assets/css/sidebarBtn.css";

export default Vue.extend({
  name: "FullImageLocalizationBtn",
  components: {},
  mounted() {},
  methods: {
    closeOtherPopover() {
      if(this.$store.state.isShowUseCasePopover) {
        this.$store.commit('switchUseCasePopover');
      }
      if(this.$store.state.isShowBarcodeFormatPopover) {
        this.$store.commit('switchBarcodeFormatPopover');
      }
      if(this.$store.state.isShowScanSettingsPopover) {
        this.$store.commit('switchScanSettingsPopover');
      }
    }
  }
});
</script>

<style scoped>
.fullImageLocalizationBtn {border-bottom: 1px solid #222222;  }

.fullImageLabel {font-family: "OpenSans-Regular";color: white;}

@media screen and (min-width: 980px) {
  .fullImageLocalizationBtn {height: 25%;}
  .fullImageLabel {margin-top: 5px;}
}

@media (min-width: 981px),screen and (max-width: 980px) and (orientation: landscape) {
  .sidebarBtn img {width: 30.18px;height: 24.93px;}
}

@media screen and (max-width: 980px) and (orientation: landscape) {
  .fullImageLocalizationBtn {width: 25%;}
  .sidebarBtn img {width: 20.58px;height: 17px;}
}

@media screen and (max-width: 980px) and (orientation: portrait) {
  .fullImageLocalizationBtn {width: 25%;}
  .sidebarBtn img {width: 20.58px;height: 17px;}
}

@media screen and (max-width: 420px) {
  .fullImageLabel {font-family: "Oswald-Regular";}
}
</style>
