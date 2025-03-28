from fastapi import APIRouter

from api.handlers.notifications import NotificationHandlers
from api.handlers.tables import TablesHandler


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

		# Widgets
		self.add_api_route(self.table_save['path'], self.table_save['handler'], methods=self.table_save['methods'])

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

	@property
	def table_save(self):
		return {'path': '/widgets/tables/save-table', 'methods': ['POST'], 'handler': TablesHandler.save_table}