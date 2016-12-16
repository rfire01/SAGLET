from __future__ import print_function

import struct

from critialAnalyze.DictAnalyze import DictAnalyzer
from critialAnalyze.tfidfAnalyze import TFIDFAnalyzer
from critialAnalyze.similarityAnalyze import SimAnalyzer
import pandas as pd

app_signs = open("Dictionaries\\AppTerms.txt", 'r', encoding="utf8").read().split('\n')
answers_file = pd.read_excel("Dictionaries\\Answers.xlsx")

tasks = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י"]
subtasks = range(1, 10)
rooms = {}
da = DictAnalyzer()
tfa = TFIDFAnalyzer()
sa = SimAnalyzer()


def check_for_request():
    try:
        f = open(r'\\.\pipe\cpPipe', 'r+b', 0)

        n = struct.unpack('I', f.read(4))[0]  # Read str length
        s = f.read(n)  # Read str
        f.seek(0)  # Important!!!
        # print(s.decode('utf-8'))

        request = s.decode('utf-8').split(';')
        room_id = request[0]
        message = request[1]
        try:
            response = handle_request(room_id, message)
        except Exception as e:
            print(str(e))
            return
        print(response)

        f.write(struct.pack('I', len(s)) + response.encode())  # Write str length and str
        f.seek(0)
        f.close()
    except:
        pass


def get_solutions(room_id, task, subtask=None):
    try:
        answers = rooms[room_id]['solutions']
        answers = answers.loc[answers['task'] == task]
        if subtask:
            answers = answers.loc[answers['subtask'] == subtask]
        solutions = answers.solutions.values[0].split(',')
    except:
        solutions = []
    return solutions


def check_solution(room_id, message):
    if "התשובה הסופית למשימה" not in message:
        return 3

    # get task id
    task = None
    for t in tasks:
        s = "משימה " + t
        if s in message:
            task = t
            break

    if task:
        # get subtask id, if any
        subtask = None
        for st in subtasks:
            s = "סעיף " + str(st)
            if s in message:
                subtask = st
                break

        for solution in get_solutions(room_id, task, subtask):
            if solution in message:
                return 1
    return 0


def handle_request(room_id, message):
    if room_id not in rooms:
        rooms[room_id] = {}
        rooms[room_id]['context'] = 'NaN'
        rooms[room_id]['solutions'] = answers_file.loc[answers_file['room'] == int(room_id)]

    app_word = False
    for word in app_signs:
        if word in message.lower():
            app_word = True
    if app_word:
        return 'NaN,0'

    code = check_solution(room_id, message)
    if code != 3:
        return "DS," + str(code)

    context = rooms[room_id]['context']
    da_tag, da_code = da.get_tag(message, context)
    tfa_tag, _ = tfa.get_tag(message)
    sim_tag, _ = sa.get_tag(message, context, 2)

    ds_count = sum([1 for tag in [da_tag, tfa_tag, sim_tag] if tag == 'DS'])
    tec_count = sum([1 for tag in [da_tag, tfa_tag, sim_tag] if tag == 'TEC'])
    nmd_count = sum([1 for tag in [da_tag, tfa_tag] if tag == 'NMD'])

    if da_tag == "TEC" and da_code >= 10:
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
    while True:
        check_for_request()
