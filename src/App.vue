<template>
  <div id="app">
    <router-view></router-view>
    <copy-right-footer />
  </div>
</template>

<script >
import Vue from "vue";
import CopyRightFooter from "./components/CopyRightFooter.vue";
import "./dbr";
import "./dcp";
import { BarcodeScanner } from "dynamsoft-javascript-barcode";

export default Vue.extend({
  name: "App",
  components: {
    CopyRightFooter,
  },
  data() {
    return {
    };
  },
  beforeMount() {
    this.getCurrentEnv();
  }, 
  mounted() {
    this.$message.config({
      top: `80%`,
      maxCount: 3,
    });
  },
  methods: {
    getCurrentEnv() {
      const curEnv = BarcodeScanner.browserInfo;
      this.$store.state.curSystem = curEnv.OS;
    },
  }
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
html, body {
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
.ant-popover {
  font-family: "OpenSans-Regular";
}
.ant-switch {
  background-color: #666;
}
.ant-switch-checked {
  background-color: #FE8E14;
}
.ant-switch-loading, .ant-switch-disabled {
  opacity: 0.1;
}
.ant-popover-inner {
  background-color: #222222;
}
.ant-popover-placement-right > .ant-popover-content > .ant-popover-arrow, .ant-popover-placement-rightTop > .ant-popover-content > .ant-popover-arrow, .ant-popover-placement-rightBottom > .ant-popover-content > .ant-popover-arrow {
  display: none;
}
/* .ant-popover-placement-top > .ant-popover-content > .ant-popover-arrow, .ant-popover-placement-topLeft > .ant-popover-content > .ant-popover-arrow, .ant-popover-placement-topRight > .ant-popover-content > .ant-popover-arrow {
  display: none;
} */
@media (min-width: 981px),
  screen and (max-width: 980px) and (orientation: landscape) {
}
@media screen and (max-width: 980px) and (orientation: landscape) {
  [id*=comm100-float-button] {
    display: none !important;
    width: 1px !important;
    height: 1px !important;
    overflow: hidden !important;
  }
}
/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  [id*=comm100-float-button] {
    display: none !important;
    width: 1px !important;
    height: 1px !important;
    overflow: hidden !important;
  }
}

::-webkit-scrollbar{width: 19px;background-color: transparent;padding: 0 5px;}
::-webkit-scrollbar-thumb{background-color:#272626;border: 7px solid transparent;background-clip: content-box;}
::-webkit-scrollbar-corner{background-color: rgba(0,0,0,1);}
</style>
