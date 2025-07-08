// Configuración de la API de TU backend
const API_BASE_URL = 'http://localhost:3000/api'; // Asegúrate que el puerto coincida con tu server.js

// Función para buscar videos en tu backend
async function searchVideos(query, maxResults = 20) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/videos?search=${encodeURIComponent(query)}&limit=${maxResults}`
        );

        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }

        const data = await response.json();
        // La API del backend devuelve un objeto { videos: [...] }
        return data.videos || [];
    } catch (error) {
        console.error('Error al buscar videos:', error);
        return [];
    }
}

// Función para obtener los videos más vistos de tu backend
async function getTrendingVideos(maxResults = 20) {
    try {
        // Usamos la ruta /api/trending que ya ordena por vistas
        const response = await fetch(`${API_BASE_URL}/trending?limit=${maxResults}`);

        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }
        // La ruta /api/trending devuelve directamente el array de videos
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Error al obtener videos populares:', error);
        return [];
    }
}

// Función para obtener detalles de un video específico (si la necesitaras en el futuro)
async function getVideoDetails(videoId) {
    try {
        const response = await fetch(`${API_BASE_URL}/videos/${videoId}`);

        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }

        const data = await response.json();
        return data || null;
    } catch (error) {
        console.error('Error al obtener detalles del video:', error);
        return null;
    }
}