# main.py
import uvicorn

from fastapi import FastAPI, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import asyncio
import json
import uuid
import time
from fastapi import Body


app = FastAPI()

# Enable CORS for your frontend origin
app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:11136"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

# Dictionary to store subscribers: { user_id: [queue1, queue2, ...] }
notification_subscribers = {}

# Helper function to send notifications to all subscribers for a given user
async def send_notification_to_user(user_id: str, notification: dict):
	if user_id in notification_subscribers:
		for queue in notification_subscribers[user_id]:
			await queue.put(notification)


@app.get("/sse/notifications")
async def notifications(
	request: Request,
	user_id: str = Query(..., description="User ID to filter notifications")
):
	# Create a new queue for this connection
	queue = asyncio.Queue()
	if user_id not in notification_subscribers:
		notification_subscribers[user_id] = []
	notification_subscribers[user_id].append(queue)

	async def event_publisher():
		try:
			while True:
				# Stop if the client disconnects
				if await request.is_disconnected():
					break

				try:
					# Wait for a new notification or timeout (10s) to send a keep-alive
					notification = await asyncio.wait_for(queue.get(), timeout=10.0)
					yield f"data: {json.dumps(notification)}\n\n"
				except asyncio.TimeoutError:
					# Send a comment as a keep-alive (SSE ignores lines starting with ":")
					yield ": keep-alive\n\n"
		finally:
			# Cleanup: remove the subscriber's queue
			notification_subscribers[user_id].remove(queue)
			if not notification_subscribers[user_id]:
				del notification_subscribers[user_id]

	return StreamingResponse(event_publisher(), media_type="text/event-stream")


@app.post("/notifications/read")
async def mark_notification_as_read(payload: dict = Body(...)):
	notification_id = payload.get("id")
	# Here you would update the notification's read status in your database.
	print(f"Marking notification {notification_id} as read.")
	return {"status": "Notification marked as read"}


@app.post("/send_notification")
async def send_notification(
	user_id: str,
	message: str,
	notification_type: str = "info",
	link: str = "http://localhost:11136/dashboard/notifications"
):
	notification = {
		"id": str(uuid.uuid4()),
		"user_id": user_id,
		"message": message,
		"timestamp": int(time.time()),
		"read": False,
		"notification_type": notification_type,  # e.g., "info", "warning", "alert"
		"link": link,
	}
	await send_notification_to_user(user_id, notification)
	return {"status": "Notification sent"}


if __name__ == "__main__":
	uvicorn.run(app, host="0.0.0.0", port=5000)