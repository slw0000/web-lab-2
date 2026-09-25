from backend.schemas.student import StudentInfoSchema, StudentPatchSchema

def check_unque_isuId():
    pass

def validate_new_student(student_info: StudentInfoSchema):
    return student_info

def validate_patched_student(student_info: StudentPatchSchema):
    return student_info.model_dump(exclude_none=True)