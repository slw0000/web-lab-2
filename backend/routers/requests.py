from fastapi import APIRouter, HTTPException, Query
from typing import Annotated
from math import ceil

from backend.schemas.student import (
    StudentFilterSchemaGET,
    StudentFilterSchemaQUERY,
    StudentInfoSchema,
    StudentPatchSchema,
)
from backend.services.student_validation import (
    validate_new_student,
    validate_patched_student,
)
from backend.repository.json_crud import (
    add_student_json,
    delete_student_json,
    get_all_students_json,
    get_student_by_id,
    update_student,
)

from backend.services.sort_filter import (
    sort_students,
    filter_students,
    get_to_query_schema,
    pagination,
)


router = APIRouter(prefix="/api/requests", tags=["requests"])


@router.get("/", status_code=200)
def get_all_students(query_params: Annotated[StudentFilterSchemaGET, Query()]):
    """Get all students list (supports query parametrs as filters and sorts)"""

    all_students = get_all_students_json()
    filtered_students = filter_students(all_students, get_to_query_schema(query_params))
    sorted_students = sort_students(
        filtered_students, query_params.sortBy, query_params.order
    )

    students_count = len(filtered_students)
    paged_students = pagination(sorted_students, query_params.page, query_params.limit)
    total_pages = (
        ceil(students_count / query_params.limit) if query_params.limit else None
    )

    return {
        "message": "All students list",
        "students_count": len(sorted_students),
        "total_pages": total_pages,
        "page": query_params.page,
        "limit": query_params.limit,
        "students": paged_students,
    }


@router.get("/{student_id}", status_code=200)
def get_student(student_id: int):
    """Get student info by his id"""
    student = get_student_by_id(student_id)
    if student is not None:
        return {"message": f"Student with id={student_id}", "student": student}

    raise HTTPException(
        status_code=404, detail=f"Student with id={student_id} was not found"
    )


@router.post("/", status_code=201)
def add_new_student(student_info: StudentInfoSchema):
    """Add new student"""
    validated_student = validate_new_student(student_info)
    student_id = add_student_json(validated_student)

    return {
        "message": "Student was added succesfully",
        "id": student_id,
        "student": validated_student,
    }


@router.patch("/{student_id}", status_code=200)
def edit_student_by_id(student_id: int, student_info: StudentPatchSchema):
    """Patch some students values"""
    validated_student = validate_patched_student(student_info, student_id=student_id)
    status = update_student(student_id, validated_student)

    if status:
        return {"message": f"Student with id={student_id} updated succesfully"}

    raise HTTPException(
        status_code=404, detail=f"Student with id={student_id} was not found"
    )


@router.delete("/{student_id}", status_code=204)
def delete_student_by_id(student_id: int):
    """Delete student by his id"""
    status = delete_student_json(student_id)

    if not status:
        raise HTTPException(
            status_code=404, detail=f"Student with id={student_id} was not found"
        )


@router.api_route("/", methods=["QUERY"])
def query_filter(params: StudentFilterSchemaQUERY):

    all_students = get_all_students_json()
    filtered_students = filter_students(all_students, params)
    sorted_students = sort_students(filtered_students, params.sortBy, params.order)

    students_count = len(filtered_students)
    paged_students = pagination(sorted_students, params.page, params.limit)
    total_pages = ceil(students_count / params.limit) if params.limit else None

    return {
        "message": "All students list",
        "students_count": len(sorted_students),
        "total_pages": total_pages,
        "page": params.page,
        "limit": params.limit,
        "students": paged_students,
    }
