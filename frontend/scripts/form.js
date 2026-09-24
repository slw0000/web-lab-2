console.log("form.js loaded");

import { validateStudent } from "./students-service.js";
import { addStudent, getStudentByDbId, updateStudent } from "./database.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Подставляем в форм

if (id) {
    try {
        let prevStudent = await getStudentByDbId(id);

        if (!prevStudent) {
            throw new Error("Студента с таким id не существует!")
        }

        document.getElementById('surname').value = prevStudent.surname
        document.getElementById('name').value = prevStudent.name;
        document.getElementById('patronymic').value = prevStudent.patronymic
        document.getElementById('group').value = prevStudent.group
        document.getElementById('isuId').value = prevStudent.isuId
        document.getElementById('dormitoryNumber').value = prevStudent.dormitoryNumber
        document.getElementById('room').value = prevStudent.room
        document.getElementById('moveInDate').value = prevStudent.moveInDate
        document.getElementById('foreigner').checked = prevStudent.foreigner
        document.getElementById('notes').value = prevStudent.notes

        document.title = "Редактирование студента";
        document.querySelector('h1').textContent = "Редактирование студента";
        document.getElementById('accept-button').textContent = "Применить изменения";

        let header = document.querySelector('header');
        let subtitle = document.createElement('h4');
        subtitle.textContent = `Студент: ${prevStudent.surname} ${prevStudent.name} | ИСУ: ${prevStudent.isuId}`;
        header.appendChild(subtitle)

    } catch (error) {
        console.log(error.message);
        alert(error.message);
    };
}


// Обработка кнопки

const form = document.getElementById('student-form')

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    let student = {
        surname: formData.get('surname'),
        name: formData.get('name'),
        patronymic: formData.get('patronymic'),
        group: formData.get('group'),
        isuId: formData.get('isuId'),
        dormitoryNumber: formData.get('dormitoryNumber'),
        room: formData.get('room'),
        moveInDate: formData.get('moveInDate'),
        foreigner: formData.has('foreigner'),
        notes: formData.get('notes')
    };

    console.log('Student:', student)

    try {
        student = await validateStudent(student, id);
        
        if (id) {
            await updateStudent(student, id)
        } else {
            await addStudent(student);
        }

        window.location.href = 'index.html';

    } catch (error) {
        console.log(error.message)
        alert(error.message);
    };
});
