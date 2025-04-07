document.querySelectorAll('.carrusel').forEach(carrusel => {
  const contenedor = carrusel.querySelector('.carrusel-contenedor');
  const prevBtn = carrusel.querySelector('.carrusel-btn.prev');
  const nextBtn = carrusel.querySelector('.carrusel-btn.next');
  
  let scrollPosition = 0;
  
  prevBtn.addEventListener('click', () => {
    const cardWidth = contenedor.querySelector('.card').offsetWidth + 20; // Ancho de la card + margen
    scrollPosition -= cardWidth;
    if (scrollPosition < 0) scrollPosition = 0;
    contenedor.style.transform = `translateX(-${scrollPosition}px)`;
  });
  
  nextBtn.addEventListener('click', () => {
    const cardWidth = contenedor.querySelector('.card').offsetWidth + 20; // Ancho de la card + margen
    const maxScroll = contenedor.scrollWidth - contenedor.offsetWidth; // Máximo desplazamiento
    scrollPosition += cardWidth;
    if (scrollPosition > maxScroll) scrollPosition = maxScroll;
    contenedor.style.transform = `translateX(-${scrollPosition}px)`;
  });
});