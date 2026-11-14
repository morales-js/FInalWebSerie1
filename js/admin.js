// B. Panel de Administración Municipal
const $ = (s) => document.querySelector(s);
let reportes = [];

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function urlFoto(valor) {
  if (!valor) return '';
  return /^(https?:|data:|blob:|\/)/.test(valor) ? valor : CONFIG.URL_FOTOS + valor;
}

function fecha(valor) {
  if (!valor) return '';
  const d = new Date(valor);
  return isNaN(d) ? String(valor) : d.toLocaleString('es-GT', { dateStyle: 'medium', timeStyle: 'short' });
}

async function cargar() {
  $('#alerta').classList.add('hidden');
  try {
    const res = await fetch(CONFIG.API_URL + CONFIG.RUTA_LISTAR);
    if (!res.ok) throw new Error(`Error ${res.status} al obtener las quejas.`);
    const datos = await res.json();
    reportes = Array.isArray(datos) ? datos : (datos.data || datos.reportes || []);
    mostrar();
  } catch (err) {
    $('#total').textContent = '';
    $('#alerta').textContent = err instanceof TypeError ? 'No se pudo conectar con el servidor.' : err.message;
    $('#alerta').classList.remove('hidden');
  }
}

function mostrar() {
  $('#total').textContent = `Total de registros: ${reportes.length}`;
  if (!reportes.length) {
    $('#lista').innerHTML = '<div class="empty" style="grid-column:1/-1">No hay quejas o reportes registrados.</div>';
    return;
  }
  $('#lista').innerHTML = reportes.map((r, i) => `
    <button type="button" class="item" data-i="${i}">
      <img src="${esc(urlFoto(r[CONFIG.CAMPO_FOTO]))}" alt="Fotografía de la queja" loading="lazy">
      <div class="body">
        <div class="meta">No. ${esc(r[CONFIG.CAMPO_ID])}${r[CONFIG.CAMPO_FECHA] ? ' · ' + esc(fecha(r[CONFIG.CAMPO_FECHA])) : ''}</div>
        <div class="desc">${esc(r[CONFIG.CAMPO_DESCRIPCION])}</div>
      </div>
    </button>`).join('');
}

function abrir(r) {
  $('#d-titulo').textContent = `Queja No. ${r[CONFIG.CAMPO_ID] ?? ''}${r[CONFIG.CAMPO_FECHA] ? ' · ' + fecha(r[CONFIG.CAMPO_FECHA]) : ''}`;
  $('#d-foto').src = urlFoto(r[CONFIG.CAMPO_FOTO]);
  $('#d-descripcion').textContent = r[CONFIG.CAMPO_DESCRIPCION] ?? '';
  $('#detalle').classList.remove('hidden');
}

function cerrar() {
  $('#detalle').classList.add('hidden');
}

$('#lista').addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (item) abrir(reportes[item.dataset.i]);
});
$('#cerrar').addEventListener('click', cerrar);
$('#detalle').addEventListener('click', (e) => { if (e.target.id === 'detalle') cerrar(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
$('#actualizar').addEventListener('click', cargar);

cargar();
