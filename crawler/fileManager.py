import csv

def csvUpdatter(data):
    
    with open("realtimeData.csv", 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        colunmNames = [
            "callIncrement",
            "callDealPrice",
            "callSellPrice",
            "callBuyPrice",
            "strikePrice",
            "putBuyPrice",
            "putSellPrice",
            "putDealPrice",
            "putIncrement"
        ]
        writer.writerow(colunmNames)
        writer.writerows(data)