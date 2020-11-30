from bs4 import BeautifulSoup


def parser4realtimeOpt(page_source):
    soup = BeautifulSoup(page_source, 'html.parser')
    tbody = soup.select_one("table.sticky-table-horizontal-2 tbody")
    trs = tbody.select("tr")
    data = []
    for tr in trs:
        tds = tr.select("td")
        counter = 1
        tempArray = []
        for td in tds:
            if (counter == 8):
                price = td.select_one("div")
                tempArray.append(price.text)
                counter += 1
            else:
                if (4 <= counter <= 12):
                    divText = td.select_one("a div")
                    if(divText.text == "--"):
                        tempArray.append(None)
                    else:
                        tempArray.append(divText.text.replace(",",""))
                    
                if (counter == 15):
                    data.append(tempArray)
                    counter = 1
                else:
                    counter += 1
    return data


def parser4realtimeBigIndex(page_source):
    soup = BeautifulSoup(page_source, 'html.parser')
    tbody = soup.select_one("table.table.quotes-table.mb-1.sticky-table-horizontal tbody")
    trs = tbody.select("tr")
    data = []
    for tr in trs:
        tds = tr.select("td")
        counter = 1
        tempArray = []
        designatedColumns = [1, 2, 7, 8, 11, 12, 13]

        for td in tds:
            
            if counter in designatedColumns:
                if counter == 1:
                    productName = td.select_one("a")
                    tempArray.append(productName.text.replace("\n","").strip())
                elif counter == 2:
                    tempArray.append(td.text)
                else:
                    spanText = td.select_one("span")
                    if(spanText.text == "--"):
                        tempArray.append(None)
                    else:
                        tempArray.append(spanText.text.replace(",",""))
            
            if counter == 15:
                data.append(tempArray)
                counter = 1
            else:
                counter += 1

    return data


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