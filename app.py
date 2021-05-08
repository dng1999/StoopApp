from flask import Flask, request, jsonify, app, session
from flask_cors import CORS
from flask_session import Session
from flask_socketio import SocketIO, emit
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
socketio = SocketIO(app)
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

@socketio.on('set_taken')
def takenListener(json_data):
    emit('echo', {'echo': 'The following listing has been taken: '}) #test
    return "nothing to see here"
    if session['lalert'] == "On":
        sub_list = db.child('users').child(session.get('uid')).child('subscriptions').get(session.get('token')).val()
        for sub in sub_list:
            #If there's an update in one of the user's subscriptions
            if sub == json_data['listingID']:
                #Check if sub was on and listing was taken
                if sub_list[sub] == "On":
                    db.child('users').child(session.get('uid')).child('subscriptions').update({sub: "Off"},session.get('token'))
                    emit('echo', {'echo': 'The following listing has been taken: '+sub})

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
        session['lalert'] = db.child('users').child(session.get('uid')).child('settings').child('Listing Alerts').get(session.get('token')).val()
        return jsonify(response), 201
    except Exception as e:
        message = "Please check your credentials."
        print(message)
        return jsonify(message), 401

@app.route("/api/logout", methods=["POST"])
def logout():
    try:
        for key in list(session.keys()):
            session.pop(key)
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
    #Check if db path exists
    if not db.child('users').child(session.get('uid')).child('settings').shallow().get(session.get('token')).val():
        db.child('users').child(session.get('uid')).child('settings').set({'Listing Alerts': 'Off'}, session.get('token'))

    #Get settings from database and send to frontend
    if request.method == 'GET':
        user_prefs = db.child('users').child(session.get('uid')).child('settings').get(session.get('token')).val()
        setting_vals = {}
        #Get settings from database and ignore any misc settings
        for key in user_prefs:
            value = user_prefs[key]
            if key in setting_names:
                setting_vals[key] = value
                setting_names.remove(key)
        #Check if any settings not in the database and add them
        for item in setting_names:
            setting_vals[item] = 'Off'
            db.child('users').child(session.get('uid')).child('settings').set({item: 'Off'}, session.get('token'))
        return jsonify(values=setting_vals)

    #Update settings in database
    elif request.method == 'POST':
        data = request.get_json()
        name = data["settingName"]
        value = data["settingValue"]
        session['lalert'] = value
        db.child('users').child(session.get('uid')).child('settings').update({name: value}, session.get('token'))
        return jsonify(message="Got it!")

@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=False, port=int(os.environ.get("PORT", 5000)))