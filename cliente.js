document.addEventListener('DOMContentLoaded', () => {
  const btnLogout = document.getElementById('btn-logout');
  const mainContent = document.getElementById('main-content');
  const zonaCliente = document.getElementById('zona-cliente');
  const clienteEmail = document.getElementById('cliente-email');
  const listaFavoritos = document.getElementById('lista-favoritos');
  const listaRecomendaciones = document.getElementById('lista-recomendaciones');
  const listaContinuarViendo = document.getElementById('lista-continuar-viendo');

  // Obtener los datos del usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario) {
    // Mostrar la zona de cliente si el usuario está logueado
    clienteEmail.textContent = usuario.email;
    mainContent.style.display = 'none';
    zonaCliente.style.display = 'block';
  } else {
    // Redirigir al inicio si no hay usuario logueado
    alert('Por favor, inicia sesión primero.');
    window.location.href = 'index.html';
  }

  // Cerrar sesión
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('usuario'); // Eliminar los datos del usuario
    alert('Has cerrado sesión.');
    window.location.href = 'index.html'; // Redirigir al inicio
  });

  // Simular base de datos de películas
  const peliculas = [
    { id: 1, titulo: 'Película 1', categoria: 'Acción' },
    { id: 2, titulo: 'Película 2', categoria: 'Drama' },
    { id: 3, titulo: 'Película 3', categoria: 'Comedia' },
  ];

  // Simular recomendaciones
  const recomendaciones = [
    { id: 4, titulo: 'Película 4', categoria: 'Acción' },
    { id: 5, titulo: 'Película 5', categoria: 'Ciencia Ficción' },
  ];

  // Mostrar recomendaciones
  listaRecomendaciones.innerHTML = '';
  recomendaciones.forEach((pelicula) => {
    const li = document.createElement('li');
    li.textContent = pelicula.titulo;
    listaRecomendaciones.appendChild(li);
  });

  // Agregar a favoritos
  peliculas.forEach((pelicula) => {
    const li = document.createElement('li');
    li.textContent = pelicula.titulo;
    li.addEventListener('click', () => {
      if (usuario) {
        usuario.favoritos = usuario.favoritos || [];
        usuario.favoritos.push(pelicula);
        localStorage.setItem('usuario', JSON.stringify(usuario)); // Actualizar en localStorage
        const favoritoLi = document.createElement('li');
        favoritoLi.textContent = pelicula.titulo;
        listaFavoritos.appendChild(favoritoLi);
      } else {
        alert('Inicia sesión para agregar a favoritos.');
      }
    });
    listaFavoritos.appendChild(li);
  });
});