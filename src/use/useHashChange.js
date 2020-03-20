import { onMounted, onUnmounted } from "@vue/composition-api";

export function useHashChange(onHashChange) {
  onMounted(() => {
    window.addEventListener("hashchange", onHashChange);
  });
  onUnmounted(() => {
    window.removeEventListener("hashchange", onHashChange);
  });
}
