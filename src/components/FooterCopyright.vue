<script setup lang="ts">
import { ref } from "vue";
import { useIsShowGuideStore } from "../stores/isShowGuide";

const isMobile = ref(document.body.clientWidth < 980);
window.addEventListener("resize", () => {
  isMobile.value = document.body.clientWidth < 980;
});

const isShowGuideStore = useIsShowGuideStore();
</script>

<template>
  <div class="dbr-copyright" v-show="(!isShowGuideStore.isShowGuide && !isMobile) || isShowGuideStore.isShowGuide">
    <div class="dbr-supported-browsers-info" v-show="isShowGuideStore.isShowGuide">
      Supported Browsers: Safari v14+, Chrome v78+, Firefox v62+ and Edge v79+ on Desktop/Android/iOS.
    </div>
    <a href="https://www.dynamsoft.com/" target="_blank" class="logo">
      <img src="../assets/image/logo-dynamsoft-blackBg-190x47.png" alt="logo" />
    </a>
    <div class="dbr-copyright-info">
      <div>
        {{ `© 2003 - ${new Date().getUTCFullYear()} Dynamsoft. All rights reserved.` }}
        <a href="https://www.dynamsoft.com/privacy-statement/" target="_blank">Privacy Statement</a>
        /
        <a href="https://www.dynamsoft.com/sitemap/" target="_blank">Site Map</a>.
      </div>
      <div>
        This site is protected by reCAPTCHA and the Google
        <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a>
        and
        <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a>
        apply.
      </div>
    </div>
    <p class="dbr-product-info-in-mobile-part1">
      Using Dynamsoft Barcode Reader JavaScript Edition, you can turn any device with a camera into an enterprise-grade
      barcode scanner with high-speed performance and flexible customization to suit a wide range of use cases. Try our
      JavaScript barcode scanner demo to see it in action!
    </p>
    <p class="dbr-product-info-in-mobile-part2">
      Supported Browsers: Safari v14+, Chrome v78+, Firefox v62+ and Edge v79+ on Desktop/Android/iOS.
    </p>
    <p class="dbr-product-info-in-mobile-part3">
      This site is protected by reCAPTCHA and the Google
      <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a>
      and
      <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a>
      apply.
    </p>
  </div>
</template>

<style scoped lang="less">
.dbr-copyright {
  width: 100%;
  height: 6vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  background-color: #222222;

  .dbr-supported-browsers-info {
    position: absolute;
    top: -80%;
    font-family: "OpenSans-Regular";
    color: #aaaaaa;

    @media (max-height: 620px) {
      display: none;
    }

    @media (max-width: 980px) {
      display: none;
    }
  }

  .logo {
    height: 55%;

    img {
      height: 100%;
    }

    @media (max-width: 980px) {
      display: none;
    }
  }

  .dbr-copyright-info {
    color: #fff;
    margin-left: 3.3%;

    a {
      color: #fe8e14;
      text-decoration: none;
      background-color: transparent;
      outline: none;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #fea543 !important;
      }
    }

    :nth-child(1),
    :nth-child(2) {
      font-family: "OpenSans-Regular";
    }

    @media (max-width: 980px) {
      display: none;
    }
  }

  .dbr-product-info-in-mobile-part1,
  .dbr-product-info-in-mobile-part2,
  .dbr-product-info-in-mobile-part3 {
    font-size: 12px;
    font-family: "OpenSans-Regular";
    color: #aaaaaa;
    margin-bottom: 10px;

    @media (min-width: 980px) {
      display: none;
    }
  }

  .dbr-product-info-in-mobile-part3 {
    a {
      color: #fe8e14;
      text-decoration: none;
      background-color: transparent;
      outline: none;
      font-family: "OpenSans-Regular";
      transition: color 0.3s;

      &:hover {
        color: #fea543 !important;
      }
    }
  }

  @media (max-width: 980px) {
    display: block;
    height: 15vh;
    background-color: #212121;
    padding: 10px 2.9vw 10px 5.3vw;
    overflow: auto;
  }

  @media (max-height: 500px) {
    display: none;
  }
}
</style>
