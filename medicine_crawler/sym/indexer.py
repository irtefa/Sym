from pyquery import PyQuery as pq
from os import walk

'''
    The Symptom Disease dictionary is structured like this
    Disease -> [Symptom_1, Symptom_2, ....]
'''

files = []
symdict = {}

#Get all the file names
for (_, _, filenames) in walk('.'):
    files.extend(filenames)
    break

for filename in files:
    #For files where the filename is the disease
    if 'symptoms_and_signs' in filename:
        f = open(filename)
        s = f.read()
        f.close()
        d = pq(s)
        symptoms = []

        for t in d('.i').children():
            symptoms.append(pq(t).text())

        disease = ' '.join(filename[:-5].split('_'))

        if disease in symdict:
            symdict[disease] += symptoms
        else:
            symdict[disease] = symptoms        

    #For files where the filename is the symptom
    else:
        f = open(filename)
        s = f.read()
        f.close()
        d = pq(s)
        diseases = []

        titles = list(d('.ltcTitle'))

        for disease in titles:
            diseases.append(pq(disease).text())

        symptom = ' '.join(filename[:-5].split('_'))
        
        for disease in diseases:
            if disease in symdict:
                symdict[disease].append(symptom)
            else:
                symdict[disease] = [symptom]

print symdict
