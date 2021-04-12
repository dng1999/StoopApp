from flask import Flask, request, jsonify
from dotenv import load_dotenv

import os

load_dotenv()

app = Flask(__name__, static_folder='../client/build/', static_url_path='/')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/settings', methods=["GET"])
def getSettings():
    if request.method == "GET":
        settingNames = ["Setting1", "Setting2", "Setting3", "Setting4"]
        return jsonify(names=settingNames)

if __name__ == '__main__':
    app.run(port=(os.getenv('PORT') if os.getenv('PORT') else 8000), debug=False)