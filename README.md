Sym
=========

Sym is a web-based symptom diagnosis tool.

Most existing symptoms diagnosis tools like [Webmd] are extremely cumbersome and requires a lot of steps before the user can find out his/ her possible diagnosis. Sym solves that problem by making the interface extremeley simple for the user to use. 

  - It uses autosuggestion to help the user find the symptom.
  - Provides a very clean interface.
  - One step process ensures that the user is not wasting time.

Underlying Architecture
----

Sym uses a lightweight **[node.js]** server in the backend wrapped around **[expressjs]**. The clientside is written in vanilla **JavaScript**. For autosuggestion Sym uses **[Typeahead]**. The backend search engine is an **[Elasticsearch]** instance.

Once the user types in a query for the first time, an AJAX call is made to the backend server. Upon receiving the query, the backend server queries the elasticsearch instance, which in return sends back relevant results.

Installation
--------------

As the code is open-sourced, you can easily clone the following [repository]. Once you have cloned make sure you have [node.js] and [npm] installed. Follow these steps to start the client:

```sh
git clone git@github.com:irtefa/Sym.git
cd Sym/client
npm install
node app.js
```

This will start the app but your queries will not work unless you start elasticsearch. You have to download elasticsearch first from [here]. Once you have downloaded it start the elasticsearch instance by cd ing into that directory and type the following command:

```sh
bin/elasticsearch
```
After you have started the elasticsearch instance, you have to index the crawled data. The indexer script is written in python. Make sure you have Python installed. You also have to download the **requests** module before you can run the script. You an use either pip or easy_install to donwload the module. After you have donwloaded the necessary module, you have to follow these steps:

```sh
cd Sym/medicine_crawler/sym/
python indexer.py
```
Sym should be ready now. You can play with it by visiting [this] url.

**Advisor**: Chengxiang Zhai 
**Author**: Mohd Irtefa

[express]:http://expressjs.com
[Webmd]:http://symptoms.webmd.com/default.htm#introView
[node.js]: http://nodejs.org/
[Elasticsearch]:http://www.elasticsearch.org/
[Typeahead]:http://twitter.github.io/typeahead.js/
[repository]:https://github.com/irtefa/sym
[npm]:https://www.npmjs.org/
[here]:http://www.elasticsearch.org/download/
[this]:http://localhost:3000
    
