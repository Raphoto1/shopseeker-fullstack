// Fetcher optimizado con mejor manejo de errores y performance
export const fetcher = async (...args) => {
  const response = await fetch(...args, {
    // Agregar headers para mejor caching
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    },
  });
  
  if (!response.ok) {
    const error = new Error('Failed to fetch data');
    error.status = response.status;
    error.info = await response.text();
    throw error;
  }
  
  return response.json();
};

// Optimizar la query para obtener solo los datos necesarios
export const favoritesUrl = `/api/design?sortField=likes&sortQ=-1&limit=12`;