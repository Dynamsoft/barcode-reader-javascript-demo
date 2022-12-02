<template>
  <div class="copyRightFooter">
    <a class="dynamsoftLogo" href="https://www.dynamsoft.com/" target="_blank">
      <img src="../assets/image/logo-dynamsoft-blackBg-190x47.png" alt="dynamsoft"/>
    </a>
    <div class="copyrightInfo">
      <div>
        © 2003 – 2022 Dynamsoft. All rights reserved.
        <a href="https://www.dynamsoft.com/PrivacyStatement.aspx" target="_blank" >Privacy Statement</a>
        /
        <a href="https://www.dynamsoft.com/SiteMap.aspx" target="_blank">Site Map</a>
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
.copyRightFooter {position: absolute;display: flex;flex-direction: row;justify-content: center;align-items: center;background-color: #222222;}
.dynamsoftLogo img {height: 100%;max-height: 100%;}
.copyrightInfo {color: #fff;font-family: "OpenSans-Regular";}

@media (min-width: 981px),
  screen and (max-width: 980px) and (orientation: landscape) {
  .copyRightFooter {bottom: 0;height: 6vh;width: 100%;z-index: 40;}
  .dynamsoftLogo {height: 58.2%;}
  .copyrightInfo {margin-left: 3.3%;font-size: 16px;}
}
@media screen and (max-width: 980px) and (orientation: landscape) {
  .copyRightFooter {display: none;}
}
/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .copyRightFooter {display: none;}
}
</style>
