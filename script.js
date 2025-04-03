const API_KEY = '9c0255d5'; // Reemplaza con tu clave API
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

const peliculasContainer = document.getElementById('peliculas');
const modalPelicula = document.getElementById('modal-pelicula');
const modalTitulo = document.getElementById('modal-titulo');
const modalCartel = document.getElementById('modal-cartel');
const modalDescripcion = document.getElementById('modal-descripcion');
const cerrarModal = document.querySelector('.cerrar-modal');

async function obtenerPeliculas() {
  try {
    const peliculas = ['Matrix', 'Inception', 'Parasite']; // Lista de peliculas de ejemplo
    peliculas.forEach( async pelicula => {
      const respuesta = await fetch(`${API_URL}&t=${pelicula}`);
      const datos = await respuesta.json();

      if (datos.Response === 'True') {
        mostrarPelicula(datos);
      } else {
        console.error('Película no encontrada:', pelicula);
      }
    });

  } catch (error) {
    console.error('Error al obtener películas:', error);
  }
}

function mostrarPelicula(pelicula) {
  const elementoPelicula = document.createElement('div');
  elementoPelicula.classList.add('pelicula');
  elementoPelicula.innerHTML = `
    <img src="${pelicula.Poster}" alt="${pelicula.Title}">
    <h3>${pelicula.Title}</h3>
  `;

  elementoPelicula.addEventListener('click', () => {
    mostrarDetallesPelicula(pelicula);
  });

  peliculasContainer.appendChild(elementoPelicula);
}

function mostrarDetallesPelicula(pelicula) {
  modalTitulo.textContent = pelicula.Title;
  modalCartel.src = pelicula.Poster;
  modalDescripcion.textContent = pelicula.Plot;
  modalPelicula.style.display = 'block';
}

cerrarModal.addEventListener('click', () => {
  modalPelicula.style.display = 'none';
});

obtenerPeliculas();