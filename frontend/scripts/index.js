import { getAllStudentsFiltered, getAllStudentsQuery, deleteStudent } from "./api.js"
import { showError } from "./errors.js";

console.log('index.js loaded');

// Обновление страницы и переменные для фильтрации при открытии

let currentFilters = new URLSearchParams();
let queryFilter = false;
let currentPage = 1;
const pageSize = 10;
let totalPages = 0;

const pageInfo = document.getElementById("page-info");
const backButton = document.getElementById("prev-page");
const forwButton = document.getElementById("next-page");

await loadPage(1);


// парсер параметров группы, общаги и комнаты

let groupPattern = /^[A-Z]\d{4}$/u;
let dormitoryPattern = /^\d+$/u;
let roomPattern = /^\d+$/u;

function parseParams(str, pattern) {
    const numbers = str.split(',').map(item => item.trim())
    .filter(item => item !== "");

    if (numbers.length > 0) {
        for (const number of numbers) {
            if (!pattern.test(number)) {
                showError(new Error(`Неверный формат параметра: ${number}`));
            }
    }

    if (numbers.length === 0) {
        return null; 
    } 
    if (numbers.length === 1) {
        return numbers[0];
    }
    return numbers;
}
}


// Подключение кнопки применения и сброса фильтров

const form = document.getElementById('students-query-form')

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const errorContainer = document.querySelector(".error-container");
    errorContainer.hidden = true;
    currentPage = 1;

    const formData = new FormData(form);
    const foreignerValue = formData.get("foreigner");
    let rawParams = {};
    try {
        rawParams = {
            surname: formData.get('surname').trim() || null,
            name: formData.get('name').trim() || null,
            patronymic: formData.get('patronymic').trim() || null,
            group: parseParams(formData.get('group'), groupPattern) || null,
            dormitoryNumber: parseParams(formData.get('dormitoryNumber'), dormitoryPattern) || null,
            room: parseParams(formData.get('room'), roomPattern) || null,
            moveInDateFrom: formData.get('moveInDateFrom') || null,
            moveInDateTo: formData.get('moveInDateTo') || null,
            foreigner: foreignerValue === "" ? null : foreignerValue === "true",
            sortBy: formData.get("sortBy"),
            order: formData.get("order"),
            page: currentPage,
            limit: pageSize
        }
    } catch (error) {
        showError(error);
        return;
    }

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(rawParams)) {
        if (value === null || value === undefined || value === "") {
            continue;
        }
        params.set(key, String(value));
    }

    queryFilter =
        Array.isArray(rawParams.group) ||
        Array.isArray(rawParams.dormitoryNumber) ||
        Array.isArray(rawParams.room);

    if (queryFilter) {
        for (const key of ["group", "dormitoryNumber", "room"]) {
            const value = rawParams[key];
                
            if (value !== null && !Array.isArray(value)) {
                rawParams[key] = [value];
            }
        }
    }

    currentFilters = queryFilter ? rawParams : params;
    loadPage(1);
});



form.addEventListener('reset', async function(event) {
    currentFilters = new URLSearchParams();
    queryFilter = false;
    currentPage = 1;
    currentFilters = {};
    loadPage(1);
});

// Подключение кнопок вперед и назад

backButton.addEventListener("click", () => loadPage(currentPage - 1));
forwButton.addEventListener("click", () => loadPage(currentPage + 1));


// Добавление логики клика по строке таблицы 

const element = document.getElementById('table-body');

element.ondblclick = function(event) {
    document.location.href = 'student.html?id=' + event.target.parentNode.id;
};


element.onclick = function(event) {
    element.querySelectorAll('.selected').forEach(function(item) {
        if (item !== event.target.parentNode) {
            item.classList.remove('selected');
        }
    });

    event.target.parentNode.classList.toggle('selected');

    if (event.target.parentNode.classList.contains('selected')) {
        document.querySelector('.edit-button').disabled = false;
        document.querySelector('.info-button').disabled = false;
        document.querySelector('.delete-button').disabled = false;
    } else {
        document.querySelector('.edit-button').disabled = true;
        document.querySelector('.info-button').disabled = true;
        document.querySelector('.delete-button').disabled = true;
    }
}; 

// Подключение ссылок к кнопкам

const editButton = document.querySelector('.edit-button');
editButton.onclick = function() {
    const selectedRow = document.querySelector('.selected');
    if (selectedRow) {
        let id = selectedRow.id;
        document.location.href = 'form.html?id=' + id;
    }
};

const infoButton = document.querySelector('.info-button');
infoButton.onclick = function() {
    const selectedRow = document.querySelector('.selected');
    if (selectedRow) {
        let id = selectedRow.id;
        document.location.href = 'student.html?id=' + id;
    }
};

const deleteButton = document.querySelector('.delete-button');
deleteButton.onclick = async function() {
    try {
        const selectedRow = document.querySelector('.selected');

        if (selectedRow) {
            let id = selectedRow.id;
            await deleteStudent(id);
            await loadPage(currentPage);
        }
    } catch (error) {
        showError(error);
    }
};

// функция обновления таблицы

async function updateTable(students) {
    try {

        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        let id = 0;

        for (const student of students) {
            id++;
            const row = document.createElement('tr');
            row.id = student.id;

            const values = [
                id,
                student.surname,
                student.name,
                student.patronymic ?? "–",
                student.group,
                student.isuId
            ]

            for (const cellData of values) {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                row.appendChild(cell);
            }

            tableBody.appendChild(row);
        };

        document.querySelector('.edit-button').disabled = true;
        document.querySelector('.info-button').disabled = true;
        document.querySelector('.delete-button').disabled = true;
    } catch (error) {
        showError(error);
    }
};

// Функция загрузки страницы

async function loadPage(page) {
    if (page < 1) return;

    try {
        currentPage = page;
        let result;

        if (queryFilter) {
            result = await getAllStudentsQuery({
                ...currentFilters,
                page: currentPage,
                limit: pageSize,
            });
        } else {
            const params = new URLSearchParams(currentFilters);
            params.set("page", String(currentPage));
            params.set("limit", String(pageSize));

            result = await getAllStudentsFiltered(params);
        }


        totalPages = result.total_pages;
        
        if (totalPages === 0) {
            await updateTable([]);
            pageInfo.textContent = "Страница 0 из 0";
            backButton.disabled = true;
            forwButton.disabled = true;
            return;
        }

        if (page > totalPages) {
            loadPage(page - 1)
            return
        }

        updateTable(result.students);

        pageInfo.textContent =
            `Страница ${totalPages === 0 ? 0 : currentPage} из ${totalPages}`;

        backButton.disabled = currentPage <= 1;
        forwButton.disabled = currentPage >= totalPages;
    } catch(error) {
        showError(error);
    }
};


