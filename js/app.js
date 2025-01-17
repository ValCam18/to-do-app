window.onload = function() {
    // Obtener las categorías desde el localStorage
    var categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    actualizarLista(categorias);
    actualizarSelectCategorias(categorias);
    actualizarSelectCategoriasPopup(categorias);
    cargarTareas()

}


function añadirCategoria() {
    var categoria = document.getElementById('category-input').value;

    if (categoria.trim() !== "") {

        var categorias = JSON.parse(localStorage.getItem('categorias')) || [];

        categorias.push(categoria);

        localStorage.setItem('categorias', JSON.stringify(categorias));

        document.getElementById('category-input').value = "";

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
            <li class="category-item">
                ${categoria} 
                <button  id="button-delete-category" class="button-delete-category" onclick="eliminarCategoria(${index})">Eliminar</button>
            </li>
        `;
        categoriasLista.innerHTML += categoriaItemHTML;
    });

}
function actualizarSelectCategorias(categorias) {
    var selectCategoria = document.getElementById('category-select');

    var opcionesHTML = '<option value="">Seleccionar...</option>';

    categorias.forEach(function(categoria) {
        opcionesHTML += `<option value="${categoria}">${categoria}</option>`;
    });

    selectCategoria.innerHTML = opcionesHTML;
}

function actualizarSelectCategoriasPopup(categorias) {
    var selectCategoria = document.getElementById('category-select-task');

    var opcionesHTML = '<option value="">CATEGORIA</option>';
    

    categorias.forEach(function(categoria) {
        opcionesHTML += `<option value="${categoria}">${categoria}</option>`;
    });

    selectCategoria.innerHTML = opcionesHTML;
}


function eliminarCategoria(index) {
    var categorias = JSON.parse(localStorage.getItem('categorias')) || [];

    categorias.splice(index, 1);

    localStorage.setItem('categorias', JSON.stringify(categorias));

    actualizarLista(categorias);
    actualizarSelectCategorias(categorias);
    actualizarSelectCategoriasPopup(categorias)

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



function eliminarTarea(index) {
    var tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareas.splice(index, 1);

    localStorage.setItem("tareas", JSON.stringify(tareas));
    filtrarTareas("todas"); // Recargar todas las tareas después de eliminar
    actualizarContadores(); // Actualizar los contadores
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
  
  // Función para actualizar la lista de tareas
  function actualizarListaTareas(tareas) {
    taskList.innerHTML = ""; // Limpiar la lista de tareas
  
    tareas.forEach(function(tarea, index) {
      var li = document.createElement("li");
      li.classList.add("task-item");
      li.innerHTML = `
        <span>
          <input type="checkbox" id="task-${index}" ${tarea.estado === "completado" ? "checked" : ""} onchange="cambiarEstadoTarea(${index})">
          <label for="task-${index}" class="text-task">${tarea.tarea}</label>
          ${tarea.categoria ? `<span class="category-tag">${tarea.categoria}</span>` : ""}
        </span>
        <span class="task-actions">
          <button id="button-edit-task" onclick="editarTarea(${index})">Editar</button>
          <button id="button-delete-task" onclick="eliminarTarea(${index})">Eliminar</button>
        </span>
      `;
      taskList.appendChild(li);
    });




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



