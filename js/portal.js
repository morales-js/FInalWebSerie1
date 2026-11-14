// A. Portal público de atención ciudadana
const $ = (s) => document.querySelector(s);
const form = $('#form');
const inputFoto = $('#foto');
const dropzone = $('#dropzone');
let foto = null;

function setError(id, msg) {
  const f = $(id);
  f.classList.toggle('invalid', !!msg);
  f.querySelector('.error').textContent = msg || '';
}

function mostrarAlerta(msg) {
  $('#alerta').textContent = msg;
  $('#alerta').classList.toggle('hidden', !msg);
}

// ----- Fotografía -----
function elegirFoto(archivo) {
  setError('#f-foto', '');
  if (!archivo) return;
  if (!archivo.type.startsWith('image/')) {
    setError('#f-foto', 'El archivo debe ser una imagen.');
    return;
  }
  foto = archivo;
  $('#preview-img').src = URL.createObjectURL(archivo);
  $('#preview-nombre').textContent = archivo.name;
  $('#preview').classList.remove('hidden');
  dropzone.classList.add('hidden');
}

function quitarFoto() {
  foto = null;
  inputFoto.value = '';
  $('#preview').classList.add('hidden');
  dropzone.classList.remove('hidden');
}

dropzone.addEventListener('click', () => inputFoto.click());
dropzone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputFoto.click(); } });
inputFoto.addEventListener('change', () => elegirFoto(inputFoto.files[0]));
dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag'));
dropzone.addEventListener('drop', (e) => { e.preventDefault(); dropzone.classList.remove('drag'); elegirFoto(e.dataTransfer.files[0]); });
$('#quitar').addEventListener('click', quitarFoto);
$('#descripcion').addEventListener('input', () => setError('#f-descripcion', ''));

// ----- Envío -----
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  mostrarAlerta('');

  const descripcion = $('#descripcion').value.trim();
  let valido = true;
  if (!descripcion) { setError('#f-descripcion', 'Ingrese su queja o reporte.'); valido = false; }
  if (!foto) { setError('#f-foto', 'Adjunte una fotografía.'); valido = false; }
  if (!valido) return;

  const datos = new FormData();
  datos.append(CONFIG.CAMPO_DESCRIPCION, descripcion);
  datos.append(CONFIG.CAMPO_FOTO, foto, foto.name);

  const btn = $('#enviar');
  btn.disabled = true;
  btn.textContent = 'Enviando…';
  try {
    const res = await fetch(CONFIG.API_URL + CONFIG.RUTA_REGISTRAR, { method: 'POST', body: datos });
    const respuesta = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(respuesta.error || respuesta.mensaje || respuesta.message || `Error ${res.status} al registrar la queja.`);
    mostrarConfirmacion(respuesta);
  } catch (err) {
    mostrarAlerta(err instanceof TypeError ? 'No se pudo conectar con el servidor.' : err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enviar';
  }
});

// ----- Confirmación -----
function mostrarConfirmacion(respuesta) {
  const id = respuesta?.[CONFIG.CAMPO_ID] ?? respuesta?.data?.[CONFIG.CAMPO_ID];
  $('#ok-numero').textContent = id != null ? `No. de registro: ${id}` : '';
  $('#vista-form').classList.add('hidden');
  $('#vista-ok').classList.remove('hidden');
}

$('#nuevo').addEventListener('click', () => {
  form.reset();
  quitarFoto();
  $('#vista-ok').classList.add('hidden');
  $('#vista-form').classList.remove('hidden');
});
