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
const indicadoresContainer = document.getElementById('indicadores'); // Contenedor de los indicadores

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
  peliculas.forEach((pelicula, index) => {
    const elementoPelicula = document.createElement('div');
    elementoPelicula.classList.add('pelicula');
    elementoPelicula.innerHTML = `
      <img src="${pelicula.Poster}" alt="${pelicula.Title}">
      <h3>${pelicula.Title}</h3>
      <button class="btn-mas-info">Más información</button>
    `;

    // Evento para abrir el modal al hacer clic en el botón
    const botonMasInfo = elementoPelicula.querySelector('.btn-mas-info');
    botonMasInfo.addEventListener('click', () => {
      mostrarDetallesPelicula(pelicula);
    });

    peliculasContainer.appendChild(elementoPelicula);

    // Crear un indicador para cada película
    const indicador = document.createElement('div');
    indicador.classList.add('indicador');
    if (index === 0) indicador.classList.add('activo'); // El primer indicador es activo por defecto

    // Evento para navegar al hacer clic en un indicador
    indicador.addEventListener('click', () => {
      indiceActual = index;
      actualizarCarrusel();
    });

    indicadoresContainer.appendChild(indicador);
  });

  actualizarCarrusel(); // Muestra la primera película
}

function actualizarCarrusel() {
  const anchoPelicula = peliculasContainer.children[0].offsetWidth;
  peliculasContainer.style.transform = `translateX(-${indiceActual * anchoPelicula}px)`;

  // Actualizar los indicadores
  const indicadores = document.querySelectorAll('.indicador');
  indicadores.forEach((indicador, index) => {
    if (index === indiceActual) {
      indicador.classList.add('activo');
    } else {
      indicador.classList.remove('activo');
    }
  });
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
    <p><strong>Resumen:</strong> ${pelicula.Plot || 'Resumen no disponible'}</p>
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

// Selecciona el botón y la segunda sección
const scrollBtn = document.getElementById('scroll-btn');
const segundaSeccion = document.getElementById('segunda-seccion');

// Evento para hacer scroll hacia la segunda sección
scrollBtn.addEventListener('click', () => {
  segundaSeccion.scrollIntoView({ behavior: 'smooth' }); // Scroll suave
});