from bs4 import BeautifulSoup
import requests
from urllib.request import Request, urlopen
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
import time

try:
   
    # twitterHtmlText = Request('https://twitter.com/elonmusk',headers={'User-Agent': 'Mozilla/5.0'})
    driver = webdriver.Chrome(ChromeDriverManager().install())
    driver.get('https://twitter.com/elonmusk')
    time.sleep(3)
    html = driver.page_source
    print(html)
    # webpage = urlopen(twitterHtmlText).read()
    # soup = BeautifulSoup(webpage,'html.parser')
    # print(soup.__len__)
    # elements = soup.find_all(class_='r-dnmrzs')
    #  companyRecommend = soup.find("tspan",class_="donut__DonutStyle__donutchart_text_val").text
    # element = soup.find("div",attrs={"data-testid":"UserName"})
    # soup.find_all(attrs={'dir':"ltr"})

    # 
    # print(element)
    # element_to_scrape = elements[17]

except Exception as e:
    print(e)