console.log("student.js loaded");

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Подставляем текст в соответсущие поля, аналогично как в form.js 
if (id) {
    try {
        const response = await fetch(`http://127.0.0.1:8080/api/requests/${id}`)

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        const prevStudent = data.student;

        document.getElementById('student-full-name').textContent = `${prevStudent.surname} ${prevStudent.name} ${prevStudent.patronymic ?? ''}`

        document.getElementById('group').textContent = displayValue(prevStudent.group);
        document.getElementById('isuId').textContent = displayValue(prevStudent.isuId);
        document.getElementById('dormitoryNumber').textContent = displayValue(prevStudent.dormitoryNumber);
        document.getElementById('room').textContent = displayValue(prevStudent.room);
        document.getElementById('moveInDate').textContent = displayValue(prevStudent.moveInDate);
        document.getElementById('foreigner').textContent = prevStudent.foreigner === true ? 'Да' :
                                                            prevStudent.foreigner === false ? 'Нет' : '–';
        document.getElementById('notes').textContent = displayValue(prevStudent.notes);

    } catch (error) {
        console.log(error.message);
    };
}

const editButton = document.querySelector('.edit-button');

editButton.onclick = function() {
    if (id) {
        document.location.href = 'form.html?id=' + id;
    }
};


function displayValue(value) {
    if (value === null || value === undefined || String(value).trim() === '') {
        return '–';
    }

    return String(value);
}