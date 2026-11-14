// Configuración de conexión con el backend (Serie II).
// Ajustar estos valores según la API de la Serie II.
const CONFIG = {
  // URL base de la API
  API_URL: 'http://localhost:3000/api',

  // Rutas de la API
  RUTA_REGISTRAR: '/reportes', // POST  (multipart/form-data)
  RUTA_LISTAR: '/reportes',    // GET   (lista de quejas/reportes)

  // Nombres de los campos que usa la API
  CAMPO_DESCRIPCION: 'descripcion',
  CAMPO_FOTO: 'foto',
  CAMPO_ID: 'id',
  CAMPO_FECHA: 'fecha',

  // Prefijo para las fotos si la API devuelve solo el nombre del archivo
  URL_FOTOS: 'http://localhost:3000/uploads/',
};
