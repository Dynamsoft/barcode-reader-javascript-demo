<script setup lang="ts">
import { Ref, ref, reactive, computed, watch } from "vue";
import { Popover, Checkbox, ConfigProvider } from "ant-design-vue";
import { usePopoverOpenStore } from "../../stores/popoverOpen";
import { DownOutlined, UpOutlined } from "@ant-design/icons-vue";
import { useBarcodeFormatStore } from "../../stores/barcodeFormat";
import { useUseCaseStore } from "../../stores/useCase";
import { CheckboxChangeEvent } from "ant-design-vue/es/checkbox/interface";

type PopoverPlacement = "rightTop" | "top";
type BarcodeCategory = "oneD" | "twoD" | "other";
type CheckboxState = "indeterminate" | "unCheck" | "checkAll";

interface CheckboxStatus {
  indeterminate: boolean;
  checkAll: boolean;
  open: boolean;
}

const popoverOpenStore = usePopoverOpenStore();
const barcodeFormatStore = useBarcodeFormatStore();
const useCaseStore = useUseCaseStore();

// Currently, we only allow users to change the selected Barcode Formats for the General use case
const isFormatChangeEnabled = computed(() => ["1d", "2d", "1d2d"].includes(useCaseStore.useCaseName));

/**
 * Determines the state of checkboxes for a given barcode category.
 * @param {BarcodeCategory} type - The barcode category type.
 * @returns {CheckboxState} The state of checkboxes for the given type.
 */
const checkedBarcodeFormatState = (type: BarcodeCategory): CheckboxState => {
  const barcodeFormatStates = Object.values(barcodeFormatStore[type]).map(({ state }) => state);
  let hasTrue = barcodeFormatStates.includes(true);
  let hasFalse = barcodeFormatStates.includes(false);

  if (hasFalse && !hasTrue) return "unCheck";
  if (hasTrue && !hasFalse) return "checkAll";
  return "indeterminate";
};

/**
 * Initializes the checkbox state for all barcode categories.
 * @returns {Record<BarcodeCategory, CheckboxStatus>} A map of barcode categories to their checkbox states.
 */
const initializeCheckboxState = () => {
  const types: BarcodeCategory[] = ["oneD", "twoD", "other"];
  const state: Record<BarcodeCategory, CheckboxStatus> = {} as Record<BarcodeCategory, CheckboxStatus>;

  types.forEach((type) => {
    const checkState = checkedBarcodeFormatState(type);
    state[type] = {
      indeterminate: checkState === "indeterminate",
      checkAll: checkState === "checkAll",
      open: true,
    };
  });

  return state;
};

const checkboxState = reactive(initializeCheckboxState());

const placement: Ref<PopoverPlacement> = ref(document.body.clientWidth > 980 ? "rightTop" : "top");
const shouldShowArrow = ref(document.body.clientWidth < 980);

window.addEventListener("resize", () => {
  const isWideScreen = document.body.clientWidth > 980;
  placement.value = isWideScreen ? "rightTop" : "top";
  shouldShowArrow.value = !isWideScreen;
});

const updatePopoverStore = (e: Event) => {
  // Due to the fact that the first click under Mobile will also trigger a mouseenter event, the placement value is used to determine whether it is a mobile and ignore the mouseenter event triggering under Mobile
  if (e.type === "mouseenter" && placement.value !== "top") {
    popoverOpenStore.updatePopoverStore(false, true, false);
  } else if (e.type === "click" && placement.value === "top") {
    popoverOpenStore.updatePopoverStore(false, !popoverOpenStore.formatSelector, false);
  }
};

/**
 * Handles changes to the "check all" checkbox for a given barcode category.
 * @param {CheckboxChangeEvent} e - The checkbox change event.
 * @param {BarcodeCategory} type - The barcode category type.
 */
const onCheckAllBarcodeChange = (e: CheckboxChangeEvent, type: BarcodeCategory) => {
  const isChecked = e.target.checked;
  checkboxState[type].indeterminate = false;
  checkboxState[type].checkAll = isChecked;
  // Check all barcodes in the BarcodeCategory
  Object.values(barcodeFormatStore[type]).forEach((format) => (format.state = isChecked));
};

/**
 * Toggles the check state for each item for All Check or All uncheck
 * @param {string} item - The item to check or uncheck.
 * @param {BarcodeCategory} type - The barcode category type.
 */
const checkAllCheckOrAllUnCheck = (item: string, type: BarcodeCategory) => {
  barcodeFormatStore.updateBarcodeFormatState(item, type, !barcodeFormatStore[type][item].state);
  const state = checkedBarcodeFormatState(type);
  checkboxState[type].indeterminate = state === "indeterminate";
  checkboxState[type].checkAll = state === "checkAll";
};

// Watch for changes in barcodeFormatStore and update checkbox states
watch(
  [() => barcodeFormatStore.oneD, () => barcodeFormatStore.twoD, () => barcodeFormatStore.other],
  () => {
    updateCheckboxStateOnUseCaseChange();
  },
  { deep: true } // Enable deep watching
);

const updateCheckboxStateOnUseCaseChange = () => {
  const types: BarcodeCategory[] = ["oneD", "twoD", "other"];

  types.forEach((type) => {
    const checkState = checkedBarcodeFormatState(type);
    checkboxState[type].indeterminate = checkState === "indeterminate";
    checkboxState[type].checkAll = checkState === "checkAll";
  });
};

const toggleFormatListOpen = (type: BarcodeCategory) => {
  checkboxState[type].open = !checkboxState[type].open;
};
</script>

<template>
  <Popover
    overlayClassName="dbr-format-selector-popover"
    :open="popoverOpenStore.formatSelector && isFormatChangeEnabled"
    :placement="placement"
    :arrow="shouldShowArrow"
  >
    <div
      class="dbr-format-selector"
      :style="{
        backgroundColor: !isFormatChangeEnabled ? 'rgb(77, 77, 77)' : '#000000',
        cursor: !isFormatChangeEnabled ? 'not-allowed' : 'pointer',
      }"
      @click.stop="updatePopoverStore"
      @mouseenter="updatePopoverStore"
    >
      <img
        class="dbr-barcodes-icon"
        src="../../assets/image/icon-web-barcodes.svg"
        alt="barcodes"
        v-show="isFormatChangeEnabled"
      />
      <img
        class="dbr-barcodes-icon"
        src="../../assets/image/icon-web-barcodes-disable.svg"
        alt="barcodes-disable"
        v-show="!isFormatChangeEnabled"
      />
      <label
        class="dbr-barcodes-text-in-desktop"
        :style="{
          color: !isFormatChangeEnabled ? 'rgb(103, 103, 103)' : '#ffffff',
          cursor: !isFormatChangeEnabled ? 'not-allowed' : 'pointer',
        }"
        >Barcodes Format</label
      >
      <label
        class="dbr-barcodes-text-in-mobile"
        :style="{
          color: !isFormatChangeEnabled ? 'rgb(103, 103, 103)' : '#ffffff',
          cursor: !isFormatChangeEnabled ? 'not-allowed' : 'pointer',
        }"
        >Format</label
      >
    </div>
    <template #content>
      <div class="dbr-format-list" @click.stop="">
        <div class="dbr-1d-barcodes">
          <div class="dbr-1d-barcodes-header">
            <div
              class="dbr-left"
              @click="
                () => {
                  toggleFormatListOpen('oneD');
                }
              "
            >
              <DownOutlined
                class="dbr-down-out-lined"
                style="color: #ffffff; margin-right: 5px"
                v-if="!checkboxState.oneD.open"
              />
              <UpOutlined class="dbr-up-out-lined" style="color: #ffffff; margin-right: 5px" v-else />
              <label>Common 1D Barcodes</label>
            </div>
            <div class="dbr-right">
              <label
                for="dbr-select-all-1d-checkbox"
                :style="{ color: checkboxState['oneD'].checkAll ? '#FE8E14' : '#999999' }"
                >Select All</label
              >
              <ConfigProvider
                :theme="{
                  token: {
                    colorPrimary: '#FE8E14',
                  },
                }"
              >
                <Checkbox
                  id="dbr-select-all-1d-checkbox"
                  style="margin-left: 12px"
                  :indeterminate="checkboxState['oneD'].indeterminate"
                  v-model:checked="checkboxState['oneD'].checkAll"
                  @change="
                    (e) => {
                      onCheckAllBarcodeChange(e, 'oneD');
                    }
                  "
                />
              </ConfigProvider>
            </div>
          </div>
          <div class="dbr-1d-barcodes-items" v-show="checkboxState.oneD.open">
            <div class="dbr-1d-barcodes-item" v-for="item of Object.keys(barcodeFormatStore.oneD)">
              <div
                class="dbr-item-inner"
                @click="
                  () => {
                    checkAllCheckOrAllUnCheck(item, 'oneD');
                  }
                "
                :style="{
                  backgroundColor: barcodeFormatStore.oneD[item].state ? '#fe8e14' : 'rgba(34, 34, 34)',
                  color: barcodeFormatStore.oneD[item].state ? '#ffffff' : '#888888',
                }"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
        <div class="dbr-2d-barcodes">
          <div class="dbr-2d-barcodes-header">
            <div
              class="dbr-left"
              @click="
                () => {
                  toggleFormatListOpen('twoD');
                }
              "
            >
              <DownOutlined
                class="dbr-down-out-lined"
                style="color: #ffffff; margin-right: 5px"
                v-if="!checkboxState.twoD.open"
              />
              <UpOutlined class="dbr-up-out-lined" style="color: #ffffff; margin-right: 5px" v-else />
              <label>Common 2D Barcodes</label>
            </div>
            <div class="dbr-right">
              <label
                for="dbr-select-all-2d-checkbox"
                :style="{ color: checkboxState['twoD'].checkAll ? '#FE8E14' : '#999999' }"
                >Select All</label
              >
              <ConfigProvider
                :theme="{
                  token: {
                    colorPrimary: '#FE8E14',
                  },
                }"
              >
                <Checkbox
                  id="dbr-select-all-2d-checkbox"
                  style="margin-left: 12px"
                  :indeterminate="checkboxState['twoD'].indeterminate"
                  v-model:checked="checkboxState['twoD'].checkAll"
                  @change="
                    (e) => {
                      onCheckAllBarcodeChange(e, 'twoD');
                    }
                  "
                />
              </ConfigProvider>
            </div>
          </div>
          <div class="dbr-2d-barcodes-items" v-show="checkboxState.twoD.open">
            <div class="dbr-2d-barcodes-item" v-for="item of Object.keys(barcodeFormatStore.twoD)">
              <div
                class="dbr-item-inner"
                @click="
                  () => {
                    checkAllCheckOrAllUnCheck(item, 'twoD');
                  }
                "
                :style="{
                  backgroundColor: barcodeFormatStore.twoD[item].state ? '#fe8e14' : 'rgba(34, 34, 34)',
                  color: barcodeFormatStore.twoD[item].state ? '#ffffff' : '#888888',
                }"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
        <div class="dbr-other-barcodes">
          <div class="dbr-other-barcodes-header">
            <div
              class="dbr-left"
              @click="
                () => {
                  toggleFormatListOpen('other');
                }
              "
            >
              <DownOutlined
                class="dbr-down-out-lined"
                style="color: #ffffff; margin-right: 5px"
                v-if="!checkboxState.other.open"
              />
              <UpOutlined class="dbr-up-out-lined" style="color: #ffffff; margin-right: 5px" v-else />
              <label>Other Barcodes</label>
            </div>
            <div class="dbr-right">
              <label
                for="dbr-select-all-other-checkbox"
                :style="{
                  color: checkboxState['other'].checkAll ? '#FE8E14' : '#999999',
                }"
                >Select All</label
              >
              <ConfigProvider
                :theme="{
                  token: {
                    colorPrimary: '#FE8E14',
                  },
                }"
              >
                <Checkbox
                  id="dbr-select-all-other-checkbox"
                  style="margin-left: 12px"
                  :indeterminate="checkboxState['other'].indeterminate"
                  v-model:checked="checkboxState['other'].checkAll"
                  @change="
                    (e) => {
                      onCheckAllBarcodeChange(e, 'other');
                    }
                  "
                />
              </ConfigProvider>
            </div>
          </div>
          <div class="dbr-other-barcodes-items" v-show="checkboxState.other.open">
            <div class="dbr-other-barcodes-item" v-for="item of Object.keys(barcodeFormatStore.other)">
              <div
                class="dbr-item-inner"
                @click="
                  () => {
                    checkAllCheckOrAllUnCheck(item, 'other');
                  }
                "
                :style="{
                  backgroundColor: barcodeFormatStore.other[item].state ? '#fe8e14' : 'rgba(34, 34, 34)',
                  color: barcodeFormatStore.other[item].state ? '#ffffff' : '#888888',
                }"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Popover>
</template>

<style scoped lang="less">
.dbr-format-selector {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #222222;
  cursor: pointer;

  .dbr-barcodes-icon {
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

  .dbr-barcodes-text-in-desktop,
  .dbr-barcodes-text-in-mobile {
    font-family: "OpenSans-Regular";
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;
  }

  .dbr-barcodes-text-in-desktop {
    margin-top: 5px;

    @media (max-width: 980px) {
      display: none;
    }
  }

  .dbr-barcodes-text-in-mobile {
    transform: scale(0.7);

    @media (min-width: 980px) {
      display: none;
    }
  }

  @media (max-width: 980px) {
    width: 25%;
  }
}

.ant-popover-open {
  background-color: rgb(34, 34, 34) !important;
}
</style>

<style lang="less">
.dbr-format-selector-popover {
  .ant-popover-inner {
    background-color: #222222;
    padding: unset;
    border-radius: unset;
  }

  .ant-popover-inner-content {
    .dbr-format-list {
      width: 650px;
      height: 50vh;
      padding: 12px 5px 35px 19px;
      background-color: rgba(50, 50, 52);
      overflow-y: scroll;

      .dbr-1d-barcodes,
      .dbr-2d-barcodes,
      .dbr-other-barcodes {
        .dbr-1d-barcodes-header,
        .dbr-2d-barcodes-header,
        .dbr-other-barcodes-header {
          display: flex;
          justify-content: space-between;

          .dbr-left {
            cursor: pointer;

            .dbr-down-out-lined,
            .dbr-up-out-lined {
              width: 12px;
              height: 12px;
            }

            label {
              font-size: 16px;
              color: #ffffff;
              font-family: "OpenSans-Regular";
              cursor: pointer;

              @media (max-width: 980px) and (orientation: portrait) {
                font-size: 12px;
              }

              @media (max-width: 980px) and (orientation: landscape) {
                font-size: 12px;
              }
            }
          }

          .dbr-right {
            cursor: pointer;
            padding-right: 19px;

            label {
              font-size: 16px;
              color: #999999;
              font-family: "OpenSans-Regular";
              cursor: pointer;

              @media (max-width: 980px) and (orientation: portrait) {
                font-size: 12px;
              }

              @media (max-width: 980px) and (orientation: landscape) {
                font-size: 12px;
              }
            }
          }
        }

        .dbr-1d-barcodes-items,
        .dbr-2d-barcodes-items,
        .dbr-other-barcodes-items {
          display: flex;
          justify-content: start;
          flex-wrap: wrap;

          .dbr-1d-barcodes-item,
          .dbr-2d-barcodes-item,
          .dbr-other-barcodes-item {
            width: calc(100% / 3);
            height: 40px;
            display: flex;
            justify-content: center;
            line-height: 40px;
            text-align: center;
            margin-top: 30px;

            .dbr-item-inner {
              width: 80%;
              color: #888888;
              font-size: 16px;
              font-family: OpenSans-Regular;
              background-color: rgba(34, 34, 34);
              transition: all 0.1s;
              cursor: pointer;

              @media (hover: hover) and (pointer: fine) {
                &:hover {
                  background-color: #fea543 !important;
                  color: #ffffff !important;
                }
              }

              @media (max-width: 980px) and (orientation: portrait) {
                font-size: 14px;
                width: 80px;
                display: flex;
                justify-content: center;
                align-items: center;
              }

              @media (max-width: 980px) and (orientation: landscape) {
                font-size: 12px;
                width: 120px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }

            @media (max-width: 980px) and (orientation: portrait) {
              margin-top: 10px;
              line-height: unset;
            }

            @media (max-width: 980px) and (orientation: landscape) {
              margin-top: 10px;
              line-height: unset;
            }
          }
        }
      }

      .dbr-2d-barcodes,
      .dbr-other-barcodes {
        margin-top: 30px;
      }

      @media (max-width: 980px) and (orientation: portrait) {
        width: 300px;
        height: 400px;
      }

      @media (max-width: 980px) and (orientation: landscape) {
        width: 500px;
        height: 220px;
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
