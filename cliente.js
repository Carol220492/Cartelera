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
  const categoriasContainer = document.getElementById('categorias-container');

  let peliculas = [];
  let indiceActual = 0;

  try {
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

    // Mostrar Continuar Viendo
    listaContinuarViendo.innerHTML = '';
    continuarViendoData.results.forEach((pelicula) => {
      const div = document.createElement('div');
      div.classList.add('pelicula');
      div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}">
        <p>${pelicula.title}</p>
      `;
      listaContinuarViendo.appendChild(div);
    });

    // Llamada a la API para obtener las películas mejor valoradas (Recomendaciones)
    const recomendacionesResponse = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=es-ES&page=1`);
    const recomendacionesData = await recomendacionesResponse.json();

    // Mostrar Recomendaciones
    listaRecomendaciones.innerHTML = '';
    recomendacionesData.results.forEach((pelicula) => {
      const div = document.createElement('div');
      div.classList.add('pelicula');
      div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}">
        <p>${pelicula.title}</p>
      `;
      listaRecomendaciones.appendChild(div);
    });

    // Llamada a la API para cargar las categorías (secciones del index)
    const categoriasResponse = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`);
    const categoriasData = await categoriasResponse.json();

    categoriasContainer.innerHTML = '';
    categoriasData.genres.forEach((categoria) => {
      const div = document.createElement('div');
      div.classList.add('categoria');
      div.textContent = categoria.name;
      categoriasContainer.appendChild(div);
    });
  } catch (error) {
    console.error('Error al obtener los datos de la API:', error);
    alert('Hubo un problema al cargar los datos. Por favor, inténtalo de nuevo más tarde.');
  }

  // Función para mostrar una película en la Hero Section
  function mostrarPelicula(indice) {
    const pelicula = peliculas[indice];
    heroTitulo.textContent = pelicula.title;
    heroDescripcion.textContent = pelicula.overview;
    heroImagen.src = `https://image.tmdb.org/t/p/w500${pelicula.backdrop_path}`;
    heroImagen.alt = `Imagen de la película ${pelicula.title}`;
  }

  // Cerrar sesión
  const btnLogout = document.getElementById('btn-logout');
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('usuario'); // Eliminar los datos del usuario
    alert('Has cerrado sesión.');
    window.location.href = 'index.html'; // Redirigir al inicio
  });
});