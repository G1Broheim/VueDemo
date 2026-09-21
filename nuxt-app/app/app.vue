<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useWeatherHubStore } from '~/stores/weather-hub.service';

// Initialize the store
const weatherHubStore = useWeatherHubStore();

// Destructure reactive state while preserving reactivity using storeToRefs
const { latestForecast, connectionState } = storeToRefs(weatherHubStore);
const { startConnection, stopConnection } = weatherHubStore;

onMounted(() => {
  // Start connection only on client-side mount
  startConnection();
});

onUnmounted(() => {
  // Clean up when leaving page/component
  stopConnection();
});
</script>

<template>
  <main class="p-4">
    <h1>Weather Forecast from SignalR (Vue / Nuxt)</h1>

    <div v-if="latestForecast.length > 0">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp (C)</th>
            <th>Temp (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          <!-- Vue's v-for handles iteration; :key is required -->
          <tr v-for="f in latestForecast" :key="f.date">
            <td>{{ f.date }}</td>
            <td>{{ f.temperatureC }}</td>
            <td>{{ f.temperatureF }}</td>
            <td>{{ f.summary }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else>
      Status: {{ connectionState }} - Waiting for weather service to start streaming data...
    </p>
  </main>
</template>
