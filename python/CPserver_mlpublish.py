from __future__ import print_function
from critialAnalyze.DictAnalyze import DictAnalyzer
from critialAnalyze.tfidfAnalyze import TFIDFAnalyzer
from critialAnalyze.similarityAnalyze import SimAnalyzer
from critialAnalyze.answerAnalyze import check_solution, init_room_solutions
from sklearn.externals import joblib
from sklearn.ensemble import RandomForestClassifier
import numpy as np
import socket

app_signs = open("Dictionaries\\AppTerms.txt", 'r', encoding="utf8").read().split('\n')
dt = None
lb = {
    'NMD': 10,
    'TEC': 11,
    'DS': 12,
    'NaN': 0
}  # Convert label to number
decode = {
    '10': 'NMD',
    '11': 'TEC',
    '12': 'DS',
    '0': 'NaN'
}  # Convert number to label

rooms = {}
da = DictAnalyzer()
tfa = TFIDFAnalyzer()
sa = SimAnalyzer()
BUFF_SIZE = 64


def contains_app_terms(message):
    for word in app_signs:
        if word in message.lower():
            return True
    return False


def check_for_request():
    while True:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind(('127.0.0.1', 5998))
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
            response = dt_predict(request[0], request[1])
            print("received:", request[1])
            print("response:", response)
        except Exception as e:
            print(str(e))
            return

        # send the response
        conn.send(bytearray(response, 'utf-8'))
        conn.close()


def dt_predict(room_id, message):
    if room_id not in rooms:
        rooms[room_id] = {}
        rooms[room_id]['context_features'] = [0] * 12
        init_room_solutions(room_id)

    if contains_app_terms(message) or len(message) == 0:
        return 'NaN,0'

    code = check_solution(room_id, message)
    if code != 3:
        return "DS," + str(code)

    context_features = rooms[room_id]['context_features']
    da_tag, da_counts = da.get_tag_with_counts(message)  # dict tags and dict count
    tfa_tag = tfa.get_tag(message)  # tfidf tag
    sim_tag = sa.get_tag(message, metric=2)  # sim tag
    tec_cs, tec_cat, tec_ng, ds_cs, ds_cat, ds_ng = sa.get_results(message)  # sim results

    features = [lb[da_tag], lb[tfa_tag], lb[sim_tag], da_counts[0], da_counts[1], da_counts[2],
                tec_cs, tec_cat, tec_ng, ds_cs, ds_cat, ds_ng]

    x = np.array(features + context_features).reshape(1, -1)
    tag = decode[str(dt.predict(x).tolist()[0])]

    rooms[room_id]['context_features'] = features
    return tag + "," + str(code)


if __name__ == '__main__':
    dt = joblib.load('rf_20170103.pkl')
    print("Model Loaded.")
    check_for_request()
