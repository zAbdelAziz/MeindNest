import uvicorn
from fastapi import FastAPI

app = FastAPI()

@app.get("/data")
def read_data():
    return {"message": "Hello from FastAPI"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)