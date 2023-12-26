# URL (https://www.glassdoor.co.in/Overview/Working-at-Software-Group-EI_IE1193726.11,25.htm)
# we need try exc for each attribute access


import datetime

from bs4 import BeautifulSoup
from urllib.request import Request, urlopen
import re
from datetime import datetime
import json
import pandas as pd
import math
import requests
import time
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

# from selenium import webdriver
# from selenium.webdriver.firefox.service import Service
# from webdriver_manager.firefox import GeckoDriverManager

# https://www.glassdoor.co.in/Overview/Working-at-Gilead-Sciences-EI_IE2016.11,26.htm
# html_text = Request('https://www.glassdoor.co.in/Reviews/Software-Group-Reviews-E1193726.htm',headers={'User-Agent': 'Mozilla/5.0'})
html_text = Request('https://www.glassdoor.co.in/Overview/Working-at-Gilead-Sciences-EI_IE2016.11,26.htm',headers={'User-Agent': 'Mozilla/5.0'})
# https://www.glassdoor.co.in/Overview/Working-at-Software-Group-EI_IE1193726.11,25.htm
# https://www.glassdoor.co.in/Overview/Working-at-Software-Group-EI_IE1193726.11,25.htm
webpage = urlopen(html_text).read()

stableGlassDoor_url = "https://www.glassdoor.co.in"
# //request done successfully
soup = BeautifulSoup(webpage,'lxml')

# print(type(soup))
# print(soup.prettify())

class CompanyHeaderInfo:

    companyHead = soup.find('div',id="EIHdrModule")
    # print(companyHead)
    company_name = companyHead.find('span',id="DivisionsDropdownComponent").text
    print(company_name)
    # all_link = companyHead.find_all('a')
    totalReview = companyHead.find(attrs={"data-label":"Reviews"}).span.text
    print('totalReview ',totalReview)
    # input_tag = soup.find_all(attrs={"name" : "stainfo"})
    totalReviewLink = companyHead.find(attrs={"data-label":"Reviews"})['href']
    totalReviewLink = stableGlassDoor_url+totalReviewLink
    print('total review link ',totalReviewLink)
    totalAvailableJobs = companyHead.find(attrs={"data-label":"Jobs"}).span.text
    totalAvailableJobsLink = companyHead.find(attrs={"data-label":"Jobs"})['href'] #link variable
    totalAvailableJobsLink = stableGlassDoor_url+totalAvailableJobsLink
    print('available jobs link',totalAvailableJobsLink)
    totalSalary = companyHead.find(attrs={"data-label":"Salaries"}).span.text
    totalSalaryLink = companyHead.find(attrs={"data-label":"Salaries"})['href']  #link variable
    totalSalaryLink = stableGlassDoor_url+totalSalaryLink
    print('salary link',totalSalaryLink)
    totalInterview = companyHead.find(attrs={"data-label":"Inter­views"}).span.text
    totalInterviewLink = companyHead.find(attrs={"class":'interviews'})['href']  #link variable
    totalInterviewLink = stableGlassDoor_url+totalInterviewLink
    print('interview link',totalInterviewLink)
    totalBenefits = companyHead.find(attrs={"data-label":"Benefits"}).span.text
    totalBenefitsLink = companyHead.find(attrs={"data-label":"Benefits"})['href']  #link variable
    totalBenefitsLink = stableGlassDoor_url+totalBenefitsLink
    print('benefits link',totalBenefitsLink)
    # id="DivisionsDropdownComponent" id="EIHdrModule"
    # jobs = soup.find_all('li',class_="clearfix job-bx wht-shd-bx")

    def getReviewLink(self):
        return self.totalReviewLink
    
    def getJobLink(self):
        return self.totalAvailableJobsLink
    
    def getSalaryLink(self):
        return self.totalSalaryLink
    
    def getInterviewLink(self):
        return self.totalInterviewLink
    
    def getBenefitsLink(self):
        return self.totalBenefitsLink


def companyHeaderInfo():
    ref = CompanyHeaderInfo()
    ref.getReviewLink()


# def getCompanyOverviewData():
#     data_Overview = soup.find(attrs={"data-test":"employerOverviewModule"})
#     # print('data overview',data_Overview)
#     companyWebsite = data_Overview.find(attrs={"data-test":"employer-website"}).text
#     companyHeadquarter = data_Overview.find(attrs={"data-test":"employer-headquarters"}).text
#     companyHeadquarter2 = companyHeadquarter.split(",")[1]
#     companyEmployeeSize = data_Overview.find(attrs={"data-test":"employer-size"}).text
#     companyFoundedYear = data_Overview.find(attrs={"data-test":"employer-founded"}).text
#     companyType = data_Overview.find(attrs={"data-test":"employer-type"}).text
#     companyIndustry = data_Overview.find(attrs={"data-test":"employer-industry"}).text
#     companyRevenue = data_Overview.find(attrs={"data-test":"employer-revenue"}).text
#     # companyCompetitors = data_Overview.find(attrs={"data-test":"employerCompetitors"}).text 
#     companyDescription = data_Overview.find(attrs={"data-test":"employerDescription"}).text
#     companyMission = data_Overview.find(attrs={"data-test":"employerMission"}).text
#     data = [companyWebsite,companyHeadquarter,companyHeadquarter2,companyEmployeeSize,companyFoundedYear,companyType,companyIndustry,companyRevenue,companyDescription,companyMission]
#     print("data ",data)
#     print("************************Company Overview*****************************")
#     print(f"Company Website: {companyWebsite}\n Headquarter: {companyHeadquarter}\n Employee Size: {companyEmployeeSize}\n Founded Year: {companyFoundedYear}\n Company Type: {companyType}\n Industry: {companyIndustry}\n Revenue: {companyRevenue}\n Company Description: {companyDescription}\n Company Mission: {companyMission}")
#     # input_tag = soup.find_all(attrs={"name" : "stainfo"})
#     return data

def get_date_and_title(author_job_title_tag):
    date_title = author_job_title_tag.split("-")

    date_str = date_title[0].strip().replace(" ", "-")

    title_str = date_title[1].strip()
    return [date_str, title_str]

def getIndexRating(indexRate):
    # print("your index rate class ",indexRate)
    match indexRate:
        case "css-s88v13":
            return 5

        case "css-1nuumx7":
            return 4

        case "css-vl2edp":
            return 3

        case "css-18v8tui":
            return 2

        case "css-xd4dom":
            return 1

        case _:
            return 0

def checkCssClass(className):
    match className:
        case "css-hcqxoa":
            return "1"
        case "css-10xv9lv":
            return "."
        case "css-1h93d4v":
            return "0"
        case "css-1kiw93k":
            return "-1"

def getCompanyReviewHeaderDetail(compReviewDeatail):
    print('your review Detail found ',compReviewDeatail)


def getCompanyReviewData():
    
    companyHeaderRef = CompanyHeaderInfo()
    companyReviewLink = str(companyHeaderRef.getReviewLink())
    companyName = companyHeaderRef.company_name
    TotReview = companyHeaderRef.totalReview
    TotInterview = companyHeaderRef.totalInterview
    TotJobs = companyHeaderRef.totalAvailableJobs
    TotSalaries = companyHeaderRef.totalSalary
    TotBenefits = companyHeaderRef.totalBenefits

    # 
    try:

        data_Overview = soup.find(attrs={"data-test":"employerOverviewModule"})
    except:
        data_Overview = '.'
    # print('data overview',data_Overview)
    try:

        companyWebsite = data_Overview.find(attrs={"data-test":"employer-website"}).text
    except:
        companyWebsite = '.'
    try:
        companyHeadquarter = data_Overview.find(attrs={"data-test":"employer-headquarters"}).text
    except:
        companyHeadquarter = '.'

    try:
        companyHeadquarter2 = companyHeadquarter.split(",")[1]
    except:
        companyHeadquarter2 ='.'
    
    try:
        companyEmployeeSize = data_Overview.find(attrs={"data-test":"employer-size"}).text
    except:
        companyEmployeeSize = '.'

    try:
         companyFoundedYear = data_Overview.find(attrs={"data-test":"employer-founded"}).text
    except:
        companyFoundedYear ='.'
    
    try:
        companyType = data_Overview.find(attrs={"data-test":"employer-type"}).text
    except:
        companyType = '.'
    
    try:
        companyIndustry = data_Overview.find(attrs={"data-test":"employer-industry"}).text
    except:
        companyIndustry ='.'
    
    try:
        companyRevenue = data_Overview.find(attrs={"data-test":"employer-revenue"}).text
    except:
        companyRevenue = '.'
    
    try:
        companyCompetitors = data_Overview.find(attrs={"data-test":"employerCompetitors"}).text
    except:
        companyCompetitors = '.'

    # 

    print('review link',companyReviewLink)
    html_text = Request(companyReviewLink,headers={'User-Agent': 'Mozilla/5.0'})
  

    webpage = urlopen(html_text).read()
  
    soup = BeautifulSoup(webpage,'lxml')

    compReviewDeatail = soup.find_all("div",style_="visibility:hidden")
    print("your checking elements ",soup.select('[style~="visibility:hidden"]'))
    print("your 2 checking elments ", soup.select('[style~="display:none"]'))
    print("your review deatail # ",compReviewDeatail)
    # getCompanyReviewHeaderDetail(compReviewDeatail)
    
    data_Review_Viewing = soup.find("div",class_="paginationFooter").text
    print('data review viewing ', data_Review_Viewing)
    dataLimit = data_Review_Viewing.split(" ")[3]
    dataSize = data_Review_Viewing.split(" ")[5].strip().replace(",","")
    print("view data limit ",dataLimit)
    print("view data size ",int(dataSize))
    rangeValue = math.ceil(int(dataSize) / int(dataLimit))
    print("range value ",rangeValue)


    try:
        companyTotalRating = soup.find("div",class_="v2__EIReviewsRatingsStylesV2__ratingNum").text
        print('company total rating',companyTotalRating)
    except:
        companyTotalRating = "."
    
    try:
        companyRecommend = soup.find("tspan",class_="donut__DonutStyle__donutchart_text_val").text
    except:
        companyRecommend = "."

    try:  
        companyApprovedCEO = soup.find("tspan",class_="donut__DonutStyle__donutchart_text_val").find_next("tspan",class_="donut__DonutStyle__donutchart_text_val").text
    except:
        companyApprovedCEO = "."

    print("cmp recoment ",companyRecommend)
    print("companyApprovedCeo ",companyApprovedCEO)

    try:
        companyCeoRating = soup.find("div",class_="numCEORatings").text
    except:
        companyCeoRating = "."
    
    try:
        compCEOName = soup.find("div",class_="numCEORatings").find_previous("div").text
    except:
        compCEOName = "."
    
    try:
        driver = webdriver.Chrome(ChromeDriverManager().install())
        driver.get('https://www.glassdoor.co.in/Reviews/Gilead-Sciences-Reviews-E2016.htm')
        time.sleep(3)
        # divButton = driver.find_element_by_class_name("v2__EIReviewsRatingsStylesV2__ratingInfo")
        divButton = driver.find_element("v2__EIReviewsRatingsStylesV2__ratingInfo")
        divButton.click()
        time.sleep(2)
        # div class="modal_content"
        html = driver.page_source
        soup = BeautifulSoup(html,'lxml')
        yourDiv = soup.find("div",role="tablist")

        cultureAndValue = yourDiv.find("div",{"data-category":"cultureAndValues"})
        overAllCultureandValues = cultureAndValue.find("div",class_="eiRatingTrends__RatingTrendsStyle__ratingNum").text

        # data-category="diversityAndInclusion"
        diveryAndInclus = yourDiv.find("div",{"data-category":"diversityAndInclusion"})
        overAlldiversityAndInclusion = diveryAndInclus.find("div",class_="eiRatingTrends__RatingTrendsStyle__ratingNum").text

        #data-category="workLife"
        workAndLife = yourDiv.find("div",{"data-category":"workLife"})
        overAllWorkAndLife = workAndLife.find("div",class_="eiRatingTrends__RatingTrendsStyle__ratingNum").text

        # data-category="seniorManagement
        seniorManagement = yourDiv.find("div",{"data-category":"seniorManagement"})
        overAllSeniorManagment = seniorManagement.find("div",class_="eiRatingTrends__RatingTrendsStyle__ratingNum").text

        # data-category="compAndBenefits"
        compAndBenefits = yourDiv.find("div",{"data-category":"compAndBenefits"})
        overAllCompAndBenefits = compAndBenefits.find("div",class_="eiRatingTrends__RatingTrendsStyle__ratingNum").text

        # data-category="careerOpportunities"
        careerAndOpportunities = yourDiv.find("div",{"data-category":"careerOpportunities"})
        overAllCareerAndOpportunity = careerAndOpportunities.find("div",class_="eiRatingTrends__RatingTrendsStyle__ratingNum").text

        print(f"culture and value {overAllCultureandValues}, Diversity and Inclusion {overAlldiversityAndInclusion}, Work and Life {overAllWorkAndLife}, Senior Management {overAllSeniorManagment}, Compensatin and Benefits {overAllCompAndBenefits}, Career and Benefits {overAllCareerAndOpportunity}")
        # print(f"culture and value {overAllCultureandValues}, Diversity and Inclusion {overAlldiversityAndInclusion}, Work and Life {overAllWorkAndLife}, Senior Management {overAllSeniorManagment}, Compensatin and Benefits {overAllCompAndBenefits}, Career and Benefits {overAllCareerAndBenefits}") bizOutLook
       
        # data-accordion-category="bizOutlook"
        bizOutLook = soup.find("div", id="DonutRatings").find_next("div",{"data-accordion-category":"bizOutlook"}).find("tspan").text
        print('your bizOutlook ',bizOutLook)


    except Exception as e:
        print("Exception occured while click event \n",e)

    finally:
        driver.close()

    print("company ceo name ",compCEOName)
    print("compayCEORating",companyCeoRating)
    # clicking the button with python script
    print("company review link ",companyReviewLink)
    data =[]
    # driver = webdriver.Firefox(service=Service(GeckoDriverManager().install()))
    # driver.page_source
    # driver.get('https://www.glassdoor.co.in/Reviews/Gilead-Sciences-Reviews-E2016.htm')
    
    # from here the range pagination will start
    for i in range(1,rangeValue + 1):
        
        companyReviewLinkURL = companyReviewLink.split(".htm")[0]+"_P"+str(i)+".htm"
        # print("your all reviews URL ",companyReviewLinkURL)
        
        # html_text = Request(companyReviewLinkURL,headers={'User-Agent': 'Mozilla/5.0'})
        try:
           
            # driver = webdriver.Firefox(profile)
            # driver = webdriver.Firefox(service=Service(GeckoDriverManager().install()))
            # PATH = 'C:\Program Files\Python310\chromedriver.exe'
            # driver = webdriver.Chrome(PATH)
            driver = webdriver.Chrome(ChromeDriverManager().install())

            driver.get(companyReviewLinkURL)
            time.sleep(10)
            div_button = driver.find_element("v2__EIReviewDetailsV2__continueReading")
            print("how many buttons ",len(div_button))
            for x in range(0,len(div_button)):
                

                print('your x ',x)
                div_button[x].click()
                try:
                    time.sleep(3)
                    span_close = driver.find_element("modal_closeIcon")
                    span_close.click()
                except Exception as e:
                    print("Error occured while clicking the close button\n ",e)
            
            html_text = driver.page_source
            soup = BeautifulSoup(html_text,'lxml')
            # webpage = urlopen(html_text).read()
            # soup = BeautifulSoup(webpage,'lxml')

            try:
                rev_all = soup.find_all("li", id=re.compile("empReview_*"))
            except:
                print("Sorry No list of data found")
                break
                #if list not found then no need to continue the operation
                
            for rev in rev_all:
                try:
                    review_id = rev.get("id")
                except:
                    review_id = "."
                    break
                    #if review_id doesn't exist no need to continue the operation

                try:
                    starRating = rev.find("span",class_="ratingNumber").text
                except:
                    starRating = "."

                try:    
                    currentEmployee = rev.find("span",class_="pt-xsm pt-md-0 css-1qxtz39 eg4psks0").text
                except:
                    currentEmployee = "."
                
                try:
                    author_job_title = rev.find("span", class_="authorInfo").text
                    isCurrentEmployee = "."
                    if "Current" in author_job_title:
                        isCurrentEmployee = 1
                    else:
                        isCurrentEmployee = 0
                    try:

                        employeeLength = re.findall(r'\d+', author_job_title)
                        employeeLength = employeeLength[0]
                    except:
                        employeeLength ='.'

                    fullPartContract = '.'
                    if "Current Employee" in author_job_title:
                        fullPartContract = 1
                    elif "Part" or "part" in author_job_title:
                        fullPartContract = 2
                    elif "Contractor" or "contractor" in author_job_title:
                        fullPartContract = 3

                    jobEndingYear = "."
                    if "Current" in author_job_title:
                        jobEndingYear = 2022

                    date_and_role = get_date_and_title(author_job_title)
                    review_date = date_and_role[0]
                    job_title = date_and_role[1]
                except:
                    author_job_title = "."
                    date_and_role = "."
                    review_date = "."
                    job_title = "."
                
                try:

                    countedData = rev.find("div",class_="common__EiReviewDetailsStyle__socialHelpfulcontainer").text
                    counted = re.findall(r'\d+', countedData)
                    countHelpFul = counted[0]
                    countNothelpFul = '.'
                except:
                    countHelpFul = '.'
                    countNothelpFul = '.'

                try:
                    reviewHeader = rev.find("a",class_="reviewLink").text
                except:
                    reviewHeader = "."
                
                try:
                    cmp_pros = rev.find("span",{"data-test":'pros'}).text
                except:
                    cmp_pros = "."

                try:    
                    cmp_cons = rev.find("span",{"data-test":'cons'}).text
                except:
                    cmp_cons = "."

                try:
                    advToMangement = rev.find(attrs={"data-test":"advice-management"}).text
                except:
                    advToMangement = "."

                try:
                    currentEmployee = rev.find("span",class_="css-1qxtz39").text
                except:
                    currentEmployee = "."

                try:
                    author_Location = rev.find("span",class_="authorLocation").text
                    location_State = author_Location.split(" ")[-1]
                    location_Country = author_Location.split(" ")[-1]
                except:
                    author_Location = "."
                    location_State = "."
                    location_Country = "."

                ratingDict = {
                   
                    "work_life_balance_rating":".",
                   
                    "culture_value_rating":".",
                   
                    "diversity_inclusion_rating":".",
                  
                    "compensation_benefits_rating":".",
                    
                    "senior_management_rating":".",
                    
                    "career_opportunity_rating":"."
                }

                try:
                    # all rating count
                    allList = rev.find("ul",class_="pl-0").find_all("li")
                    # print("your all list ",allList)
                    for eachList in allList:
                        # print("first list ", eachList)
                        name = eachList.find("div").text
                        ratingClass = eachList.find("div").find_next("div").get("class")[0]
                        indexRate = getIndexRating(ratingClass)
                        # print("rating name ",name)
                        # print("index rate ",indexRate)
                        match name.strip():
                            case "Work/Life Balance":
                                ratingDict["work_life_balance_rating"] = indexRate

                            case "Culture & Values":
                                ratingDict["culture_value_rating"] = indexRate
                            
                            case "Diversity & Inclusion":
                                ratingDict["diversity_inclusion_rating"] = indexRate

                            case "Career Opportunities":
                                ratingDict["career_opportunity_rating"] = indexRate

                            case "Compensation and Benefits":
                                ratingDict["compensation_benefits_rating"] = indexRate

                            case "Senior Management":
                                ratingDict["senior_management_rating"] = indexRate
                except:
                    pass
                    #no need to handle the exception here

                finally:
                    work_life_Balance_Rating = ratingDict["work_life_balance_rating"]
                    culture_value_rating = ratingDict["culture_value_rating"]
                    diversity_inclusion_rating = ratingDict["diversity_inclusion_rating"]
                    career_opportunity_rating = ratingDict["career_opportunity_rating"]
                    compensation_benefits_rating = ratingDict["compensation_benefits_rating"]
                    senior_management_rating = ratingDict["senior_management_rating"]
                    
                
                try:
                    rec_bus_outlook = rev.find("div",class_="recommends")
                    recomendsClass = rec_bus_outlook.find("div").find_next("span").get("class")[1]
                    recomends = checkCssClass(recomendsClass)
                except:
                    recomends = "."
        

                try:
                    ceoApprovalClass = rec_bus_outlook.find("div").find_next("div").find_next("span").get("class")[1]
                    ceoApproval = checkCssClass(ceoApprovalClass)
                except:
                    ceoApproval = "."
            

                try:
                    buss_outlook_class = rec_bus_outlook.find("div").find_next("div").find_next("div").find_next("span").get("class")[1]
                    bussnessOutlook = checkCssClass(buss_outlook_class)
                except:
                    bussnessOutlook = "."
                        # print(f"culture and value {overAllCultureandValues}, Diversity and Inclusion {overAlldiversityAndInclusion}, Work and Life {overAllWorkAndLife}, Senior Management {overAllSeniorManagment}, Compensatin and Benefits {overAllCompAndBenefits}, Career and Benefits {overAllCareerAndBenefits}") bizOutLook
                
                data.append([review_id,companyName,isCurrentEmployee,employeeLength,fullPartContract,jobEndingYear,job_title
                ,author_Location,location_State,location_Country,review_date,
                reviewHeader,starRating,work_life_Balance_Rating,culture_value_rating,
                diversity_inclusion_rating,career_opportunity_rating,compensation_benefits_rating,senior_management_rating,countHelpFul,
                countNothelpFul,recomends,ceoApproval,bussnessOutlook,cmp_pros,cmp_cons,advToMangement,TotReview,
                TotJobs,TotSalaries,TotInterview,TotBenefits,companyEmployeeSize,companyType,companyHeadquarter,companyHeadquarter2,
                companyFoundedYear,companyRevenue,companyIndustry,companyCompetitors,companyRecommend,companyApprovedCEO,
                companyCeoRating,bizOutLook,compCEOName,companyTotalRating,overAllCultureandValues,
                overAlldiversityAndInclusion,overAllWorkAndLife,overAllSeniorManagment,overAllCompAndBenefits,
                overAllCareerAndOpportunity])
                time.sleep(3)
                # data.append([ReviewId,ComName,isCurrentEmployee,EmploymentLength,FullPartContract,JobEndingYear,JobTitle,
                # LocationCity,LocationState,LocationCountry,ReviewDate,
                # ReviewHeader,StarRating,WorkLifeBalance,CultureAndValues,
                # DiversityAndInclusion,CareerOpportunities,CompensationAndBenefits,SeniorManagement,CountHelpful,
                # CountNotHelpful,Recommend,CEOApproval,BusinessOutlook,ProText,ConText,AdviceToMangement,TotReviews,
                # TotJobs,TotSalaries,TotInterviews,TotBenefits,CompanySize,CompanyType,CompanyHQ1,CompanyHQ2,
                # CompanyFounded,CompayRevenue,CompanyIndustry,CompanyCompetitors,CompanyRecommend,CompanyApproveCEO,
                # NoCEORating,CompanyBusinessOutlook,CEOName,CompanyOverallRating,CompanyCultureValus,
                # CompanyDiversityInclusion,CompanyWorkLife,CompanySeniorManagement,CompanyCompensationBenefits,
                # CompanyCareerOppotunities])
            x = datetime.now().strftime("%S")
            print("******************************************************************",i)
            print(f"{x} seconds for this {i} result")
            # time.sleep(2) #sleep time 2 secs
        except Exception as e:
            print("something changes inside website, need to check \n",e)
        finally:
            
            driver.close()
    print("\nTesting :\n")
    print("All data #\n",data)
    return data

def save_data_to_excel(_2d_list_data):

    file_name = "outputs/output_" + datetime.now().strftime("%Y%m%d-%I%M%S") + ".xlsx"
    df = pd.DataFrame(_2d_list_data)
    df.columns = ["ReviewId","ComName",'isCurrentEmployee',"EmploymentLength","FullPartContract",
    "JobEndingYear","JobTitle","LocationCity","LocationState","LocationCountry","ReviewDate","ReviewHeader",
    "StarRating","WorkLifeBalance","CultureAndValues","DiversityAndInclusion","CareerOpportunities",
    "CompensationAndBenefits","SeniorManagement","CountHelpful","CountNotHelpful","Recommend","CEOApproval",
    "BusinessOutlook","ProText","ConText","AdviceToManagement","TotReviews","TotJobs","TotSalaries",
    "TotInterviews","TotBenefits","CompanySize","CompanyType","CompanyHQ1","CompanyHQ2","CompanyFounded",
    "CompanyRevenue","CompanyIndustry","CompanyCompetitors","CompanyRecommend","CompanyApproveCEO",
    "NoCEORating","CompanyBusinessOutlook","CEOName","CompanyOverallRating","CompanyCultureValues",
    "CompanyDiversityInclusion","CompanyWorkLife","CompanySeniorManagement","CompanyCompensationBenefits",
    "CompanyCareerOppotunities"]
  
    # df.columns = excel_columns
    writer = pd.ExcelWriter(file_name, engine="xlsxwriter")
    df.to_excel(writer, sheet_name="welcome", index=False)
    writer.save()

    print("Saved Excel File Name " + file_name)

data = getCompanyReviewData()
save_data_to_excel(data)
# getCompanyOverviewData()
print("Program finished")
# companyHeaderInfo()
# totalReviewLink = getReviewLink()
# print('review links',totalReviewLink)
# getCompanyOverviewData()
