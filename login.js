document.addEventListener('DOMContentLoaded', () => {
  const btnLogin = document.getElementById('btn-login');
  const modalLogin = document.getElementById('modal-login');
  const cerrarModalLogin = document.getElementById('cerrar-modal-login');
  const formLogin = document.getElementById('form-login');

  // Abrir el modal de inicio de sesión
  btnLogin.addEventListener('click', () => {
    modalLogin.style.display = 'block';
  });

  // Cerrar el modal de inicio de sesión
  cerrarModalLogin.addEventListener('click', () => {
    modalLogin.style.display = 'none';
  });

  // Cerrar el modal al hacer clic fuera del contenido
  modalLogin.addEventListener('click', (event) => {
    if (event.target === modalLogin) {
      modalLogin.style.display = 'none';
    }
  });

  // Manejar el envío del formulario de inicio de sesión
  formLogin.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita el envío por defecto

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Obtener los datos del usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario && usuario.email === email && usuario.password === password) {
      alert(`Bienvenido, ${email}`);
      modalLogin.style.display = 'none'; // Cierra el modal
      // Redirigir a cliente.html
      window.location.href = 'cliente.html';
    } else {
      alert('Correo o contraseña incorrectos.');
    }
  });
});