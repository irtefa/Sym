import requests
import string
from pyquery import PyQuery as pq

MAX_LIMIT = 300
URL = 'http://www.medicinenet.com/'

def get_page(name):
    for ch in ["(", ")", "'", "/", ","]:
        name = name.replace(ch, '')
    name.replace('&', 'and')

    name = '_'.join(name.lower().split())

    r = requests.get(URL+name+'/symptoms.htm')
    
    if str(r.status_code) != '200':
        print r.status_code
        if (name == 'cancer_throat_throat_cancer_symptoms_and_signs'):
            r = requests.get(URL+'throat_cancer_symptoms_and_signs/symptoms.htm')
            print r.status_code

    content = r.text.encode('utf-8', 'ignore')

    file_name = 'sym/'+name+'.html'

    with open(file_name, 'w') as fp:
        fp.write(content)

def get_letter(letter):
        f = open(letter+'.html', 'r')
        content = f.read()
        content = content.replace('\n', '')

        d = pq(content)
        diseases = d('.i').children()

        for i in range(0, 30):
            disease_name = diseases('li').eq(i).text()

            if disease_name == '':
                break
            else:
                get_page(disease_name)

        f.close()
        
        
        
if __name__ == "__main__":
    url = 'http://www.medicinenet.com/symptoms_and_signs/'
    for letter in string.lowercase:
        get_letter(letter)