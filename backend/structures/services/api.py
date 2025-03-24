from dataclasses import dataclass

from structures import BaseStruct


@dataclass
class ServiceStruct(BaseStruct):
	name: str
	host: str
	port: int
