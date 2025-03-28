from dataclasses import dataclass


from structures import BaseStruct


@dataclass
class TableData(BaseStruct):
	headers: list[str]
	rows: list[list[str]]


@dataclass
class TableCSVInput(BaseStruct):
	table_id: str
	table_data: TableData
