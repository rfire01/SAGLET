from critialAnalyze import cosineSim as cs,cataly
import ngram

class SimAnalyzer:
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
        self.context = open('Dictionaries\\ContextTerms.txt', 'r', encoding="utf8").read().split('\n')
        self.stopWords = open('Dictionaries\\StopWords.txt', 'r', encoding="utf8").read().split('\n')

        self.tecSentences = open('simSentences\\tec.txt', 'r', encoding="utf8").read().split('\n')
        self.dsSentences = open('simSentences\\ds.txt', 'r', encoding="utf8").read().split('\n')
        self.gTec = ngram.NGram(self.tecSentences)
        self.gDs = ngram.NGram(self.dsSentences)

    def __ds_count__(self,sentence,context):
        count = 0
        for word in self.PlurarShapes:
            if word in sentence:
                count = count + 1
        for word in self.Shapes:
            if word in sentence:
                count = count + 1
        for word in self.geo:
            if word in sentence:
                count = count + 1
        for word in self.claim:
            if word in sentence:
                count = count + 1
        for word in self.conclusion:
            if word in sentence:
                count = count + 1
        for word in self.structure:
            if word in sentence:
                count = count + 1
        for word in self.software:
            if word in sentence:
                count = count + 1
        if self.__if_then_statment__(sentence) > 0:
            count = count + 1
        if context == 'DS':
            for word in self.context:
                if word in sentence:
                    count = count + 1
        return [count,3]

    def __nmd_count__(self, sentence):
        count = 0
        for word in self.nonMath:
            if word in sentence:
                count = count + 1
        for word in self.shorts:
            if len(sentence) <= 10 and word in sentence:
                count = count + 1
        return count

    def __tec_count__(self,sentence):
        count = 0
        for word in self.tech:
            if word in sentence:
                count = count + 1
        return count

    def __if_then_statment__(self, sentence):
        conclusionSplit = sentence.split('אם')
        for i in range(len(conclusionSplit)):
            if i > 0:
                if 'אז' in conclusionSplit[i]:
                    return 1
        return 0

    def get_tag(self,sentence,context,metric=1):

        sentence = self.remove_stop(sentence)
        sim1 = [cs.get_cosine(sentence, self.remove_stop(sen)) for sen in self.tecSentences]
        try:
            sim2 = [cataly.string_similarity(sentence, self.remove_stop(sen)) for sen in self.tecSentences]
        except:
            sim2 = [0]
        sim3 = [value[1] for value in self.gTec.search(sentence)]

        sim1ds = [cs.get_cosine(sentence, self.remove_stop(sen)) for sen in self.dsSentences]
        try:
            sim2ds = [cataly.string_similarity(sentence, self.remove_stop(sen)) for sen in self.dsSentences]
        except:
            sim2ds = [0]
        sim3ds = [value[1] for value in self.gTec.search(sentence)]

        sim1.sort(reverse=True)
        sim2.sort(reverse=True)
        sim3.sort(reverse=True)

        sim1ds.sort(reverse=True)
        sim2ds.sort(reverse=True)
        sim3ds.sort(reverse=True)

        if len(sim3)==0:
            sim3.append(0)
        if len(sim3ds)==0:
            sim3ds.append(0)

        ds_amount,code = self.__ds_count__(sentence,context)
        tec_amount = self.__tec_count__(sentence)
        if metric == 1:
            tecWeight = (sim1[0] * sim2[0] * sim3[0]) **(1./3.)
            dsWeight = (sim1ds[0] * sim2ds[0] * sim3ds[0]) **(1./3.)

            ds = ds_amount * dsWeight
            tec = tec_amount * tecWeight
        else: #metric == 2
            count = [1 for val in [[sim1[0], sim1ds[0]], [sim2[0], sim2ds[0]], [sim3[0], sim3ds[0]]] if val[0] > val[1]]


        if sim1[0] * sim2[0] * sim3[0] == 0 and sim1ds[0] * sim2ds[0] * sim3ds[0] == 0:
            return 'NMD',0
        if metric == 1:
            if ds >= tec:
                return 'DS',3
            else:
                return 'TEC',3
        else:
            if sum(count) <= 1:
                return 'DS', 3
            else:
                return 'TEC', 3

    def remove_stop(self, sentence):
        words = sentence.split(' ')
        for stop in self.stopWords:
            if stop in words:
                words.remove(stop)
        return " ".join(words)