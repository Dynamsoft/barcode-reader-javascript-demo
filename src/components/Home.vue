<template>
  <div class="home">
    <header>
      <div class="headerLeft">
      </div>
      <div class="headerRight">
        <div class="linkInMobile">
          <a
            class="trialLink"
            href="https://www.dynamsoft.com/barcode-reader/downloads/#javascript"
            target="_blank"
            @click="recordClickDownload"
          >
            Download Free Trial
            <a-icon
              type="right"
              style="font-size: 12px; transform: scale(0.7)"
            />
          </a>
        </div>
        <div class="linkInDesktop">
          <a
            class="trialLink"
            href="https://www.dynamsoft.com/barcode-reader/downloads/#javascript"
            target="_blank"
            @click="recordClickDownload"
          >
            DOWNLOAD FREE TRIAL
          </a>
        </div>
      </div>
    </header>
    <copy-right-footer />
  </div>
</template>

<script >
import Vue from "vue";
import CopyRightFooter from "./CopyRightFooter.vue";

export default Vue.extend({
  components: { 
    CopyRightFooter, 
    },
  name: "Home",
  props: {},
  data() {
    return {
      clickDownloadTimes: 0,
    };
  },
  mounted() {
  },
  methods: {
    recordClickDownload() {
      this.clickDownloadTimes++;
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #d1d1d1;
}
.home header {
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(50, 50, 52, 0.49);
  z-index: 10;
}
header .headerLeft {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 146px;
  height: 100%;
}
header .headerRight {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
}
.headerRight .linkInMobile .trialLink {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  color: #fff;
}
.headerRight .linkInDesktop {
  height: 70%;
}
.headerRight .linkInDesktop .trialLink {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 28px;
  height: 100%;
  font-size: 18px;
  color: #fff;
  background-color: #fe8e14;
}

@media (min-width: 981px),
  screen and (max-width: 980px) and (orientation: landscape) {
  .home header {
    height: 7.7vh;
  }
  header .headerRight {
    padding-right: 81px;
  }
  .headerRight .linkInMobile {
    display: none;
  }
}
@media screen and (max-width: 980px) and (orientation: landscape) {
  .home header {
    height: 10vh;
  }
  header .headerLeft {
    margin-left: 150px;
  }
  header .headerRight {
    padding-right: 12px;
  }
  .headerRight .linkInMobile {
    display: block;
  }
  .headerRight .linkInDesktop {
    display: none;
  }
}
/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .home header {
    height: 6.9vh;
  }
  header .headerRight {
    padding-right: 12px;
  }
  .headerRight .linkInDesktop {
    display: none;
  }
}
</style>
