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
   
      // Botón para abrir la película directamente (tráiler o película completa)
      const btnPlay = div.querySelector('.btn-play');
      btnPlay.addEventListener('click', () => abrirPelicula(pelicula.id, pelicula.title)); // Usar el contenedor de la película como argumento


      // Botón para abrir el modal con más detalles de la película
      const btnvermas = div.querySelector('.btn-ver-mas');
      btnvermas.addEventListener('click', () => {
        abrirModal(pelicula);  // Abre el modal con detalles de la película
      });

      contenedor.appendChild(div);
    });
    
  } catch (error) {
    console.error(`Error cargando películas de ${nombreGenero}:`, error);
  }
}

// Función para abrir la película en YouTube (tráiler)
async function abrirPelicula(peliculaId, nombrePelicula) {
  const urlVideos = `${BASE_URL}/movie/${peliculaId}/videos?api_key=${API_KEY}&language=es-ES`;

  try {
    const respuestaVideos = await fetch(urlVideos);
    const datosVideos = await respuestaVideos.json();

    // Buscar un tráiler en YouTube, si no se encuentra, buscar en YouTube por el nombre de la película
    const trailer = datosVideos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');

    if (!trailer) {
      // Si no se encuentra el tráiler en TMDB, busca en YouTube por el nombre de la película
      const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(nombrePelicula + " trailer")}`;
      window.open(youtubeUrl, '_blank');  // Abre los resultados de búsqueda en YouTube
    } else {
      // Si encuentra el tráiler en TMDB, abre el tráiler directamente en YouTube
      const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
      window.open(youtubeUrl, '_blank');  // Abre el tráiler en una nueva pestaña
    }
  } catch (error) {
    console.error('Error al obtener los videos de la película:', error);
    alert('Ocurrió un error al intentar obtener el tráiler.');
  }
}



// Función para abrir el modal con detalles de la película
function abrirModal(pelicula) {
  const modal = document.getElementById('modal-pelicula');
  document.getElementById('modal-cartel').src = pelicula.poster_path ? IMAGE_BASE + pelicula.poster_path : '/img/placeholder.webp';
  document.getElementById('modal-titulo').textContent = pelicula.title;
  document.getElementById('modal-descripcion').textContent = pelicula.overview || 'Sin descripción.';
  document.getElementById('modal-ano').textContent = pelicula.release_date ? pelicula.release_date.slice(0, 4) : 'Desconocido';
  document.getElementById('modal-lenguajes').textContent = pelicula.original_language.toUpperCase();
  document.getElementById('modal-reparto').textContent = 'Cargando...'; // opcional
  document.getElementById('modal-director').textContent = 'Cargando...'; // opcional
  document.getElementById('modal-subtitulos').textContent = 'Español, Inglés';

  // Agregar el evento del botón "Ver tráiler" dentro del modal
  const btnTrailer = document.getElementById('modal-trailer');
  btnTrailer.onclick = function() {
    abrirPelicula(pelicula.id, pelicula.title);  // Pasar el ID y nombre de la película al hacer clic
  };

  modal.style.display = 'block';
}

// Función para cerrar el modal
function cerrarModal() {
  const modal = document.getElementById('modal-pelicula');
  modal.style.display = 'none';
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
