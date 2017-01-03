

class DictAnalyzer:
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
                    count += 2  # higher value
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
        for word in self.negTech:
            if word in sentence:
                count += 10  # higher value - contains DS context words
        return count

    def get_tag(self, sentence, context):
        ds = self.__ds_count__(sentence, context)
        nmd = self.__nmd_count__(sentence)
        tec = self.__tec_count__(sentence)
        if tec == 0 and nmd == 0 and ds == 0:
            return 'NaN'

        if context == "DS" and tec > 0 and "לא" in sentence:
            ds -= 2

        if tec >= 10:
            return 'TEC10'
        if ds >= nmd:
            if ds > tec:
                return 'DS'
            else:
                return 'TEC'
        else:
            if nmd > tec:
                return 'NMD'
            else:
                return 'TEC'

    def get_tag_with_counts(self, sentence, context):
        ds = self.__ds_count__(sentence, context)
        nmd = self.__nmd_count__(sentence)
        tec = self.__tec_count__(sentence)
        counts = [ds, nmd, tec]
        if tec == 0 and nmd == 0 and ds == 0:
            return 'NaN', counts

        if context == "DS" and tec > 0 and "לא" in sentence:
            ds -= 2

        if tec >= 10:
            return 'TEC', counts
        if ds > nmd:
            if ds > tec:
                return 'DS', counts
            else:
                return 'TEC', counts
        else:
            if nmd > tec:
                return 'NMD', counts
            else:
                return 'TEC', counts

    def __if_then_statment__(self, sentence):
        conclusion_split = sentence.split('אם')
        for i in range(len(conclusion_split)):
            if i > 0:
                if 'אז' in conclusion_split[i]:
                    return 1
        return 0

    def get_dict_values(self, sentence):
        ds = self.__ds_count__(sentence, 'x')
        nmd = self.__nmd_count__(sentence)
        tec = self.__tec_count__(sentence)
        return [ds, nmd, tec]
