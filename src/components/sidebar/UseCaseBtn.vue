<template>
  <div class="useCaseBtn" @mouseenter="$store.state.curSystem === 'Windows' && !$store.state.isShowUseCasePopover && $store.commit('switchUseCasePopover')" @click.stop="!($store.state.curSystem === 'Windows') && $store.commit('switchUseCasePopover')">
    <a-popover :placement="popoverPlacement" :visible="$store.state.isShowUseCasePopover">
      <template slot="content">
        <div class="useCaseOptions">
          <div class="useCaseOption" v-for="item in useCaseuseCaseOptions" :key="item.id" style="color: white">
            <label :class="{ selected: item.value === $store.state.selectedUseCase }">
              <input type="radio" name="useCaseOptions" :value="item.value" v-model="selectedUseCase"/>
              {{ item.label }}
            </label>
          </div>
        </div>
      </template>
      <div class="sidebarBtn" :style="{color: $store.state.isShowUseCasePopover ? '#fe8e14' : '',backgroundColor: $store.state.isShowUseCasePopover? 'rgba(64, 63, 63, .8)': ''}">
        <img class="generalIcon" v-show="curUsecase === 'General'" src="../../assets/image/icon-web-general.svg">
        <img class="vinIcon" v-show="curUsecase === 'VIN'" src="../../assets/image/icon-web-vin.svg">
        <img class="dlIcon" v-show="curUsecase === `Driver's License`" src="../../assets/image/icon-web-driver's-license.svg">
        <img class="dpmIcon" v-show="curUsecase === 'DPM Codes'" src="../../assets/image/icon-web-dpm.svg">
        <label class="curUseCaseLabel">{{ curUsecase }}</label>
      </div>
    </a-popover>
  </div>
</template>

<script>
import Vue from "vue";
import "../../assets/css/sidebarBtn.css";

export default Vue.extend({
  name: "UseCaseBtn",
  components: {},
  data() {
    return {
      popoverPlacement: document.body.clientWidth > 980 ? 'rightTop' : 'topLeft',
      useCaseuseCaseOptions: [
        { value: "general", label: "General" },
        { value: "vin", label: "Vehicle Identification Number (VIN)" },
        { value: "dl", label: "USA/CAN/ZA Driver's License" },
        { value: "dpm", label: "DPM Codes" },
      ],
      iconSrc: "",
      iconStyle: {}
    };
  },
  mounted() {
    document.addEventListener("click", () => {
      this.$store.commit("hideUseCasePopover");
    });
    window.addEventListener('resize', () => {
      if(document.body.clientWidth > 980) {
        this.popoverPlacement = 'rightTop';
      } else {
        this.popoverPlacement = 'topLeft';
      }
    })
  },
  methods: {},
  computed: {
    selectedUseCase: {
      get() {
        return this.$store.state.selectedUseCase;
      },
      set(value) {
        this.$store.commit("onSelectedUseCaseChange", value);
        switch (value) {
          case "general":
            this.$router.push(`/common-oned-twod.html${location.search}`);
            break;
          case "vin":
            this.$router.push(`/vin.html${location.search}`);
            break;
          case "dl": 
            this.$router.push(`/driver-license.html${location.search}`);
            break;
          case "dpm": 
            this.$router.push(`/dpm.html${location.search}`);
            break;
          default:
            break;
        }
      },
    },
    curUsecase() {
      switch (this.selectedUseCase) {
        case "general":
          return "General";
        case "vin":
          return "VIN";
        case "dl":
          return "Driver's License";
        case "dpm":
          return "DPM Codes";
        default:
          return "";
      }
    },
  },
  watch: {}
});
</script>

<style scoped>
.sidebarBtn {height: 100%;min-width: 90px;}
.curUseCaseLabel {font-family: "OpenSans-Regular";color: white;}

.useCaseOptions {display: flex;flex-direction: column;margin: -12px -16px;overflow: auto;height: auto; user-select: none;}
.useCaseOptions .useCaseOption {display: flex;position: relative;flex-direction: row;align-items: center;}
.useCaseOptions .useCaseOption input {position: absolute;top: 0;left: 0;opacity: 0;}
.useCaseOptions .selected {color: white;background-color: #fe8e14;}

.useCaseOption label {width: 100%;display: flex;flex-direction: row;justify-content: flex-start;align-items: center;padding: 10px 20px;color: #888888;transition: all 0.3s;background-color: #222222;cursor: pointer;font-family: "OpenSans-Regular";}

@media screen and (min-width: 980px) {
  .useCaseBtn {height: 25%;}
  .curUseCaseLabel {margin-top: 5px;}
}

@media (hover: hover) {
  .useCaseOption label:hover {color: white;background-color: #FEA543;}
}

@media (min-width: 981px), screen and (max-width: 980px) and (orientation: landscape) {
  .sidebarBtn {border-bottom: 1px solid #222222;}
  .sidebarBtn .generalIcon, .sidebarBtn .dpmIcon {width: 28px;height: 28px;}
  .sidebarBtn .vinIcon {width: 37px;height: 37px;}
  .sidebarBtn .dlIcon {width: 32px; height: 32px;}
  .useCaseOption label {width: 100%;height: 60px;font-size: 16px;}
}

@media screen and (max-width: 980px) and (orientation: landscape) {
  .useCaseBtn {width: 25%;}
  /* .sidebarBtn .generalIcon, .sidebarBtn .vinIcon, .sidebarBtn .dlIcon, .sidebarBtn .dpmIcon {width: 25px;height: 15px;} */
  .useCaseOption label {height: 40px;font-size: 14px;}
}

@media screen and (max-height: 500px) {
  .sidebarBtn img {width: 17px;height: 17px;display: none;}
}

/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .useCaseBtn {width: 25%;}
  .sidebarBtn .generalIcon, .sidebarBtn .dpmIcon {width: 18px;height: 18px;}
  .sidebarBtn .vinIcon, .sidebarBtn .dlIcon {width: 25px;height: 15px;}
}

@media screen and (max-width: 420px) {
  .curUseCaseLabel {font-family: "Oswald-Regular";}
}
</style>
