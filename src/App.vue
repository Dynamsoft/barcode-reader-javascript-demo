<script setup lang="ts">
import { RouterView } from "vue-router";
import "./dynamsoft.config";

import FooterCopyright from "./components/FooterCopyright.vue";
import { usePopoverOpenStore } from "./stores/popoverOpen";

const popoverOpenStore = usePopoverOpenStore();

window.addEventListener("click", () => {
  popoverOpenStore.useCaseSelector = false;
  popoverOpenStore.formatSelector = false;
  popoverOpenStore.settingsController = false;
});
</script>

<template>
  <RouterView />
  <FooterCopyright />
</template>

<style scoped lang="less"></style>
