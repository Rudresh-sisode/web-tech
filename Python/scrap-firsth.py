from bs4 import BeautifulSoup
import requests
from urllib.request import Request, urlopen

try:
    html_text = Request('https://www.glassdoor.co.in/Overview/Working-at-Gilead-Sciences-EI_IE2016.11,26.htm',headers={'User-Agent': 'Mozilla/5.0'})

    webpage = urlopen(html_text).read()
    soup = BeautifulSoup(webpage,'html.parser')
    # print(soup)

    head = soup.find(attrs={'data-rh':"true"}).text
    print(head)

except Exception as e:
    print(e)