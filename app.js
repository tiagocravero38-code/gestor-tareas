// ============================================
//  GESTOR DE TAREAS — DDS
// ============================================

console.log('app.js cargado');

// ---- Referencias a los elementos del HTML ----
const formTarea      = document.querySelector('#form-tarea');
const inputTexto     = document.querySelector('#texto');
const selectPrioridad = document.querySelector('#prioridad');
const pError         = document.querySelector('#error');
const ulLista        = document.querySelector('#lista');
const pEstadisticas  = document.querySelector('#estadisticas');
const divFiltros = document.querySelector('#filtros');

let filtroActual = 'todas';

console.log(ulLista);

// ============================================
//  MODELO
// ============================================

// cada tarea nueva se lleva el siguiente número
let ultimoId = 0;

class Tarea {

  constructor(texto, prioridad) {
    ultimoId = ultimoId + 1;
    this.id = ultimoId;
    this.texto = texto;
    this.prioridad = prioridad;
    this.hecha = false;
  }

  alternar() {
    this.hecha = !this.hecha;
  }

}

// ---- Los datos de la aplicación ----
const tareas = [
  new Tarea('Leer el apunte 08', 'alta'),
  new Tarea('Repasar map y filter', 'media'),
  new Tarea('Tomar mate', 'baja')
];

console.table(tareas);

// ============================================
//  DIBUJAR
// ============================================

function colorPrioridad(prioridad) {
  if (prioridad === 'alta')  return 'text-bg-danger';
  if (prioridad === 'media') return 'text-bg-warning';
  return 'text-bg-secondary';
}

function render(lista) {

  if (lista.length === 0) {
    ulLista.innerHTML = '<li class="list-group-item text-secondary">No hay tareas todavía.</li>';
    return;
  }

  ulLista.innerHTML = lista.map(function (tarea) {
    return `
      <li class="list-group-item d-flex align-items-center gap-2 ${tarea.hecha ? 'hecha' : ''}">
        <input type="checkbox" class="form-check-input m-0"
               data-accion="alternar" data-id="${tarea.id}"
               ${tarea.hecha ? 'checked' : ''}>
        <span class="texto flex-grow-1">${tarea.texto}</span>
        <span class="badge ${colorPrioridad(tarea.prioridad)}">${tarea.prioridad}</span>
        <button class="btn btn-sm btn-outline-danger"
                data-accion="eliminar" data-id="${tarea.id}">✕</button>
      </li>`;
  }).join('');

}

render(tareas);

// ============================================
//  EVENTOS
// ============================================

formTarea.addEventListener('submit', function (evento) {

  evento.preventDefault();

  const texto = inputTexto.value.trim();
  const prioridad = selectPrioridad.value;

  pError.textContent = '';

  if (!texto) {
    pError.textContent = 'Escribí algo antes de agregar.';
    inputTexto.focus();
    return;
  }

  if (texto.length < 3) {
    pError.textContent = 'La tarea necesita al menos 3 caracteres.';
    return;
  }

  tareas.push(new Tarea(texto, prioridad));

  render(tareas);

  formTarea.reset();
  inputTexto.focus();

});
ulLista.addEventListener('click', function (evento) {

  // evento.target es el elemento exacto donde se hizo clic
  const control = evento.target;
  const accion = control.dataset.accion;

  // el clic pudo caer en el <li> y no en un control: ahí no hay nada que hacer
  if (!accion) return;

  const id = Number(control.dataset.id);

  const tarea = tareas.find(function (t) {
    return t.id === id;
  });

  if (!tarea) return;

  if (accion === 'alternar') {
    tarea.alternar();
  }

  if (accion === 'eliminar') {
    const posicion = tareas.indexOf(tarea);
    tareas.splice(posicion, 1);
  }

  render(tareas);

});

// ============================================
//  FILTROS Y ESTADÍSTICAS
// ============================================

function tareasFiltradas() {

  if (filtroActual === 'pendientes') {
    return tareas.filter(function (tarea) {
      return !tarea.hecha;
    });
  }

  if (filtroActual === 'hechas') {
    return tareas.filter(function (tarea) {
      return tarea.hecha;
    });
  }

  return tareas;
}

function mostrarEstadisticas() {

  const total = tareas.length;

  const hechas = tareas.filter(function (tarea) {
    return tarea.hecha;
  }).length;

  const porcentaje = total === 0 ? 0 : Math.round(hechas / total * 100);

  pEstadisticas.textContent =
    `${total} tarea(s) · ${hechas} completada(s) · ${porcentaje}% listo`;
}

function refrescar() {
  render(tareasFiltradas());
  mostrarEstadisticas();
}

divFiltros.addEventListener('click', function (evento) {

  const boton = evento.target;
  if (!boton.dataset.filtro) return;

  filtroActual = boton.dataset.filtro;

  divFiltros.querySelectorAll('button').forEach(function (b) {
    b.classList.remove('active');
  });
  boton.classList.add('active');

  refrescar();
});

refrescar();

// ============================================
//  JSON
// ============================================

const btnExportar   = document.querySelector('#btn-exportar');
const btnImportar   = document.querySelector('#btn-importar');
const textareaJson  = document.querySelector('#json');

btnExportar.addEventListener('click', function () {
  textareaJson.value = JSON.stringify(tareas, null, 2);
});

btnImportar.addEventListener('click', function () {

  let datos;

  try {
    datos = JSON.parse(textareaJson.value);
  } catch (error) {
    pError.textContent = 'Eso no es JSON válido. Revisá las comillas y las comas.';
    return;
  }

  if (!Array.isArray(datos)) {
    pError.textContent = 'El JSON tiene que ser un array de tareas.';
    return;
  }

  tareas.length = 0;

  datos.forEach(function (dato) {

    if (typeof dato.texto !== 'string') {
      console.warn('Se ignoró un elemento sin texto válido:', dato);
      return;
    }

    const tarea = new Tarea(dato.texto, dato.prioridad || 'media');
    tarea.hecha = dato.hecha === true;
    tareas.push(tarea);
  });

  pError.textContent = '';
  refrescar();
});