from dataclasses import dataclass, asdict


@dataclass
class BaseStruct:
	@property
	def dict(self):
		"""
		Converts the dataclass to a dictionary
		Returns:
			(dict): facility schema
		"""
		return asdict(self)

	def __getitem__(self, key):
		return getattr(self, key)