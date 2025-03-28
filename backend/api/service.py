import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import Config
from api.router import Router
from structures.services.api import ServiceStruct


class APIService(ServiceStruct):
	def __init__(self, name: str, host: str, port: int):
		super(APIService, self).__init__(name=name, host=host, port=port)

		self.app = FastAPI(title=self.name)
		self.router = Router()

		self.allowed_origins = ['http://localhost:11136']

		self.subscribers = {}

		self.app.notify = self._notify_user
		self.app.subscribers = self.subscribers
		self.app.config = Config()

	def start(self):
		"""
		Starts the application by including the router, setting the publish method, and running the app using uvicorn.
		"""
		# Add the router instance to the app
		self.app.include_router(self.router)

		self.app.add_middleware(CORSMiddleware, allow_origins=self.allowed_origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"],)
		# Start the API using uvicorn
		uvicorn.run(self.app, host=self.host, port=self.port)

	async def _notify_user(self, user_id: str, notification: dict):
		if user_id in self.app.subscribers:
			for queue in self.app.subscribers[user_id]:
				await queue.put(notification)
		else:
			# No active subscriber; log or store for offline delivery
			print(f"No active subscriber for user {user_id}. Notification stored for later delivery.")
		# Optionally, add code to persist the notification (e.g., in a database or in-memory store)
