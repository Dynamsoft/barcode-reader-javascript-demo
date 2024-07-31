<script setup lang="ts">
import { onBeforeMount } from "vue";
import { Router, useRouter } from "vue-router";
import { useUseCaseStore } from "../stores/useCase";
import { useIsShowGuideStore } from "../stores/isShowGuide";
import { urlMap } from "../util";
import GuideOptionsInDesktop from "../components/Guide/GuideOptionsInDesktop.vue";
import GuideOptionsInMobile from "../components/Guide/GuideOptionsInMobile.vue";
import HeaderInMobile from "../components/Guide/HeaderInMobile.vue";

const useCaseStore = useUseCaseStore();
const router: Router = useRouter();
const isShowGuideStore = useIsShowGuideStore();

onBeforeMount(() => {
  isShowGuideStore.updateIsShowGuide(true);
});

const startScan = async () => {
  await router.push(urlMap[useCaseStore.useCaseName] + location.search);
  isShowGuideStore.updateIsShowGuide(false);
};
</script>

<template>
  <HeaderInMobile />
  <div class="dbr-guide">
    <div class="dbr-guide-title">
      <h1>Dynamsoft Barcode Reader | JavaScript Barcode Reader Demo</h1>
      <img src="../assets/image/dbr.svg" alt="dynamsoft-barcode-reader" />
    </div>
    <div class="dbr-guide-text-part1">
      Using Dynamsoft Barcode Reader JavaScript Edition, you can turn any device with a camera into an enterprise-grade
      barcode scanner with high-speed performance and flexible customization to suit a wide range of use cases. Try our
      JavaScript barcode scanner demo to see it in action!
    </div>
    <GuideOptionsInDesktop />
    <GuideOptionsInMobile />
    <div class="dbr-start-scan-btn">
      <button
        @click="
          () => {
            startScan();
          }
        "
      >
        START SCAN
      </button>
    </div>
  </div>
</template>

<style scoped lang="less">
.dbr-guide {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #444444;
  overflow: auto;

  .dbr-guide-title {
    text-align: center;
    @media (max-width: 980px) {
      margin-top: 3.8vh;
    }
    h1 {
      display: none;
    }
    img {
      height: 5.8vh;
      @media (max-width: 980px) {
        height: 4.9vh;
      }
      @media (max-width: 980px) and (max-height: 620px) and (orientation: landscape) {
        height: 32.7px;
      }
    }
  }

  .dbr-guide-text-part1 {
    width: 60%;
    margin: 5vh auto 0;
    min-width: 750px;
    max-width: auto;
    font-size: 16px;
    line-height: 26px;
    color: white;
    font-family: "OpenSans-Regular";

    @media (max-width: 980px) {
      display: none;
    }
  }

  .dbr-start-scan-btn {
    text-align: center;
    margin-top: 5vh;
    button {
      width: 140px;
      height: 45px;
      background-color: #fe8e14;
      color: white;
      cursor: pointer;
      font-size: 18px;
      line-height: 45px;
      text-align: center;
      border: none;

      @media (max-width: 980px) {
        width: 120px;
        height: 6vh;
        max-height: 40px;
        line-height: inherit;
        font-size: 14px;
      }
    }
  }
  @media (max-width: 980px) {
    height: 93%;
    display: block;
    position: absolute;
    top: 7%;
    background-color: rgba(50, 50, 52);
  }
}
</style>
