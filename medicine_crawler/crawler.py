import requests
import string

def get_page(url):
    for letter in string    .lowercase:
        r = requests.get(url+'alpha_'+letter+'.htm')
        print r.status_code
        content = r.text.encode('utf-8', 'ignore')
        with open(letter+'.html', 'w') as fp:
            fp.write(content)
        
        
if __name__ == "__main__":
    url = 'http://www.medicinenet.com/symptoms_and_signs/'
    get_page(url)