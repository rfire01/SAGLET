from flask import Flask, render_template, request
from DictAnalyze import DictAnalyzer
from tfidfAnalyze import TFIDFAnalyzer

app = Flask(__name__)

app_signs = open('Dictionaries\\AppTerms.txt', 'r', encoding="utf8").read().split('\n')

rooms = {}
da = DictAnalyzer()
tfa = TFIDFAnalyzer()
context = 'NaN'

@app.route('/')
def index():
    return "template"

@app.route('/open')
def openRoom():
    if 'roomID' in request.args and 'answer' in request.args:
        roomID = request.args.get('roomID')
        answer = request.args.get('answer')
        rooms[roomID] = answer
        return "ok"
    else:
        return "not all parameters receievd"


@app.route('/input')
def render():
    if 'roomID' in request.args and 'userID' in request.args and 'message' in request.args:
        roomID = request.args.get('roomID')
        userID = request.args.get('userID')
        message = request.args.get('message')
        if not roomID in rooms:
            rooms[roomID]=''

        appWord = False
        for word in app_signs:
            if word in message.lower():
                appWord = True
        if appWord:
            return 'NaN,0'

        global context
        group = da.check_group(rooms[roomID])
        da_tag = da.get_tag(message,context,[rooms[roomID],group])
        tfa_tag = tfa.get_tag(message,[rooms[roomID],group])
        if tfa_tag[0] != 'NaN':
            tag = tfa_tag
        else:
            tag = da_tag
        context = tag
        return (tag[0]+","+str(tag[1]))
    else:
        return "not all parameters receievd"


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1')