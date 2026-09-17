import { getStudentByIsuId } from './database.js'

// валидация, типо бизнес логика

export async function validateStudent(student, id) {

    let newIsuStudent = await getStudentByIsuId(student.isuId);
    if (newIsuStudent && ((id && (newIsuStudent.id !== Number(id))) || (!id))) {
        throw new Error(`ИСУ ${ student.isuId } уже занят другим студентом!`)
    };

    student.name = student.name.trim();
    student.surname = student.surname.trim();
    student.patronymic = student.patronymic.trim();
    student.dormitoryNumber = student.dormitoryNumber.trim();
    student.room = student.room.trim();
    student.notes = student.notes.trim()

    const allowedCharactersFIO = /^(\p{L}[\p{L} -`]*\p{L})$/u;

    if (!(allowedCharactersFIO.test(student.name))) {
        throw new Error("Имя должно содержать буквы; допускаются пробелы и дефис");
    };

    if (!(allowedCharactersFIO.test(student.surname))) {
        throw new Error("Фамилия должна содержать буквы; допускаются пробелы и дефис");
    };

    if (!(allowedCharactersFIO.test(student.patronymic) || student.patronymic === "")) {
        throw new Error("Отчество должно содержать буквы; допускаются пробелы и дефис");
    };

    if (!(Number(student.isuId) > 0)) {
        throw new Error("ИСУ должен быть больше 0")
    }

    const allowedDormitoryNum = /^[1-9]([0-9/]*[0-9])?$/u;

    if (!(allowedDormitoryNum.test(student.dormitoryNumber) || student.dormitoryNumber === "")) {
        throw new Error("В поле 'Номер общежития' допускаются только цифры и символ '/'");
    };

    if (!(allowedDormitoryNum.test(student.room) || student.room === "")) {
        throw new Error("В поле 'Комната' допускаются только цифры и символ '/'");
    };


    return student;
};