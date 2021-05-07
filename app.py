from flask import Flask, request, jsonify, app, session
from flask_cors import CORS
from flask_session import Session
from dotenv import load_dotenv
import pyrebase
import os
import redis

load_dotenv()

app = Flask(__name__, static_folder='build/', static_url_path='/')
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_REDIS'] = redis.from_url(os.environ['REDISTOGO_URL'])
Session(app)
CORS(app)

firebaseConfig =  {
    "apiKey": os.environ['FB_APIKEY'],
    "authDomain": os.environ['FB_AUTHDOMAIN'],
    "storageBucket": os.environ['FB_STORAGEBUCKET'],
    "projectId": os.environ['FB_PROJID'],
    "messagingSenderId": os.environ['FB_MSGSENDRID'],
    "appId": os.environ['FB_APPID'],
    "measurementId": os.environ['FB_MEASUREID'],
    "databaseURL": os.environ['FB_DBURL']
}

firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()
db = firebase.database()

@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    try:
        response = auth.sign_in_with_email_and_password(email, password)
        response = auth.refresh(response['refreshToken'])
        session['token'] = response['idToken']
        session['uid'] = response['userId']
        return jsonify(response), 201
    except Exception as e:
        message = "Please check your credentials."
        print(message)
        return jsonify(message), 401

@app.route("/api/logout", methods=["POST"])
def logout():
    try:
        session.pop('uid', None)
        session.pop('token', None)
        return jsonify("Logged out"), 201
    except Exception as e:
        message = "User not logged in"
        print(message)
        return jsonify(message), 401


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    response = auth.create_user_with_email_and_password(email, password)
    return jsonify(response), 201


@app.route('/api/settings', methods=['GET', 'POST'])
def get_settings():
    setting_names = ['Listing Alerts']
    #User id should be in session var
    user_prefs = db.child('users').child(session.get('uid')).child('settings')
    #Check if db path exists
    if not user.shallow().get(session.get('token')).val():
        user_prefs.set({'Listing Alerts': 'Off'}, session['token'])

    #Get settings from database and send to frontend
    if request.method == 'GET':
        setting_vals = {}
        #Get settings from database and ignore any misc settings
        for key, value in user_prefs.each():
            if key in setting_names:
                setting_vals[key] = value
                setting_names.remove(key)
        #Check if any settings not in the database and add them
        for item in setting_names:
            setting_vals[item] = 'Off'
            user_prefs.set({item: 'Off'}, session['token'])
        return jsonify(values=setting_vals)

    #Update settings in database
    elif request.method == 'POST':
        data = request.get_json()
        name = data["settingName"]
        value = data["settingValue"]
        user_prefs.update({name: value}, session['token'])
        return jsonify(message="Got it!")

@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=int(os.environ.get("PORT", 5000)))