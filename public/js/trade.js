// ---------- jQuery for sticky theads ---------- 
var $th = $('.tableFixHead1').find('thead th')
$('.tableFixHead1').on('scroll', function() {
  $th.css('transform', 'translateY('+ this.scrollTop +'px)');
});
var $th2 = $('.tableFixHead2').find('thead th')
$('.tableFixHead2').on('scroll', function() {
  $th2.css('transform', 'translateY('+ this.scrollTop +'px)');
});

// ---------- global data for Trade ----------
let optDis = 0
let userParts = 0
let optDisNameSeq = ['call_var', 'call_deal', 'call_sell', 'call_buy', 'target', 'put_buy', 'put_sell', 'put_deal', 'put_var']
let userPartsNameSeq = ['prod_month', 'prod_target', 'prod_act', 'prod_cp', 'prod_number', 'prod_cost']

const tbody4OptDis = document.querySelector('#optDisTable table tbody')
const tbody4UserPart = document.querySelector('#user-part > div > table > tbody')

// ---------- socket part ----------
socket.on('realtimeOpt', (receiver) => {
    optDis = receiver
    let { date, time, product, data } = receiver
    const tbody4OptDis = document.querySelector('#optDisTable table tbody')
    const tobody4UserPart = document.querySelector('#user-part > div > table > tbody')
    const optDistrs = tbody4OptDis.querySelectorAll('tr')
    const userParttrs = tobody4UserPart.querySelectorAll('tr')
    
    // display optDis
    for (let i = 0; i < optDistrs.length; i++) {
        let tds = optDistrs[i].querySelectorAll("td")
        for (let j = 0; j < tds.length; j++) {
            if ( 0 < j && j < tds.length-1) {
                tds[j].innerText = data[i][optDisNameSeq[j-1]]
            }
        }
    }

    // display userPart profit
    for (let i = 0; i < userParttrs.length; i++) {
        let tds = userParttrs[i].querySelectorAll("td")
        for (let j = 0; j < tds.length; j++) {
            if ( 0 < j && j < tds.length-1) {
                let target = tds[1].innerText
                let cp = tds[3].innerText
                let cost = tds[5].innerText
                let number = tds[4].innerText
                let nowPrice = nowPriceGetter(optDis, target, cp)
                let profit = Math.floor((Number(nowPrice) - Number(cost)) * Number(number) * 50)
                tds[6].innerText = nowPriceGetter(optDis, target, cp)
                tds[7].innerText = profit.toString()
                if (profit > 0) {
                    tds[7].style.color = "#0d00ff"
                } else {
                    tds[7].style.color = "#ff0000"
                }
            }
        }
    }

})




// ---------- check authentication ----------
checkTokenWhileWindowLoad()
.then(result => {
    const { msg } = result
    const navSignIn = document.querySelector("#navbarResponsive > ul > li:nth-child(4) > a")

    if (msg == 'valid') {
        navSignIn.textContent = `個人頁面`
        navSignIn.className = "btn btn-success"
        navSignIn.href = "profile.html"
        return fetchPack('/api/1.0/realtime/getIndex', 'GET')
    } else if (msg == 'expire') {
        swal({
            title: "登入逾期",
            text: "請重新登入",
            icon: "info",
            button: "確認"
        })
        .then(result => {
            window.location.href = `${protocol}//${domain}` + "/signin.html"
        })
    } else {
        swal({
            title: "未能辨別使用者",
            text: "請先登入",
            icon: "info",
            button: "確認"
        })
        .then(result => {
            window.location.href = `${protocol}//${domain}` + "/signin.html"
        })
    }
})
.then(result => {
    // ---------- render OptDis ----------
    optDis = result.optDis
    let { data } = result.optDis
    
    showOptDisInTable(data, tbody4OptDis)

    const btns = document.querySelectorAll("button.buy")
    btns.forEach(btn => {btn.addEventListener("click", clickBuy)})

    return fetchPack('/api/1.0/user/showUserParts', 'POST', {userId: userId})
})
.then(result => {
    userParts = result
    // ---------- render User Parts ----------
    showUserPartsInTable(result, tbody4UserPart)

    const btns = document.querySelectorAll("button.liquidation")
    btns.forEach(btn => {btn.addEventListener("click", click2LiquidateParts)})
    
    return fetchPack('/api/1.0/user/showUserMoneyLeftnTotalprofit', 'POST', {userId: userId})
})
.then(result => {
    const userMoneyLeftDiv = document.querySelector("#money-left")
    showUserMoneyLeftnTotalProfit(result, userMoneyLeftDiv)
})





// functions
const nowPriceGetter = (optDis, target, cp) => {
    for (let i = 0; i < optDis.data.length; i++) {
        if (optDis.data[i].target == target) {
            if (cp == 'call') {
                return optDis.data[i].call_buy
            } else if (cp == 'put') {
                return optDis.data[i].put_buy
            }
        }
    }
}


const clickBuy = (e) => { 
    const tableString = `#optDisTable > table > tbody > `
    let numberOfRow = e.path[2].rowIndex - 1
    let numberOfItem = e.path[1].cellIndex + 1
    let target = document.querySelector(tableString + `tr:nth-child(${numberOfRow}) > td:nth-child(6)`).innerText
    let input = document.querySelector(tableString + `tr:nth-child(${numberOfRow}) > td:nth-child(${numberOfItem}) > input`)
    
    let cp = ''
    let costNumber = 0
    if (numberOfItem < 6) {
        cp = 'call'
        costNumber = 4
    } else {
        cp = 'put'
        costNumber = 8
    }
    let cost = document.querySelector(tableString + `tr:nth-child(${numberOfRow}) > td:nth-child(${costNumber})`)

    let carton = {
        userId: userId,
        target: target,
        act: "buy",
        month: optDis.date,
        cp: cp,
        number: Number(input.value),
        cost: Number(cost.innerText),
    }

    if (Number(input.value) < 1 || Number(input.value) % 1 != 0) {
        alert("輸入格式錯誤，請輸入正整數")
    } else {
        fetchPack('/api/1.0/user/buyParts', 'POST', carton)
        .then(result => {
            if (result.msg == 'success') {
                alert("購買成功")
                updateUserMoneynParts(userId)
            } else {
                alert("餘額不足")
            }
        })

        function updateUserMoneynParts(userId) {
            fetchPack('/api/1.0/user/showUserParts', 'POST', {userId: userId})
            .then(result => {
                userParts = result
                const tbody4UserPart = document.querySelector('#user-part > div > table > tbody') 
                tbody4UserPart.innerHTML = ''
                showUserPartsInTable(result, tbody4UserPart)

                const btns = document.querySelectorAll("button.liquidation")
                btns.forEach(btn => {btn.addEventListener("click", click2LiquidateParts)})

                return fetchPack('/api/1.0/user/showUserMoneyLeftnTotalprofit', 'POST', {userId: userId})
            })
            .then(result => {
                const userMoneyLeftDiv = document.querySelector("#money-left")
                userMoneyLeftDiv.innerHTML = ""
                showUserMoneyLeftnTotalProfit(result, userMoneyLeftDiv)
            })
        }
        
    }
    input.value = ""
    
}


const click2LiquidateParts = (e) => {
    const tableString = `#user-part > div > table > tbody > `
    let numberOfRow = e.path[1].rowIndex
    let partId = userParts[numberOfRow-1].id
    let userId = userParts[numberOfRow-1].user_id
    let number = Number(document.querySelector(tableString + `tr:nth-child(${numberOfRow}) > td:nth-child(5)`).innerText)
    let nowPrice = Number(document.querySelector(tableString + `tr:nth-child(${numberOfRow}) > td:nth-child(7)`).innerText)
    let profit = Number(document.querySelector(tableString + `tr:nth-child(${numberOfRow}) > td:nth-child(8)`).innerText)

    let carton = {
        partId: partId,
        userId: userId,
        number: number,
        nowPrice: nowPrice,
        profit: profit
    }

    console.log(carton)

    fetchPack('/api/1.0/user/liquidateParts', 'POST', carton)
    .then(result => {
        alert("平倉成功")
        // 下面這坨跟buyPart裡面的function一樣 有空包一包
        return fetchPack('/api/1.0/user/showUserParts', 'POST', {userId: userId})
    })
    .then(result => {
        userParts = result
        const tbody4UserPart = document.querySelector('#user-part > div > table > tbody') 
        tbody4UserPart.innerHTML = ''
        showUserPartsInTable(result, tbody4UserPart)

        const btns = document.querySelectorAll("button.liquidation")
        btns.forEach(btn => {btn.addEventListener("click", click2LiquidateParts)})

        return fetchPack('/api/1.0/user/showUserMoneyLeftnTotalprofit', 'POST', {userId: userId})
    })
    .then(result => {
        const userMoneyLeftDiv = document.querySelector("#money-left")
        userMoneyLeftDiv.innerHTML = ""
        showUserMoneyLeftnTotalProfit(result, userMoneyLeftDiv)
    })
    
}


const showUserPartsInTable = (result, tbody) => {
    const itemLength = result.length
    for (let i = 0; i < itemLength; i++) {
        let tr = document.createElement("tr")
        for (let j = 0; j < 9; j++) {
            if (j < 6) {
                let td = document.createElement("td")
                td.innerText = result[i][userPartsNameSeq[j]]
                tr.appendChild(td)
            } else if (j == 8) {
                let btn = document.createElement("button")
                btn.className = "liquidation btn btn-info btn-sm my-2"
                btn.innerText = "平倉"
                tr.appendChild(btn)
            } else {
                let td = document.createElement("td")
                let target = result[i][userPartsNameSeq[1]]
                let cp = result[i][userPartsNameSeq[3]]
                let cost = result[i][userPartsNameSeq[5]]
                let number = result[i][userPartsNameSeq[4]]
                if (j == 6) {
                    td.innerText = nowPriceGetter(optDis, target, cp)
                } else {
                    let profit = Math.floor((Number(nowPriceGetter(optDis, target, cp)) - Number(cost)) * number * 50)
                    td.innerText = profit.toString()
                    if (profit > 0) {
                        td.style.color = "#0d00ff"
                    } else {
                        td.style.color = "#ff0000"
                    }
                }
                tr.appendChild(td)
            }
        }
        tbody.appendChild(tr)
    }

}


const showOptDisInTable = (result, tbody) => {
    let itemLength = result.length

    for (let i = 0; i < itemLength; i++) {
        let tr = document.createElement("tr")
        for (let j = 0; j < 11; j++) {
            if (j == 0 || j == 10) {
                let td = document.createElement("td")
                let btn = document.createElement("button")
                let input = document.createElement("input")
                input.className = "mx-2"
                input.style.width = '50px'
                btn.innerText = "購買"
                if (j == 0) {
                    btn.className = "buy btn btn-sm btn-danger"
                    td.appendChild(btn)
                    td.appendChild(input)
                } else {
                    btn.className = "buy btn btn-sm btn-success"
                    td.appendChild(input)
                    td.appendChild(btn)
                }
                tr.appendChild(td)
            } else {
                let td = document.createElement("td")
                if (j == 5) {
                    td.className = "table-active"
                }
                td.innerText = result[i][optDisNameSeq[j-1]] //data[i][optDisNameSeq[j-1]] 
                tr.appendChild(td)
            }

        }
        tbody.appendChild(tr)
    }
}


const showUserMoneyLeftnTotalProfit = (result, div) => {
    let { moneyLeft, totalprofit } = result

    const moneyLeftTitle = document.createElement("h4")
    const moneyLeftContent = document.createElement("h5")
    const totalProfitTitle = document.createElement("h4")
    const totalProfitContent = document.createElement("h5")

    moneyLeftTitle.innerText = '權益數: '

    if (moneyLeft) {
        moneyLeftContent.innerText = moneyLeft
    } else {
        moneyLeftContent.innerText = 0
    }

    totalProfitTitle.innerText = '總損益: '
    
    if (totalprofit) {
        totalProfitContent.innerText = totalprofit
    } else {
        totalProfitContent.innerText = 0
    }

    div.appendChild(moneyLeftTitle)
    div.appendChild(moneyLeftContent)
    div.appendChild(totalProfitTitle)
    div.appendChild(totalProfitContent)

} 

