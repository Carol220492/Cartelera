// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Asignar el evento al botón de play dentro de #hero
    const btnPlay = document.querySelector('.btn-play');
    
    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        // Obtener los datos de la película desde el DOM
        const titulo = document.querySelector('#hero-titulo').textContent;
        const descripcion = document.querySelector('#hero-descripcion').textContent;
        const id = 123;  // Aquí puedes obtener el ID de la película dinámicamente si lo tienes disponible
  
        // Llamar a la función para abrir la película
        abrirPelicula(id, titulo);
      });
    }
  });
  