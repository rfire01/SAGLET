import pandas as pd
import numpy as np

answers_file = pd.read_excel("Dictionaries\\Answers.xlsx")
answer_terms = ('התשובה הסופית', 'תשובתנו הסופית', 'תשובתינו הסופית',
                'התשובות הסופיות', 'תשובותנו הסופיות', 'תשובותינו הסופיות')
task_terms = ('מטלה ', 'משימה ', 'שאלה ', 'תרגיל ',
              'מטלה:', 'משימה:', 'שאלה:', 'תרגיל:',
              'מטלה: ', 'משימה: ', 'שאלה: ', 'תרגיל: ',
              'מטלה : ', 'משימה : ', 'שאלה : ', 'תרגיל : ',
              'מטלה :', 'משימה :', 'שאלה :', 'תרגיל :',
              'מטלה-', 'משימה-', 'שאלה-', 'תרגיל-',
              'מטלה- ', 'משימה- ', 'שאלה- ', 'תרגיל- ',
              'מטלה - ', 'משימה - ', 'שאלה - ', 'תרגיל - ',
              'מטלה -', 'משימה -', 'שאלה -', 'תרגיל -')
subtask_terms = ('סעיף ', 'סעיף:', 'סעיף: ', 'סעיף :', 'סעיף : ', 'סעיף-', 'סעיף- ', 'סעיף -', 'סעיף - ')
tasks_ids = ("א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י") + tuple([str(i) for i in range(0, 10)])
room_answers = {}


def init_room_solutions(room_id):
    room_answers[room_id] = answers_file.loc[answers_file['room'] == int(room_id)]


def get_solutions(room_id, task, subtask=None):
    try:
        answers = room_answers[room_id]
        answers = answers.loc[answers['task'] == task]
        if subtask:
            answers = answers.loc[answers['subtask'] == subtask]
        if subtask is None and np.nan not in answers.subtask.unique().tolist():
            solutions = []
        else:
            solutions = answers.solutions.values[0].split(',')
    except:
        solutions = []
    return solutions


def check_solution(room_id, message):
    sol = False
    for ans_term in answer_terms:
        if ans_term in message:
            sol = True
            break
    if not sol:
        return 3

    # get task id
    task = None
    for t in task_terms:
        for tid in tasks_ids:
            s = t + tid
            if s in message:
                task = tid
                break

    if task:
        # get subtask id, if any
        subtask = None
        for subtask_term in subtask_terms:
            for tid in tasks_ids:
                s = subtask_term + tid
                if s in message:
                    subtask = tid
                    break

        for solution in get_solutions(room_id, task, subtask):
            if solution in message:
                return 1
    return 0
