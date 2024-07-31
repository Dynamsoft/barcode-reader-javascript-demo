<script setup lang="ts">
import { ref, Ref, computed } from "vue";
import { Popover } from "ant-design-vue";
import { useUseCaseStore } from "../../stores/useCase";
import { usePopoverOpenStore } from "../../stores/popoverOpen";

type AllowModeName = "general" | "vin" | "dl" | "dpm";
type PopoverPlacement = "rightTop" | "topLeft";

const useCaseStore = useUseCaseStore();
const popoverOpenStore = usePopoverOpenStore();

const useCaseList: Ref<
  {
    key: AllowModeName;
    label: string;
    belong: string[];
  }[]
> = ref([
  {
    key: "general",
    label: "General",
    belong: ["1d", "2d", "1d2d"],
  },
  {
    key: "vin",
    label: "Vehicle Identification Number (VIN)",
    belong: ["vin"],
  },
  {
    key: "dl",
    label: "USA/CAN/ZA Driver's License",
    belong: ["dl"],
  },
  {
    key: "dpm",
    label: "Direct Part Marking Codes",
    belong: ["dpm"],
  },
]);

const placement: Ref<PopoverPlacement> = ref(document.body.clientWidth > 980 ? "rightTop" : "topLeft");
const shouldShowArrow = ref(document.body.clientWidth < 980);

window.addEventListener("resize", () => {
  const isWideScreen = document.body.clientWidth > 980;
  placement.value = isWideScreen ? "rightTop" : "topLeft";
  shouldShowArrow.value = !isWideScreen;
});

const currentUseCaseName = computed(() => {
  const _nameMap = {
    "1d": "General",
    "2d": "General",
    "1d2d": "General",
    vin: "VIN",
    dl: "Driver's License",
    dpm: "DPM Codes",
  };
  return _nameMap[useCaseStore.useCaseName];
});

const changeUseCase = (modeName: AllowModeName) => {
  if (modeName === "general") {
    useCaseStore.changeUseCase("1d2d");
  } else {
    useCaseStore.changeUseCase(modeName);
  }
};

const updatePopoverStore = (e: Event) => {
  // Due to the fact that the first click under Mobile will also trigger a mouseenter event, the placement value is used to determine whether it is a mobile and ignore the mouseenter event triggering under Mobile
  if (e.type === "mouseenter" && placement.value !== "topLeft") {
    popoverOpenStore.updatePopoverStore(true, false, false);
  } else if (e.type === "click" && placement.value === "topLeft") {
    popoverOpenStore.updatePopoverStore(!popoverOpenStore.useCaseSelector, false, false);
  }
};
</script>

<template>
  <Popover
    overlayClassName="dbr-mode-selector-popover"
    :placement="placement"
    :arrow="shouldShowArrow"
    :open="popoverOpenStore.useCaseSelector"
  >
    <div class="dbr-mode-selector" @click.stop="updatePopoverStore" @mouseenter="updatePopoverStore">
      <img
        class="dbr-general-icon"
        src="../../assets/image/icon-web-general.svg"
        alt="general"
        v-show="currentUseCaseName === 'General'"
      />
      <img
        class="dbr-vin-icon"
        src="../../assets/image/icon-web-vin.svg"
        alt="vin"
        v-show="currentUseCaseName === 'VIN'"
      />
      <img
        class="dbr-dl-icon"
        src="../../assets/image/icon-web-dl.svg"
        alt="dl"
        v-show="currentUseCaseName === `Driver's License`"
      />
      <img
        class="dbr-dpm-icon"
        src="../../assets/image/icon-web-dpm.svg"
        alt="dpm"
        v-show="currentUseCaseName === 'DPM Codes'"
      />

      <label class="dbr-general-text">{{ currentUseCaseName }}</label>
    </div>
    <template #content>
      <p
        v-for="mode of useCaseList"
        :style="{
          backgroundColor: `${mode.belong.includes(useCaseStore.useCaseName) ? '#fe8e14' : '#222222'}`,
          color: `${mode.belong.includes(useCaseStore.useCaseName) ? '#ffffff' : '#888888'}`,
        }"
        @click="() => changeUseCase(mode.key)"
      >
        {{ mode.label }}
      </p>
    </template>
  </Popover>
</template>

<style scoped lang="less">
.dbr-mode-selector {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #222222;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .dbr-general-icon,
  .dbr-vin-icon,
  .dbr-dl-icon,
  .dbr-dpm-icon {
    width: 28px;
    height: 28px;

    @media (max-width: 980px) {
      width: 18px;
      height: 18px;
    }

    @media (max-height: 500px) and (max-width: 980px) {
      display: none;
    }
  }

  .dbr-vin-icon {
    width: 37px;
    height: 37px;

    @media (max-width: 980px) {
      width: 25px;
      height: 15px;
    }
  }

  .dbr-general-text {
    font-family: "OpenSans-Regular";
    color: #ffffff;
    font-size: 14px;
    margin-top: 5px;
    cursor: pointer;

    @media (max-width: 980px) {
      transform: scale(0.7);
      margin-top: 0;
    }
  }

  @media (max-width: 980px) {
    width: 25%;
  }
}

.ant-popover-open {
  background-color: rgb(34, 34, 34);
}
</style>

<style lang="less">
.dbr-mode-selector-popover {
  .ant-popover-inner {
    background-color: #222222;
    padding: unset;
    border-radius: unset;
  }

  .ant-popover-inner-content {
    color: #888888;
    cursor: pointer;

    p {
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      font-family: "OpenSans-Regular";
      padding: 0 12px;
      transition: all 0.1s;

      &:hover {
        background-color: #fea543 !important;
        color: #ffffff !important;
      }

      @media (max-width: 980px) {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
      }
    }
  }

  .ant-popover-arrow {
    &::before {
      background: rgb(34, 34, 34) !important;
    }
  }
}
</style>
