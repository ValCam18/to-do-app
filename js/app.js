window.onload = function() {
    // Obtener las categorías desde el localStorage
    var categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    actualizarLista(categorias);
    actualizarSelectCategorias(categorias);
    actualizarSelectCategoriasPopup(categorias);
    cargarTareas()

}


/* Agregar Fecha */
const fecha = document.querySelector("#fecha");
const FECHA = new Date();
fecha.innerHTML = FECHA.toLocaleDateString("es-ES", {weekday:"long", month:"short", day:"numeric", year:"numeric"});




function añadirCategoria() {
  var categoria = document.getElementById('category-input').value;
  var color = document.getElementById('category-color').value;

  if (categoria.trim() !== "") {

      var categorias = JSON.parse(localStorage.getItem('categorias')) || [];

      categorias.push({ nombre: categoria, color: color });

      localStorage.setItem('categorias', JSON.stringify(categorias));

      document.getElementById('category-input').value = "";
      document.getElementById('category-color').value = "#000000"; // Restablecer color por defecto

      actualizarLista(categorias);

  } else {
      alert('Por favor, introduce una categoría.');
  }
}



function actualizarLista(categorias) {
  var categoriasLista = document.getElementById("lista_categorias");
  categoriasLista.innerHTML = "";

  // Crear el HTML para cada categoría y agregarla al contenedor
  // <li class="category-item">Categoría 1 <button id="button-delete-category">Eliminar</button></li>

  categorias.forEach(function(categoria, index) {
      var categoriaItemHTML = `
      <li class="category-item" style="color: ${categoria.color};">
          ${categoria.nombre}
          <button id="button-delete-category" class="button-delete-category" onclick="mostrarPopupDeleteCategory(${index}) ">Eliminar</button>
      </li>
  `;
      categoriasLista.innerHTML += categoriaItemHTML;
  });

}






function mostrarPopupDeleteCategory(index){
  // Obtener el nombre de la tarea usando el índice
  var categorias = JSON.parse(localStorage.getItem('categorias')) || [];
  var categoriaNombre = categorias[index].nombre;


  document.getElementById("popup-confirm-delete-category").style.display = "flex";

  // Actualizar el texto del popup con el nombre de la tarea
  document.getElementById("delete-text-category").innerHTML = `¿Estás seguro de que deseas eliminar la categoría: <strong>${categoriaNombre}</strong>?`;
  document.getElementById("button-delete-category-popup").setAttribute("data-index", index);

}

function cerrarPopupDeleteCategory(){
  document.getElementById("popup-confirm-delete-category").style.display = "none";
}

function eliminarCategoria(index) {
  var index = document.getElementById("button-delete-category-popup").getAttribute("data-index"); // Obtener el índice del atributo del botón  
  var categorias = JSON.parse(localStorage.getItem('categorias')) || [];

  categorias.splice(index, 1);

  localStorage.setItem('categorias', JSON.stringify(categorias));

  actualizarLista(categorias);
  actualizarSelectCategorias(categorias);
  actualizarSelectCategoriasPopup(categorias)
  cerrarPopupDeleteCategory(); // Cerramos el popup

}



function actualizarSelectCategorias(categorias) {
  const selectCategoria = document.getElementById('category-select');

  var opcionesHTML = '<option value="">Seleccionar...</option>';

  categorias.forEach(function(categoria) {
      opcionesHTML += `<option value="${categoria.nombre}">${categoria.nombre}</option>`;
  });

  selectCategoria.innerHTML = opcionesHTML;
}



function actualizarSelectCategoriasPopup(categorias) {
  const selectCategoria = document.getElementById('category-select-task');

  var opcionesHTML = '<option value="">CATEGORIA</option>';
  

  categorias.forEach(function(categoria) {
      opcionesHTML += `<option value="${categoria.nombre}">${categoria.nombre}</option>`;
  });

  selectCategoria.innerHTML = opcionesHTML;
}




function mostrarPopup(){
    document.getElementById("popup-add-task").style.display = "flex";
}
function cerrar_popup(){
    document.getElementById("popup-add-task").style.display = "none";

}

function cargarTareas() {
    var tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    actualizarListaTareas(tareas);
    actualizarContadores();
}


function añadirTarea() {
    //event.preventDefault();
    var tareaInput = document.getElementById("task-input").value.trim();
    var categoriaSeleccionada = document.getElementById("category-select-task").value;

    if (tareaInput === "") {
        alert("Por favor, introduce una tarea.");
        return;
    }

    var tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareas.push({ tarea: tareaInput, categoria: categoriaSeleccionada, estado: "activo" });
    localStorage.setItem("tareas", JSON.stringify(tareas));

    document.getElementById("task-input").value = "";
    cerrar_popup();
    cargarTareas();

}



function mostrarPopupDelete(index){
  // Obtener el nombre de la tarea usando el índice
  var tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  var tareaNombre = tareas[index].tarea;

  document.getElementById("popup-confirm-delete").style.display = "flex";

  // Actualizar el texto del popup con el nombre de la tarea
  document.getElementById("delete-text").innerHTML = `¿Estás seguro de que deseas eliminar la tarea: <strong>${tareaNombre}</strong>?`;
  document.getElementById("button-delete-task-popup").setAttribute("data-index", index);

}

function cerrarPopupDelete(){
  document.getElementById("popup-confirm-delete").style.display = "none";
}


function eliminarTarea(index) {
  var index = document.getElementById("button-delete-task-popup").getAttribute("data-index"); // Obtener el índice del atributo del botón  
  var tareas = JSON.parse(localStorage.getItem("tareas")) || []; // Obtenemos las tareas
  tareas.splice(index, 1); // Eliminamos la tarea por el índice guardado

      localStorage.setItem("tareas", JSON.stringify(tareas));
      filtrarTareas("todas"); // Recargar todas las tareas después de eliminar
      actualizarContadores(); // Actualizar los contadores
      cerrarPopupDelete(); // Cerramos el popup
}



// POP UP DE CONFIRMACIÓN ELIMINAR TODAS LAS TAREAS
function mostrarPopupTachar(){
  var tareas = JSON.parse(localStorage.getItem("tareas")) || [];

  // Verificar si todas las tareas ya están completadas
  var todasCompletadas = tareas.every(tarea => tarea.estado === "completado");

  if (todasCompletadas) {
      // Si todas las tareas ya están completadas, deshabilitar el botón y no mostrar el popup
      document.getElementById("button-tachar-task").disabled = true;
      alert("Todas las tareas ya están tachadas.");
      return; // No continuar con la ejecución
  }

  document.getElementById("popup-confirm-tachar").style.display = "flex";
}

function cerrarPopupTachar(){
  document.getElementById("popup-confirm-tachar").style.display = "none";
}



function tacharTodasTareas() {
  var tareas = JSON.parse(localStorage.getItem("tareas")) || [];

  // Verificar si todas las tareas ya están completadas
  var todasCompletadas = tareas.every(tarea => tarea.estado === "completado");

 
  // Cambiar el estado de todas las tareas a "completado"
  tareas.forEach(tarea => tarea.estado = "completado");

  // Guardar las tareas actualizadas en el localStorage
  localStorage.setItem("tareas", JSON.stringify(tareas));

  // Recargar las tareas para reflejar los cambios en la interfaz
  cargarTareas();

  // Cerrar el popup después de tachar todas las tareas
  cerrarPopupTachar();
}




function cambiarEstadoTarea(index) {
    var tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareas[index].estado = tareas[index].estado === "activo" ? "completado" : "activo";

    localStorage.setItem("tareas", JSON.stringify(tareas));
    filtrarTareas("todas"); // Recargar todas las tareas después de cambiar el estado
    actualizarContadores(); // Actualizar los contadores
}



function actualizarContadores() {
    var tareas = JSON.parse(localStorage.getItem("tareas")) || [];

    var total = tareas.length;
    var pendientes = tareas.filter(tarea => tarea.estado === "activo").length;
    var realizadas = tareas.filter(tarea => tarea.estado === "completado").length;

    // Actualizar los contadores en los botones
    document.getElementById("count-all").textContent = `(${total})`;
    document.getElementById("count-pending").textContent = `(${pendientes})`;
    document.getElementById("count-done").textContent = `(${realizadas})`;
}



function filtrarTareas(estado) {
    var tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    
    var tareasFiltradas = [];
  
    // Filtra las tareas según el estado
    if (estado === 'todas') {
      tareasFiltradas = tareas;
    } else if (estado === 'pendientes') {
      tareasFiltradas = tareas.filter(function(tarea) {
        return tarea.estado === "activo";
      });
    } else if (estado === 'realizadas') {
      tareasFiltradas = tareas.filter(function(tarea) {
        return tarea.estado === "completado";
      });
    }
  
    actualizarListaTareas(tareasFiltradas);
  
    // Actualizar contadores
    countAll.textContent = "(" + tareas.length + ")";
    countPending.textContent = "(" + tareas.filter(function(tarea) {
      return tarea.estado === "activo";
    }).length + ")";
    countDone.textContent = "(" + tareas.filter(function(tarea) {
      return tarea.estado === "completado";
    }).length + ")";
  }
  
 


  function actualizarListaTareas(tareas) {
    taskList.innerHTML = ""; // Limpiar la lista de tareas

    var categorias = JSON.parse(localStorage.getItem('categorias')) || []; // Obtener las categorías
     
  
    tareas.forEach(function(tarea, index) {

      var categoriaObj = categorias.find(cat => cat.nombre === tarea.categoria); // Buscar la categoría en la lista
      var colorCategoria = categoriaObj ? categoriaObj.color : "#000000"; // Obtener el color o usar negro por defecto




      var li = document.createElement("li");
      li.classList.add("task-item");
      li.innerHTML = `
        <span>
          <input type="checkbox" id="task-${index}" ${tarea.estado === "completado" ? "checked" : ""} onchange="cambiarEstadoTarea(${index})">
          <label for="task-${index}" class="text-task ${tarea.estado === "completado" ? "task-completed" : ""}">${tarea.tarea}</label>

          ${tarea.categoria ? `<span class="category-tag" style="background-color: ${colorCategoria}; ">${tarea.categoria}</span>` : ""}


        </span>
        <span class="task-actions">
                <button id="button-edit-task" onclick="editarTarea(${index})" ${tarea.estado === "completado" ? "disabled" : ""}>Editar</button>
                <button id="button-delete-task" onclick="mostrarPopupDelete(${index})">Eliminar</button>

        </span>

      `;

      
      taskList.appendChild(li);
    });
  }




function editarTarea(index) {
  var tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  var tarea = tareas[index];


  // Seleccionar la casilla específica de la tarea
  var taskItem = document.querySelectorAll(".task-item")[index];

  // Reemplazar contenido con el formulario editable
  taskItem.innerHTML = `
    <span>
      <input type="text" id="edit-task-input" value="${tarea.tarea}" class="edit-input">
      <select id="edit-category-select" class="edit-select">
        <option value="">Seleccionar...</option>
      </select>
    </span>
    <span class="task-actions">
      <button id="button-save-task" onclick="guardarTarea(${index})">Guardar</button>
      <button id="button-cancel-task" onclick="cancelarEdicion(${index})">Cancelar</button>
    </span>
  `;
  // Llenar el select de categorías
  var categorias = JSON.parse(localStorage.getItem("categorias")) || [];
  var select = document.getElementById("edit-category-select");

  categorias.forEach(function(categoria) {
      var option = document.createElement("option");
      option.value = categoria.nombre;
      option.textContent = categoria.nombre;
      if (categoria.nombre === tarea.categoria) {
          option.selected = true;
      }
      select.appendChild(option);
  });


}





function guardarTarea(index) {
  var tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  // Obtener los valores del input y select
  var tareaInput = document.getElementById("edit-task-input").value.trim();
  var categoriaSeleccionada = document.getElementById("edit-category-select").value;

  if (tareaInput === "") {
      alert("La tarea no puede estar vacía.");
      return;
  }
  // Actualizar los valores de la tarea
  tareas[index].tarea = tareaInput;
  tareas[index].categoria = categoriaSeleccionada;
  localStorage.setItem("tareas", JSON.stringify(tareas)); // Guardar en localStorage
  cargarTareas(); // Recargar la lista de tareas
}

function cancelarEdicion(index) {
  cargarTareas(); // Simplemente recarga las tareas originales
}







// FUNCION ICONO COMO PICKER COLOR CATEGORIA

function colorCategoria(){
  var color = document.getElementById("category-color").click();
}


var taskList = document.querySelector("#task-list");
var searchInput = document.querySelector("#search-input"); // Utilizamos el ID directamente

// Variables para los contadores de tareas
var countAll = document.querySelector("#count-all");
var countPending = document.querySelector("#count-pending");
var countDone = document.querySelector("#count-done");

// Función de búsqueda
searchInput.addEventListener("input", function(e) {
  var query = e.target.value.toLowerCase(); // Texto ingresado en la barra de búsqueda
  document.querySelectorAll(".task-item").forEach(function(task) {
    // Obtén el nombre y la categoría de la tarea si existen
    var taskNameElement = task.querySelector(".text-task");
    var taskCategoryElement = task.querySelector(".category-tag");

    var taskName = taskNameElement ? taskNameElement.textContent.toLowerCase() : "";
    var taskCategory = taskCategoryElement ? taskCategoryElement.textContent.toLowerCase() : "";

    // Muestra u oculta la tarea si coincide con la búsqueda
    if (taskName.includes(query) || taskCategory.includes(query)) {
      task.style.display = "flex"; // Mostrar tarea
    } else {
      task.style.display = "none"; // Ocultar tarea
    }
  });
});



	
function filtrarTareas(estado) {
  var tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  var categoriaSeleccionada = document.getElementById("category-select").value;
  
  var tareasFiltradas = [];
  // Filtra las tareas según el estado
  if (estado === 'todas') {
      tareasFiltradas = tareas;
  } else if (estado === 'pendientes') {
      tareasFiltradas = tareas.filter(function(tarea) {
          return tarea.estado === "activo";
      });
  } else if (estado === 'realizadas') {
      tareasFiltradas = tareas.filter(function(tarea) {
          return tarea.estado === "completado";
      });
  }
  // Filtrar también por categoría
  if (categoriaSeleccionada) {
      tareasFiltradas = tareasFiltradas.filter(function(tarea) {
          return tarea.categoria === categoriaSeleccionada;
      });
  }
  // Actualizar la lista de tareas
  actualizarListaTareas(tareasFiltradas);
  // Actualizar los contadores
  actualizarContadores();
}
document.getElementById("category-select").addEventListener("change", function() {
  // Filtrar las tareas según el estado actual y la categoría seleccionada
  var estadoActual = document.querySelector(".filter-button.active") ? document.querySelector(".filter-button.active").dataset.estado : 'todas';
  filtrarTareas(estadoActual);
});
document.getElementById("filter-all").addEventListener("click", function() {
  document.querySelectorAll(".filter-button").forEach(button => button.classList.remove("active"));
  this.classList.add("active");
  filtrarTareas('todas');
});
document.getElementById("filter-pending").addEventListener("click", function() {
  document.querySelectorAll(".filter-button").forEach(button => button.classList.remove("active"));
  this.classList.add("active");
  filtrarTareas('pendientes');
});
document.getElementById("filter-done").addEventListener("click", function() {
  document.querySelectorAll(".filter-button").forEach(button => button.classList.remove("active"));
  this.classList.add("active");
  filtrarTareas('realizadas');
});



