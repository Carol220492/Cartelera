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

// Función para mostrar los detalles de la película en el modal
function mostrarDetallesPelicula(pelicula) {
  const modalPelicula = document.getElementById("modal-pelicula");
  const modalTitulo = document.getElementById("modal-titulo");
  const modalCartel = document.getElementById("modal-cartel");
  const modalDescripcion = document.getElementById("modal-descripcion");

  modalTitulo.textContent = pelicula.titulo;
  modalCartel.src = pelicula.imagen;
  modalCartel.alt = `Cartel de la película: ${pelicula.titulo}`;
  modalDescripcion.textContent = pelicula.descripcion;

  modalPelicula.style.display = "block";
}

// Evento para cerrar el modal
document.querySelector(".cerrar-modal").addEventListener("click", () => {
  document.getElementById("modal-pelicula").style.display = "none";
});

// También puedes cerrar el modal haciendo clic fuera del contenido
document.getElementById("modal-pelicula").addEventListener("click", (event) => {
  if (event.target === document.getElementById("modal-pelicula")) {
    document.getElementById("modal-pelicula").style.display = "none";
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