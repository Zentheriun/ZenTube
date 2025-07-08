// Variables globales y elementos del DOM (sin cambios)
let currentSearchQuery = '';
let isLoading = false;
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const videosGrid = document.getElementById('videosGrid');
const loading = document.getElementById('loading');
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');

// --- Las funciones initializeApp, setupEventListeners, handleSearch, loadTrendingVideos, displayVideos, etc., permanecen igual ---
// ... (código sin cambios)

document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    setupEventListeners();
    loadTrendingVideos();
});

function initializeApp() {
    console.log('ZenTube inicializado');
    if (searchInput) {
        searchInput.placeholder = `Buscar ${getRandomSearch()}...`;
    }
}

function setupEventListeners() {
    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleSearch());
        searchInput.addEventListener('input', debounce(() => {
            if (searchInput.value.trim().length > 2) handleSearch();
        }, 500));
    }
    if (menuBtn) menuBtn.addEventListener('click', toggleSidebar);
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
            closeSidebar();
        }
    });
}

async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        loadTrendingVideos();
        return;
    }
    if (query === currentSearchQuery || isLoading) return;
    currentSearchQuery = query;
    showLoading();
    try {
        const videos = await searchVideos(query);
        displayVideos(videos);
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        showError('Error al buscar videos. Intenta de nuevo.');
    } finally {
        hideLoading();
    }
}

async function loadTrendingVideos() {
    if (isLoading) return;
    showLoading();
    try {
        const videos = await getTrendingVideos();
        displayVideos(videos);
    } catch (error) {
        console.error('Error al cargar videos populares:', error);
        showError('Error al cargar videos. Intenta de nuevo.');
    } finally {
        hideLoading();
    }
}

function displayVideos(videos) {
    if (!videosGrid) return;
    videosGrid.innerHTML = '';
    if (!videos || videos.length === 0) {
        showNoResults();
        return;
    }
    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        videosGrid.appendChild(videoCard);
    });
}


// --- Función createVideoCard MODIFICADA ---
function createVideoCard(video) {
    const videoDiv = document.createElement('div');
    videoDiv.className = 'video-card';

    // Construir la URL completa del thumbnail desde el backend
    const thumbnail = `http://localhost:3000/uploads/thumbnails/${video.thumbnail}`;

    // Formatear datos usando tus funciones de utils.js
    const views = formatViews(video.views);
    const publishedDate = formatPublishedDate(video.uploadedAt);
    const duration = formatDuration(video.duration); // Asumiendo que guardas la duración
    const channelName = video.uploader ? video.uploader.username : 'Usuario Anónimo';
    const channelInitials = getChannelInitials(channelName);
    const channelColor = getChannelColor(channelName);

    videoDiv.innerHTML = `
        <div class="video-thumbnail">
            <img src="${thumbnail}" alt="${video.title}" loading="lazy" onerror="this.src='assets/default-thumbnail.png';">
            ${duration ? `<div class="video-duration">${duration}</div>` : ''}
        </div>
        <div class="video-info">
            <div class="channel-avatar" style="background-color: ${channelColor}">
                ${channelInitials}
            </div>
            <div class="video-details">
                <h3 class="video-title">${truncateText(video.title, 100)}</h3>
                <div class="channel-name">${channelName}</div>
                <div class="video-metadata">
                    ${views}${views && publishedDate ? ' • ' : ''}${publishedDate}
                </div>
            </div>
        </div>
    `;

    // Evento de clic (puedes adaptarlo para abrir una página de detalles en el futuro)
    videoDiv.addEventListener('click', () => {
        console.log(`Video seleccionado: ${video._id}`);
        // openVideo(video._id); // Descomentar cuando tengas una página para ver videos
    });

    return videoDiv;
}

function openVideo(videoId) {
    // En el futuro, esto podría llevar a una página de visualización:
    // window.location.href = `pages/watch.html?id=${videoId}`;
    alert(`Funcionalidad para ver el video ${videoId} no implementada.`);
}

// --- El resto de funciones (showLoading, hideLoading, showError, showNoResults, etc.) permanecen igual ---
// ... (código sin cambios)
function showLoading() {
    isLoading = true;
    if (loading) loading.style.display = 'flex';
    videosGrid.innerHTML = ''; // Limpiar la grilla mientras carga
}

function hideLoading() {
    isLoading = false;
    if (loading) loading.style.display = 'none';
}

function showError(message) {
    if (!videosGrid) return;
    videosGrid.innerHTML = `<div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #ff6b6b; display: flex; flex-direction: column; align-items: center; gap: 16px;"> <i class="fas fa-exclamation-triangle" style="font-size: 32px;"></i> <p>${message}</p> <button onclick="location.reload()" style="background-color: #ff0000; color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; font-size: 14px;">Reintentar</button></div>`;
}

function showNoResults() {
    if (!videosGrid) return;
    videosGrid.innerHTML = `<div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #aaaaaa; display: flex; flex-direction: column; align-items: center; gap: 16px;"> <i class="fas fa-search" style="font-size: 32px;"></i> <p>No se encontraron videos para "${currentSearchQuery}"</p> <p style="font-size: 14px;">Intenta con otros términos de búsqueda</p></div>`;
}

function toggleSidebar() {
    if (sidebar) sidebar.classList.toggle('show');
}

function closeSidebar() {
    if (sidebar) sidebar.classList.remove('show');
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) closeSidebar();
});