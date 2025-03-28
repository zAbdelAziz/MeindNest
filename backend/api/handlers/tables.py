import os
import csv

from fastapi import Request, HTTPException

from api.schemas.tables import TableCSVInput


class TablesHandler:
	@staticmethod
	async def save_table(request: Request, data: TableCSVInput):
		# Create a unique filename by combining table_id and widget_id.
		filename = f"{data.table_id}.csv"
		f_dir = os.path.join(request.app.config.temp_dir, 'tables')
		os.makedirs(f_dir, exist_ok=True)
		# filepath = os.path.join(output_dir, filename)
		f_path = os.path.join(f_dir, filename)
		try:
			with open(f_path, mode="w", newline="", encoding="utf-8") as csvfile:
				writer = csv.writer(csvfile)
				writer.writerow(data.table_data.headers)
				for row in data.table_data.rows:
					writer.writerow(row)
		except Exception as e:
			request.app.logger.error(f"Failed to save table: {e}")
			raise HTTPException(status_code=500, detail=f"Error writing CSV: {str(e)}")

		return {"message": "Table saved successfully", "filename": filename}