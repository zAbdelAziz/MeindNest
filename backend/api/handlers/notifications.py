import traceback

import json
import uuid
import time

import asyncio

from fastapi import Request, Query, Body
from fastapi.responses import StreamingResponse


class NotificationHandlers:
	@staticmethod
	async def notifications(request: Request, user_id: str = Query(..., description="User ID to filter notifications")):
		# Create a new queue for this connection
		queue = asyncio.Queue()

		if user_id not in request.app.subscribers:
			request.app.subscribers[user_id] = []
		request.app.subscribers[user_id].append(queue)

		async def event_publisher():
			try:
				while True:
					if await request.is_disconnected():
						print("Client disconnected")
						break
					try:
						notification = await asyncio.wait_for(queue.get(), timeout=10.0)
						print("Sending notification:", notification)
						notif = json.dumps(notification)
						yield f"data: {notif}\n\n"
					except asyncio.TimeoutError:
						print("Sending keep-alive")
						yield ": keep-alive\n\n"
					except Exception as e:
						traceback.print_exc()
			finally:
				print("Cleaning up subscriber")
				request.app.subscribers[user_id].remove(queue)
				if not request.app.subscribers[user_id]:
					del request.app.subscribers[user_id]

		return StreamingResponse(event_publisher(), media_type="text/event-stream")

	@staticmethod
	async def mark_notifications_read(payload: dict = Body(...)):
		notification_id = payload.get("id")
		# Here you would update the notification's read status in your database.
		print(f"Marking notification {notification_id} as read.")
		return {"status": "Notification marked as read"}

	@staticmethod
	async def notify(request: Request, user_id: str, message: str, notification_type: str = "info", link: str = "http://localhost:11136/dashboard/notifications"):
		notification = {
			"id": str(uuid.uuid4()),
			"user_id": user_id,
			"message": message,
			"timestamp": int(time.time()),
			"read": False,
			"notification_type": notification_type,  # e.g., "info", "warning", "alert"
			"link": link,
		}
		await request.app.notify(user_id, notification)
		return {"status": "Notification sent"}
