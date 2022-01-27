<template>
  <div class="home">
    <header>
      <div class="headerLeft">
      </div>
      <div class="headerRight">
        <div class="linkInMobile">
          <a
            class="codeLink"
            href="https://github.com/Dynamsoft/barcode-reader-javascript-demo"
            target="_blank"
            @click="recordClickLink('codeLink')"
          >
            GET DEMO CODE
            <svg class="downloadCodeIcon" viewBox="0 0 18 18">
              <g transform="translate(-519 -1339)">
                <g transform="translate(520 1340)">
                  <path
                    d="M528,1356a8,8,0,1,0-8-8A8,8,0,0,0,528,1356Z"
                    transform="translate(-520 -1340)"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <path
                    d="M531,1352.274V1344.5"
                    transform="translate(-523 -1340.387)"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <path
                    d="M533.554,1352l-4.027,5.027L525.5,1352"
                    transform="translate(-521.527 -1344.02)"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </g>
              </g>
            </svg>
          </a>
        </div>
        <div class="linkInDesktop">
          <a
            class="codeLink"
            href="https://github.com/Dynamsoft/barcode-reader-javascript-demo"
            target="_blank"
            @click="recordClickLink('codeLink')"
          >
            GET DEMO CODE
            <svg class="downloadCodeIcon" viewBox="0 0 18 18">
              <g transform="translate(-519 -1339)">
                <g transform="translate(520 1340)">
                  <path
                    d="M528,1356a8,8,0,1,0-8-8A8,8,0,0,0,528,1356Z"
                    transform="translate(-520 -1340)"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <path
                    d="M531,1352.274V1344.5"
                    transform="translate(-523 -1340.387)"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <path
                    d="M533.554,1352l-4.027,5.027L525.5,1352"
                    transform="translate(-521.527 -1344.02)"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </g>
              </g>
            </svg>
          </a>
          <a
            class="sdkLink"
            href="https://www.dynamsoft.com/barcode-reader/downloads/#javascript"
            target="_blank"
            @click="recordClickLink('sdkLink')"
          >
            DOWNLOAD SDK
          </a>
        </div>
      </div>
    </header>
  </div>
</template>

<script >
import Vue from "vue";

export default Vue.extend({
  name: "Home",
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
.headerRight .linkInMobile .codeLink {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  color: #fff;
}
.headerRight .linkInMobile .codeLink .downloadCodeIcon {
  margin-left: 3px;
  margin-top: 2px;
  width: 14px;
  height: 14px;
  stroke: #fff;
}
.headerRight .linkInDesktop {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 65%;
}
.headerRight .linkInDesktop a {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 16px;
}
.headerRight .linkInDesktop .codeLink {
  width: 146px;
}
.headerRight .linkInDesktop .codeLink:hover {
  color: #ffae38;
}
.headerRight .linkInDesktop .codeLink .downloadCodeIcon {
  margin-left: 5px;
  width: 16px;
  height: 16px;
  stroke: #fe8e14;
  transition: stroke 0.3s;
}
.headerRight .linkInDesktop .codeLink:hover .downloadCodeIcon {
  stroke: #ffae38;
}
.headerRight .linkInDesktop .sdkLink {
  width: 160px;
  margin-left: 15px;
  color: #fff;
  background-color: #fe8e14;
  transition: background-color 0.3s;
}
.headerRight .linkInDesktop .sdkLink:hover {
  background-color: #ffae38;
}

@media (min-width: 981px),
  screen and (max-width: 980px) and (orientation: landscape) {
  .home header {
    height: 7.7vh;
  }
  header .headerRight {
    padding-right: 25px;
  }
  .headerRight .linkInMobile {
    display: none;
  }
}
@media screen and (max-width: 980px) {
  .headerLeft .liveChatIcon {
    margin-left: 100px;
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
  .headerLeft .liveChatIcon {
    margin-left: 60px;
  }
}
@media screen and (max-width: 350px) {
  .headerLeft .liveChatIcon {
    margin-left: 30px;
  }
  .headerRight .linkInMobile .codeLink {
    margin-left: 10px;
  }
}
</style>
