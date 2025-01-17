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
                <button class="button-delete-category" onclick="eliminarCategoria(${index})">Eliminar</button>
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
}
function actualizarListaTareas(tareas) {

    var listaTareas = document.getElementById('task-list');
    listaTareas.innerHTML = "";

    tareas.forEach((tarea, index) => {
        var li = document.createElement("li");
        li.classList.add("task-item");
        li.innerHTML = `
            <span>
                <input type="checkbox" id="task-${index}" ${tarea.estado === "completado" ? "checked" : ""} onchange="cambiarEstadoTarea(${index})">
                <label for="task-${index}">${tarea.tarea}</label>
                ${tarea.categoria ? `<span class="category-tag">${tarea.categoria}</span>` : ""}
            </span>
            <span class="task-actions">
                <button onclick="editarTarea(${index})">Editar</button>
                <button onclick="eliminarTarea(${index})">Eliminar</button>
            </span>
        `;
        listaTareas.appendChild(li);
    });
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

