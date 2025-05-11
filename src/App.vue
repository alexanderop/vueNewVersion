<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ShowNewVersion from './components/ShowNewVersion.vue'

const meta = ref<{ name: string; version: string; tag: string } | null>(null)

// 1️⃣ compile-time constant:
const buildVersion = import.meta.env.APP_VERSION
const buildTag = import.meta.env.APP_TAG

// 2️⃣ runtime fetch (will work after `build`)
onMounted(async () => {
  try {
    const response = await fetch('/version.json')
    if (!response.ok) {
      // It's possible version.json doesn't exist yet (e.g. during dev before first build or error)
      // Log the error but allow the app to continue without runtime version info.
      console.warn(`Could not fetch /version.json: ${response.status} ${response.statusText}`)
      // meta.value will remain null, handled gracefully by the template and ShowNewVersion component
      return
    }
    meta.value = await response.json()
  } catch (e) {
    console.error("Failed to fetch initial version.json:", e)
    // meta.value will remain null
  }
})
</script>

<template>
  <div class="p-8">
    <ShowNewVersion :initialVersion="meta?.version ?? null" :initialTag="meta?.tag ?? null" />

    <h1>{{ meta?.name || 'My App' }}</h1>
    <p>
      <strong>Compile-time:</strong>
      {{ buildVersion }} <em>({{ buildTag }})</em>
    </p>
    <p v-if="meta">
      <strong>Runtime (version.json):</strong>
      {{ meta.version }} <em>({{ meta.tag }})</em>
    </p>
    <p v-else>
      Loading runtime version info...
    </p>
  </div>
</template>
