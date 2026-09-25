from pathlib import Path
import json

from backend.schemas.student import StudentInfoSchema


JSON_DIR = Path(__file__).joinpath("../..", "data/data.json").resolve()

def init_data_json(directory: Path = JSON_DIR) -> None: 
    if not directory.exists():
        with directory.open("w", encoding="utf-8") as file:
            json.dump([], file, ensure_ascii=False, indent=4)
        return

    with directory.open("r", encoding="utf-8") as file:
        students = json.load(file)

    if not isinstance(students, list):
        raise ValueError("JSON data file should contain list objject")



def add_student_json(student_info: StudentInfoSchema, directory: Path = JSON_DIR) -> int:
    with directory.open("r+", encoding="utf-8") as file:
        students = json.load(file)

        next_id = max((student["id"] for student in students), default=0) + 1

        student_data = student_info.model_dump(mode="json")
        student_data["id"] = next_id
        students.append(student_data)

        file.seek(0)
        file.truncate()
        json.dump(students, file, ensure_ascii=False, indent=4)
        

        return next_id


def delete_student_json(student_id: int, directory: Path = JSON_DIR) -> bool:
    with directory.open("r+", encoding="utf-8") as file:
        students = json.load(file)

        for i, student_data in enumerate(students):
            if student_data["id"] == student_id:
                students.pop(i)
                
                file.seek(0)
                file.truncate()
                json.dump(students, file, ensure_ascii=False, indent=4)

                return True
        
        return False


def get_all_students_json(directory: Path = JSON_DIR) -> list[dict]:
    with directory.open("r", encoding="utf-8") as file:
            students = json.load(file)

            return students


def get_student_by_id(student_id: int, directory: Path = JSON_DIR) -> dict | None:
    with directory.open("r", encoding="utf-8") as file:
        students = json.load(file)
    
        for student_data in students:
            if student_data["id"] == student_id:
                return student_data

        return None


def update_student(student_id: int, upd_student: dict, directory: Path = JSON_DIR) -> bool:
    with directory.open("r+", encoding="utf-8") as file:
        students = json.load(file)
    
        for i, student_data in enumerate(students):
            if student_data["id"] == student_id:
                students[i].update(upd_student)

                file.seek(0)
                file.truncate()
                json.dump(students, file, ensure_ascii=False, indent=4)
                
                return True
                
        return False

                