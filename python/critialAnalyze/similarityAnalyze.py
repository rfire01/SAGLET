from critialAnalyze import cosineSim as cs, cataly
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
        self.negTech = open('Dictionaries\\NegativeTechTerms.txt', 'r', encoding="utf8").read().split('\n')
        self.shorts = open('Dictionaries\\ShortTerms.txt', 'r', encoding="utf8").read().split('\n')
        self.context = open('Dictionaries\\ContextTerms.txt', 'r', encoding="utf8").read().split('\n')
        self.stopWords = open('Dictionaries\\StopWords.txt', 'r', encoding="utf8").read().split('\n')

        self.tecSentences = open('simSentences\\tec.txt', 'r', encoding="utf8").read().split('\n')
        self.dsSentences = open('simSentences\\ds.txt', 'r', encoding="utf8").read().split('\n')
        self.gTec = ngram.NGram(self.tecSentences)
        self.gDs = ngram.NGram(self.dsSentences)

    def __ds_count__(self, sentence, context):
        count = 0
        for word in self.PlurarShapes:
            if word in sentence:
                count += 1
        for word in self.Shapes:
            if word in sentence:
                count += 1
        for word in self.geo:
            if word in sentence:
                count += 1
        for word in self.claim:
            if word in sentence:
                count += 1
        for word in self.conclusion:
            if word in sentence:
                count += 1
        for word in self.structure:
            if word in sentence:
                count += 1
        for word in self.software:
            if word in sentence:
                count += 1
        if self.__if_then_statment__(sentence) > 0:
            count += 1
        if context == 'DS':
            for word in self.context:
                if word in sentence:
                    count += 1
        return count

    def __nmd_count__(self, sentence):
        count = 0
        for word in self.nonMath:
            if word in sentence:
                count += 1
        for word in self.shorts:
            if len(sentence) <= 10 and word in sentence:
                count += 1
        return count

    def __tec_count__(self, sentence):
        count = 0
        for word in self.tech:
            if word in sentence:
                count += 1
        return count

    def __if_then_statment__(self, sentence):
        conclusion_split = sentence.split('אם')
        for i in range(len(conclusion_split)):
            if i > 0:
                if 'אז' in conclusion_split[i]:
                    return 1
        return 0

    def get_tag(self, sentence, context, metric=1):
        tec_cs, tec_cat, tec_ng, ds_cs, ds_cat, ds_ng = self.get_results(sentence)

        ds_amount = self.__ds_count__(sentence, context)
        tec_amount = self.__tec_count__(sentence)

        if tec_cs[0] * tec_cat[0] * tec_ng[0] == 0 and ds_cs[0] * ds_cat[0] * ds_ng[0] == 0:
            return 'NMD'

        if metric == 1:
            tec_weight = float(tec_cs[0] * tec_cat[0] * tec_ng[0]) ** (1./3.)
            ds_weight = float(ds_cs[0] * ds_cat[0] * ds_ng[0]) ** (1./3.)

            ds = ds_amount * ds_weight
            tec = tec_amount * tec_weight

            if ds >= tec:
                return 'DS'
            else:
                return 'TEC'
        else:  # metric == 2
            count = [1 for val in [[tec_cs[0], ds_cs[0]], [tec_cat[0], ds_cat[0]], [tec_ng[0], ds_ng[0]]] if val[0] > val[1]]

            if sum(count) <= 1:
                return 'DS'
            else:
                return 'TEC'

    def get_results(self, sentence):
        sentence = self.remove_stop(sentence)

        # tec similarities
        try:
            tec_cat = [cataly.string_similarity(sentence, self.remove_stop(sen)) for sen in self.tecSentences]
        except:
            tec_cat = [0]
        tec_cs = [cs.get_cosine(sentence, self.remove_stop(sen)) for sen in self.tecSentences]
        tec_ng = [value[1] for value in self.gTec.search(sentence)]
        tec_ng = [0] if len(tec_ng) == 0 else tec_ng

        # ds similarities
        try:
            ds_cat = [cataly.string_similarity(sentence, self.remove_stop(sen)) for sen in self.dsSentences]
        except:
            ds_cat = [0]
        ds_cs = [cs.get_cosine(sentence, self.remove_stop(sen)) for sen in self.dsSentences]
        ds_ng = [value[1] for value in self.gTec.search(sentence)]
        ds_ng = [0] if len(ds_ng) == 0 else ds_ng

        tec_cs.sort(reverse=True)
        tec_cat.sort(reverse=True)
        tec_ng.sort(reverse=True)
        ds_cs.sort(reverse=True)
        ds_cat.sort(reverse=True)
        ds_ng.sort(reverse=True)

        return tec_cs, tec_cat, tec_ng, ds_cs, ds_cat, ds_ng

    def remove_stop(self, sentence):
        words = sentence.split(' ')
        for stop in self.stopWords:
            if stop in words:
                words.remove(stop)
        return " ".join(words)
