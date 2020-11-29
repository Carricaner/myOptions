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
                    tempArray.append(productName.text)
                elif counter == 2:
                    tempArray.append(td.text)
                else:
                    index = td.select_one("span")
                    tempArray.append(index.text)
            
            if counter == 15:
                data.append(tempArray)
                counter = 1
            else:
                counter += 1

    return data