// Variables del DOM
const taskList = document.querySelector(".task-list");
const categoryList = document.querySelector(".category-list");
const addCategoryInput = document.querySelector(".category-input");
const addCategoryBtn = document.querySelector(".add-category-btn");
const searchInput = document.querySelector(".search-input");

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase(); // Texto ingresado en la barra de búsqueda
  document.querySelectorAll(".task").forEach((task) => {
    // Obtén el nombre y la categoría de la tarea si existen
    const taskNameElement = task.querySelector(".task-name");
    const taskCategoryElement = task.querySelector(".task-category");
    
    const taskName = taskNameElement ? taskNameElement.textContent.toLowerCase() : "";
    const taskCategory = taskCategoryElement ? taskCategoryElement.textContent.toLowerCase() : "";

    // Muestra u oculta la tarea si coincide con la búsqueda
    if (taskName.includes(query) || taskCategory.includes(query)) {
      task.style.display = "flex"; // Mostrar tarea
    } else {
      task.style.display = "none"; // Ocultar tarea
    }
  });
});

// Añadir categoría
addCategoryBtn.addEventListener("click", () => {
  const categoryName = addCategoryInput.value.trim();
  if (!categoryName) {
    alert("Por favor, escribe un nombre para la categoría.");
    return;
  }

  // Verificar si ya existe
  if (
    Array.from(categoryList.children).some(
      (item) => item.textContent.trim() === categoryName
    )
  ) {
    alert("La categoría ya existe.");
    return;
  }

  // Crear y añadir categoría
  const li = document.createElement("li");
  li.className = "category";
  li.textContent = categoryName;
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Eliminar";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.addEventListener("click", () => li.remove());
  li.appendChild(deleteBtn);
  categoryList.appendChild(li);
  addCategoryInput.value = ""; // Limpiar campo
});
