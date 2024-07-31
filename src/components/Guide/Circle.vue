<script setup lang="ts">
import { useUseCaseStore } from "../../stores/useCase";

defineProps<{
  name: string;
  width: number;
  height: number;
}>();

const useCaseStore = useUseCaseStore();
</script>

<template>
  <div
    class="dbr-option-circle"
    :style="{ 'background-color': name === useCaseStore.useCaseName ? '#fe8e14' : '#ffffff' }"
  >
    <svg
      viewBox="64 64 896 896"
      data-icon="check"
      :width="width"
      :height="height"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      class="dbr-middle-svg"
    >
      <path
        d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
      ></path>
    </svg>
  </div>
</template>

<style scoped lang="less">
.dbr-option-circle {
  position: absolute;
  top: 12px;
  right: 18px;
  width: 18px;
  height: 18px;
  background-color: #ffffff;
  border-radius: 50%;
}

.dbr-middle-svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
