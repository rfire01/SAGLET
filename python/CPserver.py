from __future__ import print_function

import socket

from critialAnalyze.DictAnalyze import DictAnalyzer
from critialAnalyze.tfidfAnalyze import TFIDFAnalyzer
from critialAnalyze.similarityAnalyze import SimAnalyzer
from critialAnalyze.answerAnalyze import check_solution, init_room_solutions

app_signs = open("Dictionaries\\AppTerms.txt", 'r', encoding="utf8").read().split('\n')

rooms = {}
da = DictAnalyzer()
tfa = TFIDFAnalyzer()
sa = SimAnalyzer()
BUFF_SIZE = 64


def check_for_request():
    while True:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind(('127.0.0.1', 5999))
        s.listen(1)
        # wait for a message
        conn, addr = s.accept()

        # read message
        data = bytearray('', 'utf-8')
        while True:
            part = conn.recv(BUFF_SIZE)
            data += part
            if len(part) < BUFF_SIZE:
                break

        # tag message
        try:
            request = str(data, 'utf-8').split(';')
            response = handle_request(request[0], request[1])
            print("received:", request[1])
            print("response:", response)
        except Exception as e:
            print(str(e))
            return

        # send the response
        conn.send(bytearray(response, 'utf-8'))
        conn.close()


def handle_request(room_id, message):
    if room_id not in rooms:
        rooms[room_id] = {}
        rooms[room_id]['context'] = 'NaN'
        init_room_solutions(room_id)

    for word in app_signs:
        if word in message.lower():
            return 'NaN,0'

    code = check_solution(room_id, message)
    if code != 3:
        return "DS," + str(code)

    context = rooms[room_id]['context']
    da_tag = da.get_tag(message, context)
    tfa_tag = tfa.get_tag(message)
    sim_tag = sa.get_tag(message, context, 2)

    ds_count = sum([1 for tag in [da_tag, tfa_tag, sim_tag] if tag == 'DS'])
    tec_count = sum([1 for tag in [da_tag, tfa_tag, sim_tag] if tag == 'TEC'])
    nmd_count = sum([1 for tag in [da_tag, tfa_tag] if tag == 'NMD'])

    if da_tag == "TEC10":
        tag = "TEC"
    elif tfa_tag == 'NaN' or da_tag == 'NaN':
        if da_tag != 'NaN':
            tag = da_tag
        elif tfa_tag != 'NaN':
            tag = tfa_tag
        else:
            tag = sim_tag
    elif ds_count <= 1 and tec_count <= 1 and nmd_count <= 1:
        tag = 'NMD'
    elif ds_count >= nmd_count:
        if tec_count >= ds_count:
            tag = 'TEC'
        else:
            tag = 'DS'
    else:
        if tec_count >= nmd_count:
            tag = 'TEC'
        else:
            tag = 'NMD'

    rooms[room_id]['context'] = tag
    return tag + "," + str(code)


if __name__ == '__main__':
    check_for_request()
