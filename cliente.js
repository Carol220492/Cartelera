document.addEventListener('DOMContentLoaded', async () => {
  const API_KEY = '5352ae6d40d8ce0aa806bcec99b733c4'; // Reemplaza con tu API Key de TMDB
  const BASE_URL = 'https://api.themoviedb.org/3';

  const heroTitulo = document.getElementById('hero-titulo');
  const heroDescripcion = document.getElementById('hero-descripcion');
  const heroImagen = document.getElementById('hero-imagen');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const listaContinuarViendo = document.getElementById('lista-continuar-viendo');
  const listaRecomendaciones = document.getElementById('lista-recomendaciones');

  let peliculas = [];
  let indiceActual = 0;

  try {
    // Ocultar el mensaje de error al principio
    const errorMensaje = document.getElementById('error-mensaje');
    if (errorMensaje) {
      errorMensaje.style.display = 'none';
    }

    // Llamada a la API para obtener las películas populares (Hero Section)
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`);
    const data = await response.json();
    peliculas = data.results;

    // Mostrar la primera película en la Hero Section
    mostrarPelicula(indiceActual);

    // Evento para mostrar la película anterior
    btnPrev.addEventListener('click', () => {
      indiceActual = (indiceActual - 1 + peliculas.length) % peliculas.length;
      mostrarPelicula(indiceActual);
    });

    // Evento para mostrar la siguiente película
    btnNext.addEventListener('click', () => {
      indiceActual = (indiceActual + 1) % peliculas.length;
      mostrarPelicula(indiceActual);
    });

    // Llamada a la API para obtener las películas en cartelera (Continuar Viendo)
    const continuarViendoResponse = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=es-ES&page=1`);
    const continuarViendoData = await continuarViendoResponse.json();

    // Mostrar Continuar Viendo con desplazamiento
    configurarCarrusel(listaContinuarViendo, continuarViendoData.results);

    // Llamada a la API para obtener las películas mejor valoradas (Recomendaciones)
    const recomendacionesResponse = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=es-ES&page=1`);
    const recomendacionesData = await recomendacionesResponse.json();

    // Mostrar Recomendaciones con desplazamiento
    configurarCarrusel(listaRecomendaciones, recomendacionesData.results);
  } catch (error) {
    console.error('Error al obtener los datos de la API:', error);

    // Mostrar el mensaje de error si ocurre un problema
    const errorMensaje = document.getElementById('error-mensaje');
    if (errorMensaje) {
      errorMensaje.style.display = 'block';
      errorMensaje.textContent = 'Hubo un problema al cargar los datos. Por favor, inténtalo de nuevo más tarde.';
    }
  }

  // Función para mostrar una película en la Hero Section
  function mostrarPelicula(indice) {
    const pelicula = peliculas[indice];
    heroTitulo.textContent = pelicula.title;
    heroDescripcion.textContent = pelicula.overview;
    heroImagen.src = `https://image.tmdb.org/t/p/w500${pelicula.backdrop_path}`;
    heroImagen.alt = `Imagen de la película ${pelicula.title}`;
  }

  // Función para configurar un carrusel
  function configurarCarrusel(lista, peliculas) {
    const maxPeliculasVisibles = 5;
    let inicio = 0;

    // Función para renderizar las películas visibles
    function renderizarPeliculas() {
      lista.innerHTML = '';
      const peliculasVisibles = peliculas.slice(inicio, inicio + maxPeliculasVisibles);
      peliculasVisibles.forEach((pelicula) => {
        const div = document.createElement('div');
        div.classList.add('pelicula');
        div.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}">
          <p>${pelicula.title}</p>
        `;
        lista.appendChild(div);
      });
    }

    // Renderizar las primeras 5 películas
    renderizarPeliculas();

    // Botones de desplazamiento
    const btnPrev = lista.parentElement.querySelector('.btn-prev');
    const btnNext = lista.parentElement.querySelector('.btn-next');

    btnPrev.addEventListener('click', () => {
      inicio = Math.max(0, inicio - maxPeliculasVisibles);
      renderizarPeliculas();
    });

    btnNext.addEventListener('click', () => {
      if (inicio + maxPeliculasVisibles < peliculas.length) {
        inicio += maxPeliculasVisibles;
      }
      renderizarPeliculas();
    });
  }

  // Cerrar sesión
  const btnLogout = document.getElementById('btn-logout');
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('usuario'); // Eliminar los datos del usuario
    alert('Has cerrado sesión.');
    window.location.href = 'index.html'; // Redirigir al inicio
  });
});