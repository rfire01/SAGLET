from __future__ import print_function

# import time
import zmq

from DictAnalyze import DictAnalyzer
from tfidfAnalyze import TFIDFAnalyzer

app_signs = open("Dictionaries\\AppTerms.txt", 'r', encoding="utf8").read().split('\n')

rooms = {}
da = DictAnalyzer()
tfa = TFIDFAnalyzer()
context = 'NaN'

context = zmq.Context(1)
server = context.socket(zmq.REP)
server.bind("tcp://*:5555")

while True:
    request = server.recv().decode()

    req = request.split("\t")
    if req[0]=="open" and len(req)>2:
        rooms[req[1]] = req[2]
        response = "ok"
    elif req[0]=="input" and len(req)>2:
        roomID = req[1]
        message = req[2]
        if not roomID in rooms:
            rooms[roomID] = ''

        appWord = False
        for word in app_signs:
            if word in message.lower():
                appWord = True
        if appWord:
            response = 'NaN,0'

        group = da.check_group(rooms[roomID])
        da_tag = da.get_tag(message, context, [rooms[roomID], group])
        tfa_tag = tfa.get_tag(message, [rooms[roomID], group])
        if tfa_tag[0] != 'NaN':
            tag = tfa_tag
        else:
            tag = da_tag
        context = tag
        response = (tag[0] + "," + str(tag[1]))
    else:
        response = "illegal request"
    # time.sleep(1) # Do some heavy work - check for cp
    server.send(response.encode())

server.close()
context.term()
