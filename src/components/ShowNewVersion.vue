<template>
  <div v-if="isNewVersionAvailable" class="update-notification">
    A new version of the application is available. Please refresh the page.
    <span v-if="newVersionDetails"> (New: {{ newVersionDetails }})</span>
  </div>
  <div v-else-if="error" class="update-error">
    Error checking for updates: {{ error }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  initialVersion: string | null;
  initialTag: string | null;
}>();

const { isNewVersionAvailable, newVersionDetails, error } = useVersionCheck();

// Inline Composable for version checking
function useVersionCheck() {
  const isNewVersionAvailable = ref(false);
  const newVersionDetails = ref<string | null>(null);
  const error = ref<string | null>(null);
  let intervalId: number | undefined;

  const checkVersion = async () => {
    if (props.initialVersion === null || props.initialTag === null) {
      return;
    }

    try {
      const response = await fetch('/version.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch version.json: ${response.status} ${response.statusText}`);
      }
      const currentData = await response.json();
      error.value = null;

      if (currentData.version !== props.initialVersion || currentData.tag !== props.initialTag) {
        isNewVersionAvailable.value = true;
        newVersionDetails.value = `${currentData.version} (${currentData.tag})`;
        if (intervalId) clearInterval(intervalId);
      }
    } catch (e: unknown) {
      console.error('Error checking for new version:', e);
      if (e instanceof Error) {
        error.value = e.message;
      } else {
        error.value = 'Unknown error checking version';
      }
    }
  };

  onMounted(() => {
    if (props.initialVersion !== null && props.initialTag !== null) {
      checkVersion();
    }
    intervalId = window.setInterval(checkVersion, 30000);
  });

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
  });

  watch(() => [props.initialVersion, props.initialTag], ([newInitialVersion, newInitialTag], [oldInitialVersion, oldInitialTag]) => {
    if ((newInitialVersion !== null && newInitialTag !== null) && (oldInitialVersion === null || oldInitialTag === null)) {
      checkVersion();
    }
  });

  return {
    isNewVersionAvailable,
    newVersionDetails,
    error,
    checkVersion // Exposing checkVersion in case it's needed externally, though not currently used
  };
}

</script>

<style scoped>
.update-notification {
  background-color: #f0ad4e;
  /* Warning yellow/orange */
  color: #333;
  padding: 12px 15px;
  text-align: center;
  border-radius: 4px;
  margin: 15px 0;
  font-weight: bold;
  border: 1px solid #eea236;
}

.update-error {
  background-color: #d9534f;
  /* Danger red */
  color: #fff;
  padding: 10px 15px;
  text-align: center;
  border-radius: 4px;
  margin: 15px 0;
}
</style>
