import os
import json

from types import SimpleNamespace


class Config:
	def __init__(self):
		self.root_path = os.path.dirname(os.path.abspath(__file__))
		self.config_fpath = os.path.join(self.root_path, 'config.json')

		self._raw_config = None
		self.load()

	# @property
	def load(self):
		if self._raw_config is None:
			with open(self.config_fpath, 'r') as f:
				self._raw_config = json.load(f, object_hook=lambda d: SimpleNamespace(**d))
			# Update the main object's attributes with the loaded config.
			for key, value in self._raw_config.__dict__.items():
				if key not in self.__dict__:
					setattr(self, key, value)
		return self._raw_config