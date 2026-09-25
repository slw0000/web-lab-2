from pydantic import BaseModel
from datetime import date
from typing import Optional

class StudentInfoSchema(BaseModel):
    name: str
    surname: str
    patronymic: Optional[str]
    group: str
    isuId: str
    dormitoryNumber: str
    room: str
    moveInDate: Optional[date] = None
    foreigner: bool
    notes: str


class StudentPatchSchema(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    patronymic: Optional[str] = None
    group: Optional[str] = None
    isuId: Optional[str] = None
    dormitoryNumber: Optional[str] = None
    room: Optional[str] = None
    moveInDate: Optional[date] = None
    foreigner: Optional[bool] = None
    notes: Optional[str] = None



class StudentFilterSchema(BaseModel):
    # просто заглушка пока что
    id: str
    name: str

