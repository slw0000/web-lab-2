from fastapi import APIRouter, HTTPException

from backend.schemas.student import StudentFilterSchema, StudentInfoSchema, StudentPatchSchema
from backend.services.student_validation import validate_new_student, validate_patched_student
from backend.repository.json_crud import add_student_json, delete_student_json, get_all_students_json, get_student_by_id, update_student


router = APIRouter(prefix="/api/requests", 
                   tags=["requests"])


@router.get("/", status_code=200)
def get_all_students():
    all_students = get_all_students_json()

    return {"message": "All students list",
            "students": all_students}


@router.get("/{student_id}", status_code=200)
def get_student(student_id: int):
    student = get_student_by_id(student_id)
    if student is not None:
        return {"message": f"Student with id={student_id}",
                "student": student}

    raise HTTPException(status_code=404,
                        detail=f"Student with id={student_id} was not found")


@router.post("/", status_code=201)
def add_new_student(student_info: StudentInfoSchema):
    validated_student = validate_new_student(student_info)
    student_id = add_student_json(validated_student)

    return {"message": "Student was added succesfully",
            "id": student_id,
            "student": validated_student}
         

@router.patch("/{student_id}", status_code=201) 
def edit_student_by_id(student_id: int, student_info: StudentPatchSchema):
    validated_student = validate_patched_student(student_info)
    status = update_student(student_id, validated_student)

    if status:
        return {"message": f"Student with id=${student_id} updated succesfully"}

    raise HTTPException(status_code=404, 
                        detail=f"Student with id={student_id} was not found")


@router.delete("/{student_id}", status_code=204)
def delete_student_by_id(student_id: int):
    status = delete_student_json(student_id)

    if not status:
        raise HTTPException(status_code=404,
                                detail=f"Student with id={student_id} was not found")

    
@router.api_route("/", methods=["QUERY"]) # todo
def filter_students(filter: StudentFilterSchema):
    return {"message": "Filter and/or sort students"}