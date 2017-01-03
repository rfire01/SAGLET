import math
import os
import re
from textblob import TextBlob as tb
from textblob import Word


class TFIDFAnalyzer:
    def __init__(self):
        self.PlurarShapes = open('Dictionaries\\PlurarShape.txt', 'r', encoding="utf8").read().split('\n')
        self.Shapes = open('Dictionaries\\ShapesTerms.txt', 'r', encoding="utf8").read().split('\n')
        self.geo = open('Dictionaries\\GeometryTerms.txt', 'r', encoding="utf8").read().split('\n')
        self.claim = open('Dictionaries\\ClaimTerms.txt', 'r', encoding="utf8").read().split('\n')
        self.conclusion = open('Dictionaries\\ConclusionTerms.txt', 'r', encoding="utf8").read().split('\n')
        self.structure = open('Dictionaries\\TaskStructure.txt', 'r', encoding="utf8").read().split('\n')
        self.software = open('Dictionaries\\SoftwareUsage.txt', 'r', encoding="utf8").read().split('\n')
        self.nonMath = open('Dictionaries\\NMDTerms.txt', 'r', encoding="utf8").read().split('\n')
        self.tech = open('Dictionaries\\TechTerms.txt', 'r', encoding="utf8").read().split('\n')
        self.shorts = open('Dictionaries\\ShortTerms.txt', 'r', encoding="utf8").read().split('\n')

        # load data #
        self.bloblist = []
        for filename in os.listdir(os.getcwd()+"\\tfidfTexts"):
            self.bloblist.append(tb(open("tfidfTexts\\"+filename, 'r').read()))

    def __tf__(self, word, blob, size):
        if size == 1:
            return blob.words.count(word) / len(blob.words)
        else:
            return str(blob).count(word) / (len(blob.words)-1)

    def __n_containing__(self, word, bloblist, size):
        if size == 1:
            return sum(1 for blob in bloblist if word in blob.words)
        else:
            return sum(1 for blob in bloblist if word in blob)

    def __idf__(self, word, bloblist, size):
        return math.log(len(bloblist) / (1 + self.__n_containing__(word, bloblist, size)))

    def __tfidf__(self, word, blob, bloblist, size):
        return self.__tf__(word, blob, size) * self.__idf__(word, bloblist, size)

    def __check_two_words(self, word, sentence):
        two_word = len(re.findall(r'\w+', sentence)) > 1
        if two_word:
            if len(re.findall(r'\w+', word)) > 1:
                return 1
            else:
                return 0
        else:
            return 1

    def __ds_check__(self, sentence):
        for word in self.PlurarShapes:
            if word in sentence:
                return self.__check_two_words(word, sentence)
        for word in self.Shapes:
            if word in sentence:
                return self.__check_two_words(word, sentence)
        for word in self.geo:
            if word in sentence:
                return self.__check_two_words(word, sentence)
        for word in self.claim:
            if word in sentence:
                return self.__check_two_words(word, sentence)
        for word in self.conclusion:
            if word in sentence:
                return self.__check_two_words(word, sentence)
        for word in self.structure:
            if word in sentence:
                return self.__check_two_words(word, sentence)
        for word in self.software:
            if word in sentence:
                return self.__check_two_words(word, sentence)
        return 0

    def __nmd_check__(self, sentence):
        for word in self.nonMath:
            if word in sentence:
                return self.__check_two_words(word, sentence)
        return 0

    def __tec_check__(self, sentence):
        for word in self.tech:
            if word in sentence:
                return self.__check_two_words(word, sentence)
        return 0

    def __get_word_tag__(self, word):
        if self.__ds_check__(word) == 1:
            return 'DS'
        elif self.__nmd_check__(word) == 1:
            return 'NMD'
        elif self.__tec_check__(word) == 1:
            return 'TEC'
        else:
            return 'NaN'

    def get_tag(self, sentence):
        blob = tb(sentence)
        self.bloblist.append(blob)
        blob_list = self.bloblist[:]
        # blobList.append(blob)
        single_words = blob.words
        pairs = [Word(single_words[i]+' '+single_words[i+1]) for i in range(len(single_words)-1)]
        scores_pairs = {word: self.__tfidf__(word, blob, blob_list, 2) for word in pairs}
        sorted_words_pairs = sorted(scores_pairs.items(), key=lambda x: x[1], reverse=True)
        scores_single = {word: self.__tfidf__(word, blob, blob_list, 1) for word in blob.words}
        sorted_words_single = sorted(scores_single.items(), key=lambda x: x[1], reverse=True)
        # sorted_words = sorted(sorted_words_pairs + sorted_words_single, key=lambda x: x[1], reverse=True)

        ds = 0
        nmd = 0
        tec = 0
        for i, word in enumerate(sorted_words_single):
            ds += self.__ds_check__(word[0]) * word[1]
            nmd += self.__nmd_check__(word[0]) * word[1]
            tec += self.__tec_check__(word[0]) * word[1]
        for i, word in enumerate(sorted_words_pairs):
            ds += self.__ds_check__(word[0]) * word[1]
            nmd += self.__nmd_check__(word[0]) * word[1]
            tec += self.__tec_check__(word[0]) * word[1]

        if tec == 0 and nmd == 0 and ds == 0:
            return 'NaN'
        if ds > nmd:
            if ds > tec:
                return 'DS'
            else:
                return 'TEC'
        else:
            if nmd > tec:
                return 'NMD'
            else:
                return 'TEC'

    def get_tfidf_values(self, sentence):
        blob = tb(sentence)
        self.bloblist.append(blob)
        blob_list = self.bloblist[:]
        # blobList.append(blob)
        single_words = blob.words
        pairs = [Word(single_words[i] + ' ' + single_words[i + 1]) for i in range(len(single_words) - 1)]
        scores_pairs = {word: self.__tfidf__(word, blob, blob_list, 2) for word in pairs}
        sorted_words_pairs = sorted(scores_pairs.items(), key=lambda x: x[1], reverse=True)
        scores_single = {word: self.__tfidf__(word, blob, blob_list, 1) for word in blob.words}
        sorted_words_single = sorted(scores_single.items(), key=lambda x: x[1], reverse=True)
        # sorted_words = sorted(sorted_words_pairs + sorted_words_single, key=lambda x: x[1], reverse=True)

        ds = 0
        nmd = 0
        tec = 0
        for i, word in enumerate(sorted_words_single):
            ds += self.__ds_check__(word[0]) * word[1]
            nmd += self.__nmd_check__(word[0]) * word[1]
            tec += self.__tec_check__(word[0]) * word[1]
        for i, word in enumerate(sorted_words_pairs):
            ds += self.__ds_check__(word[0]) * word[1]
            nmd += self.__nmd_check__(word[0]) * word[1]
            tec += self.__tec_check__(word[0]) * word[1]

        return [ds, nmd, tec]
