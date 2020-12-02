from bs4 import BeautifulSoup


def parser4realtimeOpt(page_source):
    soup = BeautifulSoup(page_source, 'html.parser')
    tbody = soup.select_one("table.sticky-table-horizontal-2 tbody")
    trs = tbody.select("tr")
    dicArray = []
    data = []
    for tr in trs:
        tds = tr.select("td")
        counter = 1
        tempArray = []
        container = {}
        columnsArray = ['call_var', 'call_deal', 'call_sell', 'call_buy', 'target', 'put_buy', 'put_sell', 'put_deal', 'put_var']
        for td in tds:
            if (counter == 8):
                price = td.select_one("div")
                tempArray.append(price.text)
                container[columnsArray[counter-4]] = price.text
                counter += 1
            else:
                if (4 <= counter <= 12):
                    divText = td.select_one("a div")
                    if(divText.text == "--"):
                        tempArray.append(None)
                        container[columnsArray[counter-4]] = None
                    else:
                        tempArray.append(divText.text.replace(",",""))
                        container[columnsArray[counter-4]] = float(divText.text.replace(",",""))
                    
                if (counter == 15):
                    data.append(tempArray)
                    dicArray.append(container)
                    counter = 1
                else:
                    counter += 1
    return dicArray


def parser4realtimeBigIndex(page_source):
    soup = BeautifulSoup(page_source, 'html.parser')
    tbody = soup.select_one("table.table.quotes-table.mb-1.sticky-table-horizontal tbody")
    trs = tbody.select("tr")
    dicArray = []
    data = []
    for tr in trs:
        tds = tr.select("td")
        counter = 1
        tempArray = []
        container = {}
        columnsArray = ['name', 'status', 'dealprice', 'price_var', 'open', 'high', 'low']
        designatedColumns = [1, 2, 7, 8, 11, 12, 13]
        columnsCounter = 0
        for td in tds:
            
            
            if counter in designatedColumns:
                if counter == 1:
                    productName = td.select_one("a")
                    tempArray.append(productName.text.replace("\n","").strip())
                    container[columnsArray[columnsCounter]] = productName.text.replace("\n","").strip()
                elif counter == 2:
                    tempArray.append(td.text)
                    if (td.text == ""):
                        container[columnsArray[columnsCounter]] = None
                    else:
                        container[columnsArray[columnsCounter]] = td.text
                else:
                    spanText = td.select_one("span")
                    if(spanText.text == "--"):
                        tempArray.append(None)
                        container[columnsArray[columnsCounter]] = None
                    else:
                        tempArray.append(spanText.text.replace(",",""))
                        container[columnsArray[columnsCounter]] = spanText.text.replace(",","")
                columnsCounter += 1
            
            if counter == 15:
                data.append(tempArray)
                dicArray.append(container)
                counter = 1
            else:
                counter += 1

    return dicArray


def parser4staticOptDis(page_source, curYear, curMonth, curDay, nextYear, nextMonth):
        
    soup = BeautifulSoup(page_source, 'html.parser')
    tbody = soup.select_one("#printhere > table > tbody > tr:nth-child(2) > td > table.table_f > tbody")
    trs = tbody.select("tr")
    data = []

    totaltrNumber = 0
    for tr in trs:
        totaltrNumber += 1
    notCrawlColumns = [1, totaltrNumber-1, totaltrNumber]

    trCounter = 1
    for tr in trs:

        if (trCounter not in notCrawlColumns):          
            twoConsecutiveMonthProduct = ["%s%s" %(curYear, curMonth), "%s%s" %(nextYear, nextMonth)]
            tempArray = ["%d%d%d" %(curYear, curMonth, curDay)]
            designatedColumns = [1, 2, 3, 4, 8, 9, 10, 14, 15]
            tds = tr.select("td")

            contractDiv = tr.select_one("td:nth-child(2) div")

            if contractDiv.text.strip() in twoConsecutiveMonthProduct:
                counter = 1

                for td in tds:

                    if counter in designatedColumns:
                        if counter == 1:
                            tempArray.append("TXO")
                        elif counter == 2:
                            div = td.select_one("div")
                            tempArray.append(div.text.strip())
                        elif counter == 10:
                            try:
                                font = td.select_one("font")
                                if (font.text.strip() == '0'):
                                    tempArray.append('0')
                                else:
                                    tempArray.append(font.text.strip()[1:])
                            except:
                                if (td.text.strip() == '-'):
                                    tempArray.append(None)
                        else:
                            if (td.text.strip() == '-'):
                                tempArray.append(None)
                            else:
                                tempArray.append(td.text.strip())


                    if (counter == 19):
                        data.append(tempArray)
                        counter = 1
                    else:
                        counter += 1

                        
        trCounter += 1
    
    return data


def parser4staticBigguyLeft(page_source, dateStringInTheCurrentPage):

    soup = BeautifulSoup(page_source, 'html.parser')
    tbody = soup.select_one("#printhere > div:nth-child(4) > table > tbody > tr:nth-child(2) > td > table > tbody")
    trs = tbody.select("tr")
    data = []

    crawltrColumns = [4, 5, 6]
    trCounter = 1
    for tr in trs:

        if(trCounter in crawltrColumns):

            tempArray = [dateStringInTheCurrentPage]
            tds = tr.select("td")
            tdCounter = 1
            counter = 1

            for td in tds:

                if(trCounter == 4):

                    if(tdCounter not in [1, 2]):

                        try:
                            font = td.driver.selec_one("div:nth-child(1) font")
                            tempArray.append(font.text.strip().replace(",",""))
                        except:
                            div = td.select_one("div:nth-child(1)")
                            tempArray.append(div.text.strip().replace(",",""))
                        counter += 1

                else:

                    try:
                        font = td.driver.selec_one("div:nth-child(1) font")
                        tempArray.append(font.text.strip().replace(",",""))
                    except:
                        div = td.select_one("div:nth-child(1)")
                        tempArray.append(div.text.strip().replace(",",""))
                    counter += 1
                
                if (counter == 13):
                    data.append(tempArray)
                    counter = 1

                tdCounter += 1

        trCounter += 1

    return data


def parser4staticBigIndex(page_source):

    soup = BeautifulSoup(page_source, 'html.parser')
    tbody = soup.select_one('#report-table > tbody')
    trs = tbody.select('tr')
    data = []

    for tr in trs:
        tds = tr.select("td")
        tempArray = []
        counter = 1
        for td in tds:

            if (counter == 1):
                tempArray.append(td.text)
            else:
                tempArray.append(td.text.replace(",",""))
            
            if (counter == 5):
                data.append(tempArray)
                counter = 1
            else:
                counter += 1
    
    return data
        

        




