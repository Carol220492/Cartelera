document.getElementById("lupa").addEventListener("click", function () {
  const formBuscador = document.getElementById("form-buscador");
  formBuscador.style.display = "flex"; // Muestra el formulario
  this.style.display = "none"; // Oculta la lupa
});

const API_KEY = '9c0255d5'; // Reemplaza con tu clave API
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

const peliculasContainer = document.getElementById('peliculas');
const modalPelicula = document.getElementById('modal-pelicula');
const modalTitulo = document.getElementById('modal-titulo');
const modalCartel = document.getElementById('modal-cartel');
const modalDescripcion = document.getElementById('modal-descripcion');
const cerrarModal = document.querySelector('.cerrar-modal');

const prevButton = document.getElementById('prev'); // Botón para ir a la película anterior
const nextButton = document.getElementById('next'); // Botón para ir a la película siguiente

let indiceActual = 0; // Índice de la película actual

async function obtenerPeliculas() {
  try {
    const peliculas = ['The Alpinist', 'A Minecraft Movie', 'Paddington']; // Lista de películas de ejemplo
    const datosPeliculas = [];

    for (const pelicula of peliculas) {
      const respuesta = await fetch(`${API_URL}&t=${pelicula}`);
      const datos = await respuesta.json();

      if (datos.Response === 'True') {
        datosPeliculas.push(datos);
      } else {
        console.error('Película no encontrada:', pelicula);
      }
    }

    mostrarPeliculasCarrusel(datosPeliculas);
  } catch (error) {
    console.error('Error al obtener películas:', error);
  }
}

function mostrarPeliculasCarrusel(peliculas) {
  peliculas.forEach((pelicula) => {
    const elementoPelicula = document.createElement('div');
    elementoPelicula.classList.add('pelicula');
    elementoPelicula.innerHTML = `
      <img src="${pelicula.Poster}" alt="${pelicula.Title}">
      <h3>${pelicula.Title}</h3>
      <p>${pelicula.Plot}</p>
    `;

    elementoPelicula.addEventListener('click', () => {
      mostrarDetallesPelicula(pelicula);
    });

    peliculasContainer.appendChild(elementoPelicula);
  });

  actualizarCarrusel(); // Muestra la primera película
}

function actualizarCarrusel() {
  const anchoPelicula = peliculasContainer.children[0].offsetWidth;
  peliculasContainer.style.transform = `translateX(-${indiceActual * anchoPelicula}px)`;
}

// Botón para ir a la película anterior
prevButton.addEventListener('click', () => {
  if (indiceActual > 0) {
    indiceActual--;
    actualizarCarrusel();
  }
});

// Botón para ir a la película siguiente
nextButton.addEventListener('click', () => {
  if (indiceActual < peliculasContainer.children.length - 1) {
    indiceActual++;
    actualizarCarrusel();
  }
});

function mostrarDetallesPelicula(pelicula) {
  modalTitulo.textContent = pelicula.Title;
  modalCartel.src = pelicula.Poster;
  modalDescripcion.innerHTML = `
    <p><strong>Año de estreno:</strong> ${pelicula.Year}</p>
    <p><strong>Director:</strong> ${pelicula.Director}</p>
    <p><strong>Reparto:</strong> ${pelicula.Actors}</p>
    <p><strong>Duración:</strong> ${pelicula.Runtime}</p>
    <p><strong>Audios de lenguaje:</strong> ${pelicula.Language}</p>
    <p><strong>Subtítulos:</strong> ${pelicula.Language}</p>
    <p><strong>Advertencias de contenido:</strong> ${pelicula.Rated || 'No disponible'}</p>
  <p><strong>Resumen:</strong> ${pelicula.Plot || 'Resumen no disponible'}</p> <!-- Resumen de la película -->
    `;
  modalPelicula.style.display = 'block';

  // Oculta los botones laterales
  prevButton.style.display = 'none';
  nextButton.style.display = 'none';
}


// Evento para cerrar el modal
cerrarModal.addEventListener('click', () => {
  modalPelicula.style.display = 'none'; // Oculta el modal

  // Muestra los botones laterales nuevamente
  prevButton.style.display = 'block';
  nextButton.style.display = 'block';
});

// También puedes cerrar el modal haciendo clic fuera del contenido
modalPelicula.addEventListener('click', (event) => {
  if (event.target === modalPelicula) {
    modalPelicula.style.display = 'none'; // Oculta el modal si se hace clic fuera del contenido
   // Muestra los botones laterales nuevamente
   prevButton.style.display = 'block';
   nextButton.style.display = 'block';
 }
});

obtenerPeliculas();