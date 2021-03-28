from flask import Flask, render_template
from dotenv import load_dotenvimport os

load_dotenv()# Set up the app

app = Flask(__name__, template_folder='../client/public')

def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(port=(os.getenv('PORT') if os.getenv('PORT') else 8000), debug=False)