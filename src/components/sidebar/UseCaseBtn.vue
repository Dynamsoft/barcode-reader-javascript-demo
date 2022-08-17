<template>
  <div class="useCaseBtn" @click.stop="$store.commit('switchUseCasePopover')">
    <!-- placement="topLeft" -->
    <a-popover
      :placement="popoverPlacement"
      trigger="click"
      :visible="$store.state.isShowUseCasePopover"
    >
      <template slot="content">
        <div class="useCaseOptions">
          <div
            class="useCaseOption"
            v-for="item in useCaseuseCaseOptions"
            :key="item.id"
            style="color: white"
          >
            <label
              :class="{ selected: item.value === $store.state.selectedUseCase }"
            >
              <input
                type="radio"
                name="useCaseOptions"
                :value="item.value"
                v-model="selectedUseCase"
              />
              {{ item.label }}
            </label>
          </div>
        </div>
      </template>
      <div
        class="sidebarBtn"
        :style="{
          color: $store.state.isShowUseCasePopover ? '#fe8e14' : '',
          backgroundColor: $store.state.isShowUseCasePopover
            ? 'rgba(34, 34, 34, .8)'
            : '',
        }"
      >
        <svg
          viewBox="0 0 15.043 18"
          :style="{
            stroke: $store.state.isShowUseCasePopover ? '#fe8e14' : '',
          }"
        >
          <g transform="translate(-342.886 -1109.303)">
            <g transform="translate(346.165 1117.491)">
              <path
                d="M347.146,1120.2v4.967"
                transform="translate(-347.146 -1120.205)"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
              />
              <path
                d="M349.986,1120.2v3.193"
                transform="translate(-347.887 -1120.205)"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
              />
              <path
                d="M352.906,1120.2v4.967"
                transform="translate(-348.649 -1120.205)"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
              />
              <path
                d="M355.826,1120.2v3.193"
                transform="translate(-349.41 -1120.205)"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
              />
              <path
                d="M349.986,1126.445v.355"
                transform="translate(-347.887 -1121.833)"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
              />
              <path
                d="M355.826,1126.445v.355"
                transform="translate(-349.41 -1121.833)"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
              />
              <path
                d="M358.666,1120.2v4.967"
                transform="translate(-350.151 -1120.205)"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
              />
            </g>
            <g transform="translate(343.386 1109.803)">
              <g>
                <g>
                  <g>
                    <path
                      d="M357.429,1109.8H344.864a1.478,1.478,0,0,0,0,2.957H356.69a.739.739,0,0,1,.739.739v12.565a.739.739,0,0,1-.739.739H344.864a1.478,1.478,0,0,1-1.478-1.478v-14.043"
                      transform="translate(-343.386 -1109.803)"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1"
                    />
                    <path
                      d="M345.386,1111.8h11.826"
                      transform="translate(-343.908 -1110.325)"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1"
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <!-- <label> Use Case</label> -->
        <label> {{ curUsecase }}</label>
      </div>
    </a-popover>
  </div>
</template>

<script >
import Vue from "vue";
import "../../assets/css/sidebarBtn.css";

export default Vue.extend({
  name: "UseCaseBtn",
  components: {},
  data() {
    return {
      popoverPlacement: document.body.clientWidth > 980 ? 'rightTop' : 'top',
      useCaseuseCaseOptions: [
        { value: "general", label: "General" },
        {
          value: "vin",
          label: "Vehicle Identification Number (VIN)",
        },
        { value: "dl", label: "USA/CAN Driver's License" },
        { value: "dpm", label: "DPM Codes" },
      ],
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
        this.popoverPlacement = 'top';
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
            this.$router.push("/common-oned-twod.html");
            break;
          case "vin":
            this.$router.push("/vin.html");
            break;
          case "dl": 
            this.$router.push("/driver-license.html");
            break;
          case "dpm": 
            this.$router.push("/dpm.html");
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
  watch: {},
});
</script>

<style scoped>
.sidebarBtn {
  height: 100%;
  min-width: 90px;
}
.useCaseOptions {
  display: flex;
  flex-direction: column;
  margin: -12px -16px;
  overflow: auto;
  height: auto;
  user-select: none;
}
.useCaseOptions .useCaseOption {
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
}
.useCaseOptions .useCaseOption input {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.useCaseOption label {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  width: 150px;
  color: #888888;
  transition: all 0.3s;
  background-color: #323234;
  cursor: pointer;
}
@media (hover: hover) {
  .useCaseOption label:hover {
    color: white;
    background-color: #fe8e14;
  }
}
.useCaseOptions .selected {
  color: white;
  background-color: #fe8e14;
}
@media (min-width: 981px),
  screen and (max-width: 980px) and (orientation: landscape) {
  .useCaseBtn {
    flex-grow: 1;
  }
  .sidebarBtn svg {
    width: 20.6px;
    height: 24.93px;
  }
  .useCaseOption label {
    font-size: 18px;
    width: 200px;
    height: 80px;
  }
}
@media screen and (max-width: 980px) and (orientation: landscape) {
  .useCaseBtn {
    flex-grow: 3;
  }
  .sidebarBtn svg {
    width: 14.04px;
    height: 17px;
  }

  .useCaseOption label {
    width: 150px;
    height: 15vh;
    font-size: 14px;
  }
}
/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .useCaseBtn {
    flex-grow: 3;
  }
  .sidebarBtn svg {
    width: 14.04px;
    height: 17px;
  }
}
</style>
