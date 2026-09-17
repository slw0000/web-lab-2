console.log('index.js loaded');

import { getAllStudents, deleteStudent } from './database.js';

updateTable();

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

// Подключение ссылок к кнопкам кнопок

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
            await deleteStudent(Number(id));
            await updateTable()
        }
    } catch (error) {
        console.log(error)
    }
};

// функция обновления таблицы

async function updateTable() {
    try {
        const students = await getAllStudents()

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
        console.log(error.message)
    }
};


