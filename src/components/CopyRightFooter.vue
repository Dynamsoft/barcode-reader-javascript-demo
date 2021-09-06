<template>
  <div class="copyRightFooter">
    <a class="dynamsoftLogo" href="https://www.dynamsoft.com/" target="_blank">
      <img src="../assets/image/logo-dynamsoft-blackBg-190x47.png" />
    </a>
    <div class="copyrightInfo">
      <div>
        © 2003 – 2021 Dynamsoft. All rights reserved. Privacy Statement / Site
        Map
      </div>
    </div>
  </div>
</template>

<script >
import Vue from "vue";

export default Vue.extend({
  name: "App",
  components: {},
  mounted() {},
});
</script>

<style scoped>
.copyRightFooter {
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #222222;
}

.dynamsoftLogo img {
  height: 100%;
  max-height: 100%;
}
.copyrightInfo {
  color: #fff;
  font-family: "OpenSans-Regular";
}
@media (min-width: 981px),
  screen and (max-width: 980px) and (orientation: landscape) {
  .copyRightFooter {
    bottom: 0;
    height: 7.6vh;
    width: 100%;
    z-index: 15;
  }
  .dynamsoftLogo {
    height: 58.2%;
  }
  .copyrightInfo {
    margin-left: 3.3%;
    font-size: 16px;
  }
}
@media screen and (max-width: 980px) and (orientation: landscape) {
  .copyRightFooter {
    display: none;
  }
}
/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .copyRightFooter {
    display: none;
  }
}
</style>
