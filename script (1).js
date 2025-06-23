function mostrarCampos() {
  const rol = document.getElementById('rol').value;
  const camposDiv = document.getElementById('formulario-campos');
  camposDiv.innerHTML = '';

  if (rol) {
    let html = `
      <input type="text" id="nombre" placeholder="Nombre" required>
      <input type="text" id="apellido" placeholder="Apellido" required>
      <input type="text" id="cedula" placeholder="Cédula" required>
    `;

    if (rol === 'veterinario') {
      html += `<input type="text" id="tarjeta" placeholder="Tarjeta Profesional" required>`;
    }

    html += `<button onclick="iniciarSesion()">Iniciar sesión</button>`;

    if (rol === 'usuario') {
      html += `<br><button onclick="mostrarFormularioRegistro()">REGISTRAR</button>`;
    } else if (rol === 'veterinario') {
      html += `<p>No estás registrado. Comunícate con el administrador.</p>`;
    } else if (rol === 'admin') {
      html += `<p>Si la información es incorrecta, digítela de nuevo.</p>`;
    }

    camposDiv.innerHTML = html;
  }
}

function iniciarSesion() {
  const rol = document.getElementById('rol').value;
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const cedula = document.getElementById('cedula').value;

  if (!nombre || !apellido || !cedula) {
    alert('Por favor complete todos los campos.');
    return;
  }

  if (rol === 'usuario') {
    localStorage.setItem('usuarioNombre', nombre);
    mostrarSeccion('seccion-usuario');
  } else if (rol === 'veterinario') {
    const tarjeta = document.getElementById('tarjeta').value;
    if (!tarjeta) {
      alert('Por favor complete todos los campos.');
      return;
    }
    localStorage.setItem('veterinarioNombre', nombre);
    mostrarSeccion('seccion-veterinario');
  } else if (rol === 'admin') {
    if (nombre === 'admin' && apellido === 'admin' && cedula === '123') {
      localStorage.setItem('adminNombre', nombre);
      mostrarSeccion('seccion-admin');
    } else {
      alert('Información incorrecta. Intente de nuevo.');
    }
  }
}

function mostrarFormularioRegistro() {
  const camposDiv = document.getElementById('formulario-campos');
  camposDiv.innerHTML = `
    <h3>Formulario de Registro</h3>
    <input type="text" id="reg-nombre" placeholder="Nombre completo" required>
    <input type="text" id="reg-cedula" placeholder="Cédula" required>
    <input type="text" id="reg-direccion" placeholder="Dirección" required>
    <input type="text" id="reg-telefono" placeholder="Teléfono" required>
    <h4>Datos de la Mascota</h4>
    <input type="text" id="reg-mascota-nombre" placeholder="Nombre de la mascota" required>
    <input type="text" id="reg-mascota-especie" placeholder="Especie" required>
    <input type="text" id="reg-mascota-edad" placeholder="Edad" required>
    <button onclick="guardarRegistroBD()">Guardar</button>
  `;
}

function guardarRegistroBD() {
  const data = {
    nombre: document.getElementById('reg-nombre').value,
    cedula: document.getElementById('reg-cedula').value,
    direccion: document.getElementById('reg-direccion').value,
    telefono: document.getElementById('reg-telefono').value,
    mascota: {
      nombre: document.getElementById('reg-mascota-nombre').value,
      especie: document.getElementById('reg-mascota-especie').value,
      edad: document.getElementById('reg-mascota-edad').value
    }
  };

  fetch('guardar.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(respuesta => {
    if (respuesta.mensaje) {
      alert(respuesta.mensaje);
    } else {
      alert('Error: ' + respuesta.error);
    }
  })
  .catch(err => alert('Error al conectar con el servidor: ' + err));
}

function guardarRegistro() {
  const nombre = document.getElementById('reg-nombre').value;
  const cedula = document.getElementById('reg-cedula').value;
  const direccion = document.getElementById('reg-direccion').value;
  const telefono = document.getElementById('reg-telefono').value;
  const mascotaNombre = document.getElementById('reg-mascota-nombre').value;
  const especie = document.getElementById('reg-mascota-especie').value;
  const edad = document.getElementById('reg-mascota-edad').value;

  if (!nombre || !cedula || !direccion || !telefono || !mascotaNombre || !especie || !edad) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  const nuevoRegistro = {
    nombre,
    cedula,
    direccion,
    telefono,
    mascota: {
      nombre: mascotaNombre,
      especie,
      edad
    }
  };

  const registrosGuardados = JSON.parse(localStorage.getItem('registrosUsuarios')) || [];
  registrosGuardados.push(nuevoRegistro);
  localStorage.setItem('registrosUsuarios', JSON.stringify(registrosGuardados));

  alert('Registro guardado exitosamente.');
  document.getElementById('formulario-campos').innerHTML = `<p>Registro completado. Ya puedes iniciar sesión.</p>`;
}

function mostrarSeccion(id) {
  const secciones = document.querySelectorAll('.seccion');
  secciones.forEach(sec => sec.style.display = 'none');
  document.getElementById(id).style.display = 'block';

  const h2 = document.querySelector(`#${id} .banner h2`);
  if (id === 'seccion-usuario') {
    h2.textContent = `HOLA, ${localStorage.getItem('usuarioNombre')} bienvenida`;
  } else if (id === 'seccion-veterinario') {
    h2.textContent = `HOLA, Dr. ${localStorage.getItem('veterinarioNombre')}`;
  } else if (id === 'seccion-admin') {
    h2.textContent = `Bienvenido, Administrador`;
  }

  document.querySelector('.login-container').style.display = 'none';
}

window.onload = function () {
  const rolSelector = document.getElementById('rol');
  if (rolSelector) {
    rolSelector.addEventListener('change', mostrarCampos);
  }
};
