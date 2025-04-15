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
