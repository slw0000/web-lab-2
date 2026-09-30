// Функция которая показывает ошибки на странице (чтобы не повторяться)

export function showError(error) {
    const errorContainer = document.querySelector(".error-container");
    const errorText = errorContainer.querySelector("p");

    errorText.textContent = error.message || "Не удалось загрузить студентов";
    errorContainer.hidden = false;
}