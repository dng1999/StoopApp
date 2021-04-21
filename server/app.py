from flask import Flask, request, jsonify, app
from dotenv import load_dotenv
import pyrebase
from flask_cors import CORS
#import firebase_admin

import os

load_dotenv()

app = Flask(__name__, static_folder='../client/build/', static_url_path='/')
CORS(app)

config =  {
    "apiKey": "AIzaSyAKI_uzcRjjZR1NlIMGKRAVuZzFsdMoBaY",
    "authDomain": "stoopapp.firebaseapp.com",
    "storageBucket": "stoopapp.appspot.com",
    "projectId": "stoopapp",
    "messagingSenderId": "106319723351",
    "appId": "1:106319723351:web:f41f6aa9ae45f3cca55c12",
    "measurementId": "G-G7JLT7GW55",
    "databaseURL": "https://stoopapp-default-rtdb.firebaseio.com",
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    try:
        response = auth.sign_in_with_email_and_password(email, password)
        return jsonify(response), 201
    except Exception as e:
        message = "Please check your credentials"
        print(message)
        return False


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    response = auth.create_user_with_email_and_password(email, password)
    return jsonify(response), 201


@app.route('/settings', methods=['GET', 'POST'])
def get_settings():
    setting_names = ['Listing Alerts']
    if request.method == 'GET':
        #Get settings from database and send to frontend if key in setting_names
        #User id should be in session var or smth
        #user_prefs = db.reference('/Users/' + str(user.uid) + '/Settings').get()
        setting_vals = {}
        #for key, value in user_prefs.items():
        #    if key in setting_names:
        #       setting_vals[key] = value
        #   else:
        #       setting_vals[key] = '0'
        setting_vals = {'Listing Alerts' : '0'}
        return jsonify(values=setting_vals)
    elif request.method == 'POST':
        #if key is in setting_names, update
        return jsonify(message="Got it!")


if __name__ == '__main__':
    app.run(port=(os.getenv('PORT') if os.getenv('PORT') else 8000), debug=False)