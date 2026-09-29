from pydantic import BaseModel, Field, field_validator
from datetime import date
from typing import Optional
from regex import fullmatch


fio_pattern = r"\p{L}[\p{L} -`]*\p{L}"


class StudentInfoSchema(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    surname: str = Field(min_length=2, max_length=50)
    patronymic: str = Field(min_length=0, max_length=50)
    group: str = Field(pattern=r"^[A-Z]\d{4}$")
    isuId: str = Field(pattern=r"^[1-9]\d{5}$")
    dormitoryNumber: Optional[int] = Field(ge=1, le=100)
    room: Optional[int] = Field(ge=1, le=1000)
    moveInDate: Optional[date]
    foreigner: bool
    notes: str

    @field_validator("name", "surname", "patronymic", mode="before")
    @classmethod
    def clean_and_validate_fio(cls, value):
        if not isinstance(value, str):
            return value
        value = value.strip()
        if value == "":
            return value
        if not fullmatch(fio_pattern, value):
            raise ValueError("Allowed only letters, space and '–'")
        return value

    @field_validator("moveInDate")
    @classmethod
    def validate_date(cls, value):
        if value is None:
            return value
        if value < date(2000, 1, 1):
            raise ValueError("Date should be later than 2000-01-01")
        if value > date.today():
            raise ValueError("Date should be earlier than today")
        return value


class StudentPatchSchema(BaseModel):
    name: str = Field(default="", min_length=2, max_length=50)
    surname: str = Field(default="", min_length=2, max_length=50)
    patronymic: str = Field(default="", min_length=0, max_length=50)
    group: str = Field(default="", pattern=r"^[A-Z]\d{4}$")
    isuId: str = Field(default="", pattern=r"^[1-9]\d{5}$")
    dormitoryNumber: Optional[int] = Field(default=None, ge=1, le=100)
    room: Optional[int] = Field(default=None, ge=1, le=1000)
    moveInDate: Optional[date] = None
    foreigner: bool = False
    notes: str = ""

    @field_validator("name", "surname", "patronymic", mode="before")
    @classmethod
    def clean_and_validate_fio(cls, value):
        if not isinstance(value, str):
            return value
        value = value.strip()
        if value == "":
            return value
        if not fullmatch(fio_pattern, value):
            raise ValueError("Allowed only letters, space and '–'")
        return value

    @field_validator("moveInDate")
    @classmethod
    def validate_date(cls, value):
        if value is None:
            return value
        if value < date(2000, 1, 1):
            raise ValueError("Date should be later than 2000-01-01")
        if value > date.today():
            raise ValueError("Date should be earlier than today")
        return value


class StudentFilterSchema(BaseModel):
    # просто заглушка пока что
    id: str
    name: str
