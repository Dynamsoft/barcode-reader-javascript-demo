<script setup lang="ts">
import "./dynamsoft.config";
import { RouterView } from "vue-router";
import { usePopoverOpenStore } from "./stores/popoverOpen";
import LoadingMask from "./components/LoadingMask.vue";
import FooterCopyright from "./components/FooterCopyright.vue";

const popoverOpenStore = usePopoverOpenStore();

document.querySelector("#app")?.addEventListener("click", () => {
  popoverOpenStore.updatePopoverStore(false, false);
});
</script>

<template>
  <main>
    <LoadingMask />
    <RouterView />
    <FooterCopyright />
  </main>
</template>

<style scoped lang="less">
main {
  width: 100%;
  height: 100%;
}
</style>
