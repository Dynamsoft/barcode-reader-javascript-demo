<template>
  <div id="app">
    <home v-if="$store.state.isStartScanning" />
    <sidebar v-if="$store.state.isStartScanning" />
    <barcode-scanner v-if="$store.state.isStartScanning" />
    <guide v-if="!$store.state.isStartScanning" />
    <copy-right-footer />
  </div>
</template>

<script >
import Vue from "vue";
import Home from "./components/Home.vue";
import Sidebar from "./components/Sidebar.vue";
import BarcodeScanner from "./components/BarcodeScanner.vue";
import Guide from "./components/Guide.vue";
import CopyRightFooter from "./components/CopyRightFooter.vue";

export default Vue.extend({
  name: "App",
  components: {
    Home,
    Sidebar,
    BarcodeScanner,
    Guide,
    CopyRightFooter,
  },
  mounted() {
    this.$message.config({
      top: `80%`,
      maxCount: 3,
    });
  },
});
</script>

<style>
@font-face {
font-family: "Oswald-Regular";
src: url("./assets/font/Oswald-Regular.ttf");
}
@font-face {
font-family: "Oswald-Light";
src: url("./assets/font/Oswald-Light.ttf");
}
@font-face {
font-family: "OpenSans-Regular";
src: url("./assets/font/OpenSans-Regular.ttf");
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
html,
body {
  width: 100%;
  height: 100%;
  min-width: 300px;
  font-family: "Oswald-Regular";
}
ul {
  padding: 0;
  margin: 0;
}
li {
  list-style: none;
}
#app {
  position: relative;
  height: 100%;
}

@media (min-width: 981px),
  screen and (max-width: 980px) and (orientation: landscape) {
  #comm100-float-button-2 {
    position: fixed !important;
    top: 43.9vh !important;
    right: -9px !important;
    left: auto !important;
    /* width: 1px !important;
    height: 1px !important; */
    overflow: hidden !important;
    cursor: pointer !important;
  }
}
@media screen and (max-width: 980px) and (orientation: landscape) {
  #comm100-float-button-2 {
    display: none !important;
    width: 1px !important;
    height: 1px !important;
    overflow: hidden !important;
  }
}
/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  #comm100-float-button-2 {
    display: none !important;
    width: 1px !important;
    height: 1px !important;
    overflow: hidden !important;
  }
}
</style>
