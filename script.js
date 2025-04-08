// Mostrar el formulario de búsqueda al hacer clic en la lupa
document.getElementById("lupa").addEventListener("click", function () {
  const formBuscador = document.getElementById("form-buscador");
  formBuscador.style.display = "flex"; // Muestra el formulario
  this.style.display = "none"; // Oculta la lupa
});

// Clave y URL de la API de TMDB
const TMDB_API_KEY = '5352ae6d40d8ce0aa806bcec99b733c4'; // Reemplaza con tu clave API de TMDB
const TMDB_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}&language=es-ES`;

// Elementos de la hero section
const heroTitulo = document.getElementById("hero-titulo");
const heroDescripcion = document.getElementById("hero-descripcion");
const heroImagen = document.getElementById("hero-imagen");
const heroBoton = document.getElementById("hero-boton");

let peliculas = []; // Array para almacenar las películas obtenidas
let peliculaActual = 0; // Índice de la película actual
let intervaloCambio; // Variable para el intervalo de cambio automático

// Función para obtener las películas desde la API de TMDB
async function obtenerPeliculas() {
  try {
    const respuesta = await fetch(TMDB_URL);
    const datos = await respuesta.json();

    if (datos.results && datos.results.length > 0) {
      // Guardar solo las primeras 3 películas obtenidas
      peliculas = datos.results.slice(0, 3).map((pelicula) => ({
        titulo: pelicula.title || "Título no disponible",
        descripcion: pelicula.overview || "Descripción no disponible.",
        imagen: pelicula.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${pelicula.backdrop_path}`
          : pelicula.poster_path
            ? `https://image.tmdb.org/t/p/w1280${pelicula.poster_path}`
            : "/img/placeholder.webp", // Imagen predeterminada si no hay disponible
        id: pelicula.id,
      }));

      // Generar los indicadores
      generarIndicadores();

      // Cargar la primera película en la hero section
      cargarHero();
    } else {
      console.error("No se encontraron películas populares.");
    }
  } catch (error) {
    console.error("Error al obtener películas populares:", error);
  }
}

// Función para cargar la película actual en la hero section
function cargarHero() {
  if (peliculas.length === 0) return;

  const pelicula = peliculas[peliculaActual];
  heroTitulo.textContent = pelicula.titulo;
  heroDescripcion.textContent = pelicula.descripcion;
  heroImagen.src = pelicula.imagen;
  heroImagen.alt = `Imagen de la película: ${pelicula.titulo}`;

  // Evento del botón "Ver más" para mostrar detalles de la película
  heroBoton.onclick = () => {
    mostrarDetallesPelicula(pelicula);
  };

  actualizarIndicadores(); // Actualiza los indicadores al cargar una película
}

// Función para cambiar a la siguiente película automáticamente
function cambiarPelicula() {
  peliculaActual = (peliculaActual + 1) % peliculas.length; // Cicla entre las películas
  cargarHero();
}

// Función para obtener detalles adicionales de la película
async function obtenerDetallesPelicula(id) {
  const detallesURL = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=credits,videos`;
  try {
    const respuesta = await fetch(detallesURL);
    const datos = await respuesta.json();

    // Extraer información relevante
    const anoEstreno = datos.release_date ? datos.release_date.split("-")[0] : "No disponible";
    const lenguajes = datos.spoken_languages.map((lang) => lang.name).join(", ") || "No disponible";
    const reparto = datos.credits.cast.slice(0, 5).map((actor) => actor.name).join(", ") || "No disponible";
    const director = datos.credits.crew.find((persona) => persona.job === "Director")?.name || "No disponible";
    const subtitulos = datos.original_language ? datos.original_language.toUpperCase() : "No disponible";
    const trailer = datos.videos.results.find((video) => video.type === "Trailer")?.key;

    return { anoEstreno, lenguajes, reparto, director, subtitulos, trailer };
  } catch (error) {
    console.error("Error al obtener detalles de la película:", error);
    return {};
  }
}

// Función para mostrar los detalles de la película en el modal
async function mostrarDetallesPelicula(pelicula) {
  const modalPelicula = document.getElementById("modal-pelicula");
  const modalTitulo = document.getElementById("modal-titulo");
  const modalCartel = document.getElementById("modal-cartel");
  const modalDescripcion = document.getElementById("modal-descripcion");
  const modalAno = document.getElementById("modal-ano");
  const modalLenguajes = document.getElementById("modal-lenguajes");
  const modalReparto = document.getElementById("modal-reparto");
  const modalDirector = document.getElementById("modal-director");
  const modalSubtitulos = document.getElementById("modal-subtitulos");
  const modalTrailer = document.getElementById("modal-trailer");

  // Mostrar información básica
  modalTitulo.textContent = pelicula.titulo;
  modalCartel.src = pelicula.imagen || "/img/placeholder.webp";
  modalCartel.alt = `Cartel de la película: ${pelicula.titulo}`;
  modalDescripcion.textContent = pelicula.descripcion;

  // Obtener detalles adicionales
  const detalles = await obtenerDetallesPelicula(pelicula.id);

  // Mostrar detalles adicionales
  modalAno.textContent = detalles.anoEstreno || "No disponible";
  modalLenguajes.textContent = detalles.lenguajes || "No disponible";
  modalReparto.textContent = detalles.reparto || "No disponible";
  modalDirector.textContent = detalles.director || "No disponible";
  modalSubtitulos.textContent = detalles.subtitulos || "No disponible";

  // Configurar el botón de tráiler
  if (detalles.trailer) {
    modalTrailer.style.display = "inline-block";
    modalTrailer.onclick = () => {
      window.open(`https://www.youtube.com/watch?v=${detalles.trailer}`, "_blank");
    };
  } else {
    modalTrailer.style.display = "none";
  }

  // Mostrar el modal
  modalPelicula.style.display = "block";

  // Añadir la clase para ocultar la hero section
  document.body.classList.add("modal-abierto");

  // Detener el cambio automático de películas
  clearInterval(intervaloCambio);
}

// Evento para cerrar el modal
document.addEventListener('DOMContentLoaded', () => {
  const modalPelicula = document.getElementById("modal-pelicula");
  const cerrarModal = modalPelicula.querySelector(".cerrar-modal");

  cerrarModal.addEventListener("click", () => {
    modalPelicula.style.display = "none"; // Cierra el modal
    document.body.classList.remove("modal-abierto"); // Restaura la hero section si estaba oculta
  });
});

// También puedes cerrar el modal haciendo clic fuera del contenido
document.getElementById("modal-pelicula").addEventListener("click", (event) => {
  if (event.target === document.getElementById("modal-pelicula")) {
    const modalPelicula = document.getElementById("modal-pelicula");
    modalPelicula.style.display = "none";

    // Quitar la clase para mostrar nuevamente la hero section
    document.body.classList.remove("modal-abierto");

    // Reiniciar el cambio automático de películas
    intervaloCambio = setInterval(cambiarPelicula, 5000);
  }
});

// Inicializar la hero section
document.addEventListener("DOMContentLoaded", () => {
  obtenerPeliculas();

  // Evitar múltiples intervalos
  if (intervaloCambio) clearInterval(intervaloCambio);

  // Cambiar película automáticamente cada 5 segundos
  intervaloCambio = setInterval(cambiarPelicula, 5000);
});

// Botones laterales
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");

// Función para ir a la película anterior
function peliculaAnterior() {
  peliculaActual = (peliculaActual - 1 + peliculas.length) % peliculas.length; // Cicla hacia atrás
  cargarHero();
}

// Función para ir a la siguiente película
function peliculaSiguiente() {
  peliculaActual = (peliculaActual + 1) % peliculas.length; // Cicla hacia adelante
  cargarHero();
}

// Eventos para los botones
btnPrev.addEventListener("click", peliculaAnterior);
btnNext.addEventListener("click", peliculaSiguiente);

const contenedorIndicadores = document.getElementById("indicadores");

// Función para generar los indicadores dinámicamente
function generarIndicadores() {
  contenedorIndicadores.innerHTML = ""; // Limpia los indicadores existentes

  peliculas.forEach((_, index) => {
    const indicador = document.createElement("div");
    indicador.classList.add("indicador");
    if (index === peliculaActual) indicador.classList.add("activo"); // Marca el indicador activo

    // Evento para cambiar a la película seleccionada al hacer clic en el indicador
    indicador.addEventListener("click", () => {
      peliculaActual = index;
      cargarHero();
      actualizarIndicadores();
    });

    contenedorIndicadores.appendChild(indicador);
  });
}

// Función para actualizar los indicadores
function actualizarIndicadores() {
  const indicadores = document.querySelectorAll(".indicador");
  indicadores.forEach((indicador, index) => {
    if (index === peliculaActual) {
      indicador.classList.add("activo");
    } else {
      indicador.classList.remove("activo");
    }
  });
}

const scrollBtn = document.getElementById("scroll-btn");

scrollBtn.addEventListener("click", () => {
  const mainContent = document.querySelector("main");
  mainContent.scrollIntoView({ behavior: "smooth" }); // Desplazamiento suave hacia el contenido principal
});


document.addEventListener('DOMContentLoaded', () => {
  const formBuscador = document.getElementById('form-buscador');
  const inputBuscador = formBuscador.querySelector('input');
  const modalBusqueda = document.getElementById('modal-busqueda');
  const cerrarModalBusqueda = document.getElementById('cerrar-modal-busqueda');
  const contenedorResultados = document.getElementById('resultados-busqueda');

  // Evento para manejar el formulario de búsqueda
  formBuscador.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que la página se recargue
    const query = inputBuscador.value.trim();

    if (query) {
      console.log(`Buscando película: ${query}`);
      try {
        // Realizar la búsqueda en la API de TMDB
        const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`;
        const respuesta = await fetch(searchURL);
        const datos = await respuesta.json();

        if (datos.results && datos.results.length > 0) {
          mostrarResultadosBusqueda(datos.results);
          abrirModalBusqueda();
        } else {
          alert('No se encontraron resultados para tu búsqueda.');
        }
      } catch (error) {
        console.error('Error al buscar películas:', error);
        alert('Ocurrió un error al realizar la búsqueda. Inténtalo nuevamente.');
      }
    } else {
      alert('Por favor, ingresa el nombre de una película.');
    }
  });

  // Función para mostrar los resultados de la búsqueda
  function mostrarResultadosBusqueda(resultados) {
    contenedorResultados.innerHTML = ''; // Limpia los resultados anteriores

    resultados.forEach((pelicula) => {
      const imagen = pelicula.poster_path
      ? `https://image.tmdb.org/t/p/w200${pelicula.poster_path}`
      : pelicula.backdrop_path
      ? `https://image.tmdb.org/t/p/w200${pelicula.backdrop_path}`
      : '/img/placeholder.webp'; // Imagen predeterminada si no hay disponible

      const elemento = document.createElement('div');
      elemento.classList.add('resultado-item');
      elemento.innerHTML = `
        <img src="${imagen}" alt="${pelicula.title}">
        <h3>${pelicula.title}</h3>
        <p>${pelicula.overview || 'Sin descripción disponible.'}</p>
      `;

      // Añadir evento de clic para mostrar detalles de la película
      elemento.addEventListener('click', () => {
        mostrarDetallesPelicula({
          id: pelicula.id,
          titulo: pelicula.title || 'Título no disponible',
          descripcion: pelicula.overview || 'Descripción no disponible.',
          imagen: imagen, // Pasar la imagen validada
        });
        modalBusqueda.style.display = 'none'; // Cierra el modal de búsqueda
      });

      contenedorResultados.appendChild(elemento);
    });
  }

  // Función para abrir el modal de búsqueda
  function abrirModalBusqueda() {
    modalBusqueda.style.display = 'block';
  }

  // Función para cerrar el modal de búsqueda
  cerrarModalBusqueda.addEventListener('click', () => {
    modalBusqueda.style.display = 'none';
  });

  // Cerrar el modal al hacer clic fuera del contenido
  modalBusqueda.addEventListener('click', (event) => {
    if (event.target === modalBusqueda) {
      modalBusqueda.style.display = 'none';
    }
  });
});

document.getElementById("volver-buscador").addEventListener("click", () => {
  const modalPelicula = document.getElementById("modal-pelicula");
  const modalBusqueda = document.getElementById("modal-busqueda");

  // Cierra el modal de detalles
  modalPelicula.style.display = "none";

  // Reabre el modal del buscador
  modalBusqueda.style.display = "block";

  // Quitar la clase para mostrar nuevamente la hero section
  document.body.classList.remove("modal-abierto");
});

document.getElementById("volver-buscador").addEventListener("click", () => {
  const modalPelicula = document.getElementById("modal-pelicula");
  const modalBusqueda = document.getElementById("modal-busqueda");

  // Cierra el modal de detalles
  modalPelicula.style.display = "none";

  // Reabre el modal del buscador
  modalBusqueda.style.display = "block";
});