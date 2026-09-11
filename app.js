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