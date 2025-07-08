// Función para formatear la duración a partir de segundos
function formatDuration(totalSeconds) {
    if (totalSeconds === null || isNaN(totalSeconds)) {
        return ''; // Devuelve vacío si no hay duración
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const paddedSeconds = seconds.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');

    if (hours > 0) {
        return `${hours}:${paddedMinutes}:${paddedSeconds}`;
    } else {
        return `${minutes}:${paddedSeconds}`;
    }
}

// Función para formatear el número de visualizaciones
function formatViews(views) {
    if (!views) return '0 visualizaciones';

    const num = parseInt(views);

    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M visualizaciones`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K visualizaciones`;
    } else {
        return `${num} visualizaciones`;
    }
}

// Función para formatear la fecha de publicación
function formatPublishedDate(publishedAt) {
    if (!publishedAt) return '';

    const now = new Date();
    const published = new Date(publishedAt);
    const diffTime = Math.abs(now - published);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        return 'hace 1 día';
    } else if (diffDays < 7) {
        return `hace ${diffDays} días`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? 'hace 1 semana' : `hace ${weeks} semanas`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return months === 1 ? 'hace 1 mes' : `hace ${months} meses`;
    } else {
        const years = Math.floor(diffDays / 365);
        return years === 1 ? 'hace 1 año' : `hace ${years} años`;
    }
}

// Función para truncar texto
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Función para obtener las iniciales del nombre del canal
function getChannelInitials(channelName) {
    if (!channelName) return '?';

    const words = channelName.split(' ');
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    } else {
        return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
}

// Función para generar un color aleatorio para el avatar del canal
function getChannelColor(channelName) {
    const colors = [
        '#1c62b9', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f39c12',
        '#8e44ad', '#27ae60', '#e67e22', '#2c3e50', '#c0392b',
        '#16a085', '#7f8c8d', '#d35400', '#34495e', '#9b59b6'
    ];

    let hash = 0;
    for (let i = 0; i < channelName.length; i++) {
        hash = channelName.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
}

// Función para crear URL del thumbnail de mejor calidad
function getBestThumbnail(thumbnails) {
    if (!thumbnails) return '';

    // Prioridad: maxres > standard > high > medium > default
    if (thumbnails.maxres) return thumbnails.maxres.url;
    if (thumbnails.standard) return thumbnails.standard.url;
    if (thumbnails.high) return thumbnails.high.url;
    if (thumbnails.medium) return thumbnails.medium.url;
    if (thumbnails.default) return thumbnails.default.url;

    return '';
}

// Función para validar si una URL de imagen está disponible
function isImageAvailable(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Función para debounce (evitar muchas llamadas seguidas)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Palabras aleatorias para búsquedas de ejemplo
const SAMPLE_SEARCHES = [
    'música', 'tecnología', 'gaming', 'cocina', 'deportes',
    'noticias', 'entretenimiento', 'educación', 'ciencia', 'arte',
    'viajes', 'moda', 'salud', 'comedia', 'películas',
    'series', 'animales', 'naturaleza', 'historia', 'tutoriales'
];

// Función para obtener una búsqueda aleatoria
function getRandomSearch() {
    return SAMPLE_SEARCHES[Math.floor(Math.random() * SAMPLE_SEARCHES.length)];
}