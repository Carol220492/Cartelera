document.addEventListener('DOMContentLoaded', () => {
  const btnSuscripcion = document.getElementById('btn-suscripcion');
  const modalSuscripcion = document.getElementById('modal-suscripcion');
  const cerrarModalSuscripcion = document.getElementById('cerrar-modal-suscripcion');
  const formSuscripcion = document.getElementById('form-suscripcion');

  // Abrir el modal de suscripción
  btnSuscripcion.addEventListener('click', () => {
    modalSuscripcion.style.display = 'block';
  });

  // Cerrar el modal de suscripción
  cerrarModalSuscripcion.addEventListener('click', () => {
    modalSuscripcion.style.display = 'none';
  });

  // Cerrar el modal al hacer clic fuera del contenido
  modalSuscripcion.addEventListener('click', (event) => {
    if (event.target === modalSuscripcion) {
      modalSuscripcion.style.display = 'none';
    }
  });

  // Manejar el envío del formulario de suscripción
  formSuscripcion.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita el envío por defecto

    const email = document.getElementById('email').value;
    const password = document.getElementById('password-suscripcion').value;

    if (!email || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Guardar los datos del usuario en localStorage
    const usuario = { email, password };
    localStorage.setItem('usuario', JSON.stringify(usuario));

    alert('¡Registro exitoso! Redirigiendo a tu zona de cliente...');
    modalSuscripcion.style.display = 'none'; // Cierra el modal

    // Redirigir a cliente.html
    window.location.href = 'cliente.html';
  });
});