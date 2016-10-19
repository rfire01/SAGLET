from __future__ import print_function

import struct

from critialAnalyze.DictAnalyze import DictAnalyzer
from critialAnalyze.tfidfAnalyze import TFIDFAnalyzer
from critialAnalyze.similarityAnalyze import SimAnalyzer

app_signs = open("Dictionaries\\AppTerms.txt", 'r', encoding="utf8").read().split('\n')

rooms = {}
da = DictAnalyzer()
tfa = TFIDFAnalyzer()
sa = SimAnalyzer()

def checkForRequest():
    try:
        f = open(r'\\.\pipe\cpPipe', 'r+b', 0)

        n = struct.unpack('I', f.read(4))[0]  # Read str length
        s = f.read(n)  # Read str
        f.seek(0)  # Important!!!
        print(s.decode('utf-8'))

        request = s.decode('utf-8').split(';')
        roomID = request[0]
        message = request[1]
        solution = request[2]
        try:
            response = handleRequest(roomID,message,solution)
        except Exception as e:
            print(str(e))
            return
        print(response)

        f.write(struct.pack('I', len(s)) + response.encode())  # Write str length and str
        f.seek(0)

        f.close()
    except:
        pass

def handleRequest(roomID,message,solution):
    if not roomID in rooms:
        rooms[roomID] = {}
        # rooms[roomID]['answer'] = ''
        rooms[roomID]['context'] = 'NaN'

    appWord = False
    for word in app_signs:
        if word in message.lower():
            appWord = True
    if appWord:
        return 'NaN,0'

    context = rooms[roomID]['context']
    group = da.check_group(solution)
    da_tag,da_code = da.get_tag(message, context, [solution, group])
    tfa_tag,tfa_code = tfa.get_tag(message, [solution, group])
    sim_tag,sim_code = sa.get_tag(message,context,2)

    ds_count = sum([1 for tag in [da_tag, tfa_tag, sim_tag] if tag == 'DS'])
    tec_count = sum([1 for tag in [da_tag, tfa_tag, sim_tag] if tag == 'TEC'])
    nmd_count = sum([1 for tag in [da_tag, tfa_tag] if tag == 'NMD'])

    if ds_count >= nmd_count:
        if ds_count >= tec_count:
            tag = 'DS'
        else:
            tag = 'TEC'
    else:
        if nmd_count >= tec_count:
            tag = 'NMD'
        else:
            tag = 'TEC'
    if ds_count <= 1 and tec_count <= 1 and nmd_count <= 1:
        tag = 'NMD'
    if da_tag == 'NaN':
        tag = sim_tag

    if da_code == 3:
        code = tfa_code
    else:
        code = da_code

    rooms[roomID]['context'] = tag
    return (tag + "," + str(code))


if __name__ == '__main__':
    while True:
        checkForRequest()