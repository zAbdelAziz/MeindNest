# main.py
from api.service import APIService


def run():
	api = APIService(name='Internal-API', host='0.0.0.0', port=12850)
	api.start()


if __name__ == "__main__":
	run()
