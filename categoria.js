const API_KEY = '5352ae6d40d8ce0aa806bcec99b733c4';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Géneros que quieres mostrar: nombre y su ID en TMDB
const generos = {
  comedia: 35,
  accion: 28,
  drama: 18,
};

// Carga las películas por género
async function cargarPeliculasPorGenero(nombreGenero, idGenero) {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${idGenero}`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    const contenedor = document.getElementById(`carrusel-${nombreGenero}`);

    if (!contenedor || !datos.results) return;

    contenedor.innerHTML = ''; // Limpia el carrusel antes de insertar

    datos.results.slice(0, 10).forEach(pelicula => {
      const div = document.createElement('div');
      div.classList.add('pelicula-item');
      div.innerHTML = `
        <img src="${pelicula.poster_path ? IMAGE_BASE + pelicula.poster_path : '/img/placeholder.webp'}" alt="${pelicula.title}">
     <!-- Botones de Play y Ver más -->
    <div class="informacion-deslizable">
      <div class="botones-card">
        <button class="btn-play">▶</button>
        <button class="btn-ver-mas">+</button>
      </div>
      <h3>${pelicula.title}</h3>
      <p class="anio">${pelicula.release_date ? pelicula.release_date.slice(0, 4) : 'Sin año'}</p>
      <p class="descripcion">${pelicula.overview || 'Sin descripción.'}</p>
    </div>
      `;
      contenedor.appendChild(div);
    });
  } catch (error) {
    console.error(`Error cargando películas de ${nombreGenero}:`, error);
  }
}

// Función para crear las secciones dinámicamente
function crearSecciones() {
  const contenedorCategorias = document.getElementById('categorias-container');

  // Generar las secciones de cada género
  for (const [nombre, id] of Object.entries(generos)) {
    const seccion = document.createElement('section');
    seccion.classList.add('categoria');
    seccion.id = nombre;

    seccion.innerHTML = `
      <h2>${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h2>
      <button class="carrusel-btn prev">&lt;</button>
      <div class="peliculas-carrusel" id="carrusel-${nombre}"></div>
      <button class="carrusel-btn next">&gt;</button>
    `;

    contenedorCategorias.appendChild(seccion);
  }

  // Cargar las películas de cada género
  for (const [nombre, id] of Object.entries(generos)) {
    cargarPeliculasPorGenero(nombre, id);
  }
}

// Cargar las categorías al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  crearSecciones();

  // Manejo del carrusel (scroll)
  document.querySelectorAll('.categoria').forEach(section => {
    const container = section.querySelector('.peliculas-carrusel');
    const nextBtn = section.querySelector('.carrusel-btn.next');
    const prevBtn = section.querySelector('.carrusel-btn.prev');

    if (nextBtn && container) {
      nextBtn.addEventListener('click', () => {
        container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
      });
    }

    if (prevBtn && container) {
      prevBtn.addEventListener('click', () => {
        container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
      });
    }
  });
});
