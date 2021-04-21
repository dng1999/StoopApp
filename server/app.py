from flask import Flask, request, jsonify
from dotenv import load_dotenv
#import firebase_admin

import os

load_dotenv()

app = Flask(__name__, static_folder='../client/build/', static_url_path='/')

@app.route('/')
def index():
    return app.send_static_file('index.html')

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