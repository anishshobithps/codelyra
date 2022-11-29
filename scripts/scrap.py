import re
import json
import requests
from datetime import datetime
from bs4 import BeautifulSoup

link_regex = re.compile(r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))")
heading_regex = re.compile(r"<strong>.*</strong>")
text_regex = re.compile(r"<div style=\"text-align\: left;\">\n\n.*\n<\/div\>")
cleanup_regex = re.compile(r"<.*?>|&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});")

def quotes(text):
    return text.replace(u"\u2018", "'").replace(u"\u2019", "'")

def tldr():
    url = 'https://tldr.tech/latest'
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        divs = soup.find_all('div', class_='mt-3')
        data = []
        for i in range(1, len(divs)):
            div = str(divs[i])
            link = link_regex.search(div)
            heading = heading_regex.search(div)
            text = text_regex.search(div)
            if link != None and heading != None and text != None:
                data.append(dict(
                        url=re.sub(cleanup_regex, '', link.group()),
                        topic=quotes(re.sub(cleanup_regex, '', heading.group())),
                        text=quotes(re.sub(cleanup_regex, '', text.group()).replace('\n\n', ''))
                    ))
        return data

date = datetime.now().strftime('%Y-%m-%d')
file = open(f'../data/{date}.json', 'w')

file.write(json.dumps(tldr(), indent=4))
