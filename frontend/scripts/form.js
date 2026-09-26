console.log("form.js loaded");

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

let prevStudent = null;

// Подставляем в форм

if (id) {
    try {

        const response = await fetch(`http://127.0.0.1:8080/api/requests/${id}`)

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        prevStudent = data.student;

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
        dormitoryNumber: formData.get('dormitoryNumber') === "" ? null : Number(formData.get('dormitoryNumber')),
        room: formData.get('room') === "" ? null : Number(formData.get('room')),
        moveInDate: formData.get('moveInDate') || null,
        foreigner: formData.has('foreigner'),
        notes: formData.get('notes')
    };

    try {
        if (id) {
            const changedFields = {};

            for (const key of Object.keys(student)) {
                if (student[key] !== prevStudent[key]) {
                    changedFields[key] = student[key];
                }
            }

            if (Object.keys(changedFields).length === 0) {
                alert("Изменений нет!");
                return;
            }

            const response = await fetch(`http://127.0.0.1:8080/api/requests/${id}`, {
                method: "PATCH",
                body: JSON.stringify(changedFields),
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                console.error("HTTP status:", response.status);
            }
        } else {
            const response = await fetch("http://127.0.0.1:8080/api/requests/", {
                method: "POST",
                body: JSON.stringify(student),
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                console.error("HTTP status:", response.status);
            }
        }

        window.location.href = 'index.html';

    } catch (error) {
        console.log(error.message)
        alert(error.message);
    };
});
