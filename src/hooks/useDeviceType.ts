import { onMounted, onUnmounted, ref, Ref } from "vue";

export function useDeviceType() {
  const deviceType: Ref<"pc" | "mobile"> = ref(document.body.clientWidth < 979.5 ? "mobile" : "pc");

  function updateDeviceType() {
    if (document.body.clientWidth < 979.5) {
      deviceType.value = "mobile";
    } else {
      deviceType.value = "pc";
    }
  }

  onMounted(() => window.addEventListener('resize', updateDeviceType));
  onUnmounted(() => window.removeEventListener('resize', updateDeviceType));

  return deviceType;
}