const apiRoute = "http://127.0.0.1:8080/api/requests/"

async function errorHandler(response) {
    const data = await response.json().catch(() => null);

    switch (response.status) {
        case 422:
            const fieldNames = {
                patronymic: "Отчество",
                name: "Имя",
                surname: "Фамилия",
                group: "Группа",
                isuId: "ИСУ ID",
            };


            const text = data.detail.map(error => {
                const field = error.loc?.[error.loc.length - 1];
                const fieldName = fieldNames[field] ?? field ?? "Данные";
                const message = error.msg;

                return `${fieldName}: ${message}`;
            }).join("\n");
            throw new Error(`Ошибка валидации данных (422):\n${text}`)
        case 409:
            throw new Error(`Ошибка конфликта данных (409):\n${data.detail}`)
        case 404:
            throw new Error(`Ошибка не найдено (404):\n${data.detail}`)
        default:
            throw new Error(`Произошла ошибка (${response.status})`)
    }
}

export async function getAllStudents() {
    const response = await fetch(apiRoute)

    if (!response.ok) {
        await errorHandler(response);
    }

    const data = await response.json();
    return data.students;
}

export async function getStudentById(id) {
    const response = await fetch(apiRoute + id);

    if (!response.ok) {
        await errorHandler(response);
    }

    const data = await response.json();
    return data.student;
}

export async function createStudent(student) {
    const response = await fetch(apiRoute, {
        method: "POST",
        body: JSON.stringify(student),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        await errorHandler(response);
    }
}

export async function editStudent(id, changedFields) {
    const response = await fetch(apiRoute + id, {
        method: "PATCH",
        body: JSON.stringify(changedFields),
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        await errorHandler(response);
    }
}

export async function deleteStudent(id) {
    const response = await fetch(apiRoute + id, {
        method: "DELETE"
    });

    if (!response.ok) {
        await errorHandler(response);
    }
}