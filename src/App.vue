<script setup lang="ts">
import { ref, onMounted } from 'vue'

const meta = ref<{ name: string; version: string; tag: string } | null>(null)

// 1️⃣ compile-time constant:
const buildVersion = import.meta.env.APP_VERSION
const buildTag     = import.meta.env.APP_TAG

// 2️⃣ runtime fetch (will work after `build`)
onMounted(async () => {
  meta.value = await fetch('/version.json').then(r => r.json())
})
</script>

<template>
  <div class="p-8">
    <h1>{{ meta?.name || 'My App' }}</h1>
    <p>
      <strong>Compile-time:</strong>
      {{ buildVersion }} <em>({{ buildTag }})</em>
    </p>
    <p v-if="meta">
      <strong>Runtime (version.json):</strong>
      {{ meta.version }} <em>({{ meta.tag }})</em>
    </p>
  </div>
</template>
