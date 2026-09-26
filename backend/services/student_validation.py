from backend.schemas.student import StudentInfoSchema, StudentPatchSchema
from backend.repository.json_crud import get_all_students_json

from fastapi import HTTPException


def check_availiable_isuId(isuId: str) -> bool:
    students = get_all_students_json()
    for stud in students:
        if stud["isuId"] == isuId:
            return False

    return True


def check_unique_isuId(isuId: str, student_id: int) -> bool:
    students = get_all_students_json()
    for stud in students:
        if stud["isuId"] == isuId and stud["id"] != student_id:
            return False

    return True


def validate_new_student(
    student_info: StudentInfoSchema, new: bool = True, student_id: int | None = None
):
    student = student_info.model_dump(mode="json")

    student["notes"] = student["notes"].strip()

    if not check_availiable_isuId(student["isuId"]):
        raise HTTPException(
            status_code=409,
            detail=f"Student with isuId={student['isuId']} already exists",
        )

    return student


def validate_patched_student(student_info: StudentPatchSchema, student_id: int):
    student = student_info.model_dump(mode="json", exclude_unset=True)

    if isinstance(student.get("notes"), str):
        student["notes"] = student["notes"].strip()

    isu_id = student.get("isuId")
    if isu_id is not None and not check_unique_isuId(isu_id, student_id):
        raise HTTPException(
            status_code=409,
            detail=f"ISU {student['isuId']} alredy taken by another student",
        )

    return student
