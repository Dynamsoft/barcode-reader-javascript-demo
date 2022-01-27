<template>
  <div
    class="fullImageLocalizationBtn sidebarBtn"
    @click="$store.commit('switchFullImageLocalization')"
    :style="{
      color: $store.state.isFullImageLocalization ? '#fe8e14' : '',
      backgroundColor: $store.state.isFullImageLocalization
        ? 'rgba(34, 34, 34, .8)'
        : '',
    }" 
  >
    <svg
      viewBox="0 0 21.579 18"
      :style="{ stroke: $store.state.isFullImageLocalization ? '#FE8E14' : '' }"
    >
      <g transform="translate(-184.574 -1703.26)">
        <g transform="translate(185.074 1703.76)">
          <g>
            <path
              d="M196.574,1717.76a4.5,4.5,0,1,0-4.5-4.5A4.5,4.5,0,0,0,196.574,1717.76Z"
              transform="translate(-186.285 -1704.76)"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
            />
            <path
              d="M208.074,1706.76v-2a1,1,0,0,0-1-1h-2"
              transform="translate(-187.495 -1703.76)"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
            />
            <path
              d="M208.074,1719.76v2a1,1,0,0,1-1,1h-2"
              transform="translate(-187.495 -1705.76)"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
            />
            <path
              d="M185.074,1706.76v-2a1,1,0,0,1,1-1h2"
              transform="translate(-185.074 -1703.76)"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
            />
            <path
              d="M185.074,1719.76v2a1,1,0,0,0,1,1h2"
              transform="translate(-185.074 -1705.76)"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
            />
          </g>
        </g>
      </g>
    </svg>
    <label> Full-image Localization </label>
  </div>
</template>

<script >
import Vue from "vue";
import "../../assets/css/sidebarBtn.css";

export default Vue.extend({
  name: "FullImageLocalizationBtn",
  components: {},
});
</script>

<style scoped>
@media (min-width: 981px),
  screen and (max-width: 980px) and (orientation: landscape) {
  .fullImageLocalizationBtn {
    flex-grow: 1;
  }
  .sidebarBtn svg {
    width: 30.18px;
    height: 24.93px;
  }
}
@media screen and (max-width: 980px) and (orientation: landscape) {
  .fullImageLocalizationBtn {
    flex-grow: 1;
  }
  .sidebarBtn svg {
    width: 20.58px;
    height: 17px;
  }
}
@media screen and (max-width: 980px) and (orientation: portrait) {
  .fullImageLocalizationBtn {
    flex-grow: 1;
  }
  .sidebarBtn svg {
    width: 20.58px;
    height: 17px;
  }
}
</style>
