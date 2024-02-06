<template>
  <div class="copyrightFooter">
    <a class="dynamsoftLogo" href="https://www.dynamsoft.com/" target="_blank">
      <img src="../assets/image/logo-dynamsoft-blackBg-190x47.png" alt="Dynamsoft"/>
    </a>
    <div class="copyrightInfo">
      <div>
        © 2003 – {{new Date().getUTCFullYear()}} Dynamsoft. All rights reserved.
        <a href="https://www.dynamsoft.com/PrivacyStatement.aspx" target="_blank">Privacy Statement</a>
        /
        <a href="https://www.dynamsoft.com/SiteMap.aspx" target="_blank">Site Map</a>.
      </div>
      <div>
        This site is protected by reCAPTCHA and the Google
        <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and
        <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.
      </div>
    </div>
  </div>
</template>

<script >
import Vue from "vue";

export default Vue.extend({
  name: "CopyrightFooter",
  components: {},
  mounted() {},
});
</script>

<style scoped>
.copyrightFooter {position: absolute;display: flex;flex-direction: row;justify-content: center;align-items: center;background-color: #222222;}
.dynamsoftLogo img {height: 100%;max-height: 100%;}
.copyrightInfo {color: #fff;font-family: "OpenSans-Regular";}

@media (min-width: 981px),
  screen and (max-width: 980px) and (orientation: landscape) {
  .copyrightFooter {bottom: 0;min-height: 48px;height: 6vh;width: 100%;z-index: 40;}
  .dynamsoftLogo {height: 58.2%;}
  .copyrightInfo {margin-left: 3.3%;font-size: 16px;}
}
@media screen and (max-width: 980px) and (orientation: landscape) {
  .copyrightFooter {display: none;}
}
/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .copyrightFooter {display: none;}
}
</style>
