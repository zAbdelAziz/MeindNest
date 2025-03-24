from fastapi import APIRouter

from api.handlers.notifications import NotificationHandlers


class Router(APIRouter):
	"""
	This class extends the APIRouter class and provides a way to add routes to the router.
		Used to simplify adding and editing routes for every section, by a simple dictionary.
	"""
	def __init__(self):
		super().__init__()

		# Notifications
		self.add_api_route(self.notify['path'], self.notify['handler'], methods=self.notify['methods'])
		self.add_api_route(self.notifications['path'], self.notifications['handler'], methods=self.notifications['methods'])
		self.add_api_route(self.mark_notification_read['path'], self.mark_notification_read['handler'], methods=self.mark_notification_read['methods'])

	# Notifications
	@property
	def notify(self):
		return {'path': '/send_notification', 'methods': ['POST'], 'handler': NotificationHandlers.notify}

	@property
	def notifications(self):
		return {'path': '/sse/notifications', 'methods': ['GET'], 'handler': NotificationHandlers.notifications}

	@property
	def mark_notification_read(self):
		return {'path': '/notifications/read', 'methods': ['POST'], 'handler': NotificationHandlers.mark_notifications_read}
