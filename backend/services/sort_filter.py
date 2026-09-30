from fastapi import HTTPException
from datetime import datetime
from typing import Optional

from backend.schemas.student import StudentFilterSchemaGET, StudentFilterSchemaQUERY

atributes_list = [
    "name",
    "surname",
    "patronymic",
    "group",
    "isuId",
    "dormitoryNumber",
    "room",
    "moveInDate",
    "foreigner",
    "notes",
    "id",
]


def sort_students(
    students: list[dict], sort_by: str = "id", order: str = "up"
) -> list[dict]:
    if sort_by not in atributes_list:
        raise HTTPException(
            status_code=400, detail="An order_by should be a valid atribute of student"
        )

    if order == "up":
        rev = False
    elif order == "down":
        rev = True
    else:
        raise HTTPException(
            status_code=400, detail='Order should be only "up" or "down"'
        )

    with_value = [student for student in students if student.get(sort_by) is not None]
    without_value = [student for student in students if student.get(sort_by) is None]

    sorted_students = (
        sorted(with_value, key=lambda x: x[sort_by], reverse=rev) + without_value
    )

    return sorted_students


def filter_students(
    students: list[dict], params: StudentFilterSchemaQUERY
) -> list[dict]:
    date_filter = False
    if params.moveInDateFrom is not None and params.moveInDateTo is not None:
        if params.moveInDateFrom > params.moveInDateTo:
            raise HTTPException(
                status_code=400,
                detail="The moveInDateFrom parametr should be less or equal than moveInDateTo",
            )
        date_filter = True
    elif params.moveInDateFrom != params.moveInDateTo:
        raise HTTPException(
            status_code=400,
            detail="To filter date both moveInDateFrom and moveInDateTo must exist",
        )

    filtered_students = []
    params = params.model_dump(exclude_unset=True, exclude_none=True)

    for stud in students:
        if date_filter and stud["moveInDate"] is not None:
            stud_date = datetime.strptime(stud["moveInDate"], "%Y-%m-%d").date()
            if date_filter and not (
                params["moveInDateFrom"] <= stud_date <= params["moveInDateTo"]
            ):
                continue
        elif date_filter and stud["moveInDate"] is None:
            continue

        for key, value in params.items():
            if key == "foreigner" and stud[key] != value:
                break
            if key in ["group", "dormitoryNumber", "room"] and stud[key] not in value:
                break
            if (
                key in ["name", "surname", "patronymic"]
                and value.casefold() not in stud[key].casefold()
            ):
                break
        else:
            filtered_students.append(stud)

    return filtered_students


def get_to_query_schema(
    params: StudentFilterSchemaGET,
) -> StudentFilterSchemaQUERY:
    return StudentFilterSchemaQUERY(
        name=params.name,
        surname=params.surname,
        patronymic=params.patronymic,
        group=[params.group] if params.group is not None else None,
        dormitoryNumber=[params.dormitoryNumber]
        if params.dormitoryNumber is not None
        else None,
        room=[params.room] if params.room is not None else None,
        foreigner=params.foreigner,
        moveInDateFrom=params.moveInDateFrom,
        moveInDateTo=params.moveInDateTo,
        sortBy=params.sortBy,
        order=params.order,
    )


def pagination(
    students: list[dict], page: Optional[int] = None, limit: Optional[int] = None
):
    if page is None and limit is None:
        return students

    if page is None or limit is None:
        raise HTTPException(
            status_code=400,
            detail="Parameters page and limit must be provided together",
        )

    if page < 1 or limit < 1:
        raise HTTPException(
            status_code=400,
            detail="Pagination parametrs page and limit should be greater or equal than 1",
        )

    left_border = (page - 1) * limit
    right_border = page * limit

    return students[left_border:right_border]
