/**
 * Configuración optimizada de SWR para mejor rendimiento en producción
 * - dedupingInterval: 60s - no hace requests duplicadas en 60s
 * - focusThrottleInterval: 300s - evita revalidar al cambiar de tab frecuentemente
 * - revalidateOnFocus: false - no revalida cuando se enfoca la ventana
 * - revalidateOnReconnect: true - revalida si se reconecta (importante para conexiones móviles)
 */

export const swrConfig = {
  dedupingInterval: 60000, // 60 segundos - evita requests duplicadas
  focusThrottleInterval: 300000, // 5 minutos - throttle al cambiar de tab
  revalidateOnFocus: false, // no revalidar al cambiar de tab (mejora rendimiento)
  revalidateOnReconnect: true, // revalidar al reconectar (importante para móvil)
  revalidateIfStale: true, // revalidar si los datos están stale
  shouldRetryOnError: true, // reintentar si hay error
  errorRetryCount: 2, // max 2 reintentos
  errorRetryInterval: 3000, // 3s entre reintentos
  maxSize: 50, // max 50 requests simultáneos
};

/**
 * Configuración para fetcher con mejor manejo de errores
 */
export const fetcher = async (...args) => {
  const res = await fetch(...args);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.status = res.status;
    throw error;
  }

  return res.json();
};
