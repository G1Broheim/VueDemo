import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as signalR from '@microsoft/signalr';
import type { WeatherForecast } from '~/models/weather-forecast';

export const useWeatherHubStore = defineStore('weatherHub', () => {
  // 1. Reactive State
  const hubConnection = ref<signalR.HubConnection | null>(null);
  const connectionState = ref<signalR.HubConnectionState>(
    signalR.HubConnectionState.Disconnected
  );
  const latestForecast = ref<WeatherForecast[]>([]);

  // 2. Actions
  const startConnection = async () => {
    // Lock execution if already connected or connecting
    if (
      hubConnection.value ||
      connectionState.value === signalR.HubConnectionState.Connecting ||
      connectionState.value === signalR.HubConnectionState.Connected
    ) {
      return;
    }

    // Set status to Connecting synchronously before starting async work
    connectionState.value = signalR.HubConnectionState.Connecting;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/weatherForecastHub')
      .withAutomaticReconnect()
      .build();

    // Register event listeners
    connection.on('ForecastUpdated', (forecast: WeatherForecast[]) => {
      latestForecast.value = forecast;
    });

    try {
      await connection.start();
      console.log('SignalR connection started');
      hubConnection.value = connection;
      connectionState.value = signalR.HubConnectionState.Connected;
    } catch (err) {
      console.error('Error connecting to SignalR', err);
      hubConnection.value = null;
      connectionState.value = signalR.HubConnectionState.Disconnected;
    }
  };

  return {
    hubConnection,
    connectionState,
    latestForecast,
    startConnection,
  };
});