import re

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
        self.shorts = open('Dictionaries\\ShortTerms.txt', 'r', encoding="utf8").read().split('\n')
        self.context = open('Dictionaries\\ContextTerms.txt', 'r', encoding="utf8").read().split('\n')

    def __ds_count__(self,sentence,context,solution):
        count = 0
        shape = False
        geoTerm = False
        for word in self.PlurarShapes:
            if word in sentence:
                count = count + 1
                shape = True
        for word in self.Shapes:
            if word in sentence:
                count = count + 1
                shape = True
        for word in self.geo:
            if word in sentence:
                count = count + 1
                geoTerm = True
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
        if solution[1] == 'shape' and shape:
            if self.__check_solution(solution[0],sentence):
                code = 1
            else:
                code = 0
        elif solution[1] == 'geoTerm' and geoTerm:
            if self.__check_solution(solution[0],sentence):
                code = 1
            else:
                code = 0
        else:
            code = 3
        return [count,code]

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

    def get_tag(self,sentence,context,solution):
        [ds,code] = self.__ds_count__(sentence,context,solution)
        nmd = self.__nmd_count__(sentence)
        tec = self.__tec_count__(sentence)
        if tec == 0 and nmd == 0 and ds == 0:
            return 'NaN',-1
        if ds > nmd:
            if ds > tec:
                return 'DS',code
            else:
                return 'TEC',-1
        else:
            if nmd > tec:
                return 'NMD',-1
            else:
                return 'TEC',-1

    def __if_then_statment__(self, sentence):
        conclusionSplit = sentence.split('אם')
        for i in range(len(conclusionSplit)):
            if i > 0:
                if 'אז' in conclusionSplit[i]:
                    return 1
        return 0

    def check_group(self,sol):
        for word in self.PlurarShapes:
            if word in sol:
                return 'shape'
        for word in self.Shapes:
            if word in sol:
                return 'shape'
        for word in self.geo:
            if word in sol:
                return 'geoTerm'
        return ""

    def __check_solution(self, sol, sentence):
        if sol in sentence:
            return True
        words = re.findall(r'\w+', sentence)
        for word in words:
            if word in sol:
                return True
        return False

    def get_dict_values(self,sentence):
        [ds,code] = self.__ds_count__(sentence,'x',['x','x'])
        nmd = self.__nmd_count__(sentence)
        tec = self.__tec_count__(sentence)
        return [ds,nmd,tec]