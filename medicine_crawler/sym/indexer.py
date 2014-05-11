from pyquery import PyQuery as pq
from os import walk
import requests
import json

'''
    The Symptom Disease dictionary is structured like this
    Disease -> [Symptom_1, Symptom_2, ....]
'''

#CONSTANTS
# ELASTIC_HOST = 'http://localhost:9200/'
ELASTIC_HOST = 'http://apricot-4314920.us-east-1.bonsai.io/'
HEADERS = {'content-type': 'application/json'}
INDEX = 'symptom'

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

#Flush older index
# r = requests.delete(ELASTIC_HOST+INDEX+'/')
# print r.text

#Index new data
for disease in symdict:
    elasticobj = {
        'disease': disease,
        'symptoms': symdict[disease]
    }

    r = requests.post(ELASTIC_HOST+INDEX+'/data/', data=json.dumps(elasticobj), headers=HEADERS)
    print r.text

# #JSON List
# syms = []

# #Write to JSON file
# for key in symdict:
#     for symptom in symdict[key]:
#         syms.append(symptom.lower())

# syms = set(syms)

# unique_syms = []

# for symptom in syms:
#     unique_syms.append(symptom)

# with open("symptoms.json", "w") as outfile:
#     json.dump(unique_syms, outfile, indent=4)
