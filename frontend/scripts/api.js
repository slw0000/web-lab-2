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
            throw new Error(`Ошибка валидации данных (422):\n${text}`);
        case 409:
            throw new Error(`Ошибка конфликта данных (409):\n${data.detail}`);
        case 404:
            throw new Error(`Ошибка не найдено (404):\n${data.detail}`);
        default:
            throw new Error(`Произошла ошибка (${response.status})`);
    }
}

export async function getAllStudents() {
    let response;
    try{
        response = await fetch(apiRoute)
    } catch(error) {
        throw new Error(`Ошибка при запросе к API`);
    }

    if (!response.ok) {
        await errorHandler(response);
    }

    const data = await response.json();
    return data.students; 
}

export async function getAllStudentsFiltered(params = {}) {
    let response;
    try{
        response = await fetch(apiRoute + "?" + params);
    } catch(error) {
        throw new Error(`Ошибка при запросе к API`);
    }

    if (!response.ok) {
        await errorHandler(response);
    }

    const data = await response.json();
    return data.students; 
}

export async function getAllStudentsQuery(params) {
    let response;
    try {
        response = await fetch(apiRoute, {
            method: "QUERY",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params),
        });
    } catch(error) {
        throw new Error(`Ошибка при запросе к API`)
    }

    if (!response.ok) await errorHandler(response);

    const data = await response.json();
    return data.students;
}

export async function getStudentById(id) {
    let response;
    try {
        response = await fetch(apiRoute + id);
    } catch(error) {
        throw new Error(`Ошибка при запросе к API`);
    }  

    if (!response.ok) {
        await errorHandler(response);
        }
    const data = await response.json();
    return data.student;
}

export async function createStudent(student) {
    let response;
    try{
        response = await fetch(apiRoute, {
            method: "POST",
            body: JSON.stringify(student),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch(error) {
        throw new Error(`Ошибка при запросе к API`);
    }
    
    if (!response.ok) {
        await errorHandler(response);
    }
}

export async function editStudent(id, changedFields) {
    let response;
    try {
        response = await fetch(apiRoute + id, {
            method: "PATCH",
            body: JSON.stringify(changedFields),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch(error) {
        throw new Error(`Ошибка при запросе к API`);
    }

    if (!response.ok) {
        await errorHandler(response);
    }
}

export async function deleteStudent(id) {
    let response;
    try {
        response = await fetch(apiRoute + id, {
            method: "DELETE"
        });
    } catch(error) {
        throw new Error(`Ошибка при запросе к API`);
    }
    if (!response.ok) {
        await errorHandler(response);
    }
}