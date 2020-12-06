var socket = io.connect();



// ---------- global data ----------
let optDis = 0
let columnNameSeq = ['call_var', 'call_deal', 'call_sell', 'call_buy', 'target', 'put_buy', 'put_sell', 'put_deal', 'put_var']


// ---------- socket part ----------
socket.on('realtimeOpt', (receiver) => {
    optDis = receiver
    let { date, time, product, data } = receiver
    const tbody = document.querySelector('#optDisTable table tbody')
    const trs = tbody.querySelectorAll('tr')

    for (let i = 0; i < trs.length; i++) {
        let tds = trs[i].querySelectorAll("td")
        for (let j = 0; j < tds.length; j++) {
            if ( 0 < j && j < tds.length-1) {
                tds[j].innerText = data[i][columnNameSeq[j-1]]
            }
        }
    }
})


// ---------- create items ----------
fetch('/api/1.0/realtime/future')
.then(response => {
    let message = response.json();
    return message;
})
.then(result => {
    optDis = result.optDis
    const tbody = document.querySelector('#optDisTable table tbody')
    let { data } = result.optDis
    let itemLength = data.length

    for (let i = 0; i < itemLength; i++) {
        let tr = document.createElement("tr")
        for (let j = 0; j < 11; j++) {
            if (j == 0 || j == 10) {
                let td = document.createElement("td")
                let btn = document.createElement("button")
                btn.className = "buy"
                let input = document.createElement("input")
                btn.innerText = "購買"
                td.appendChild(input)
                td.appendChild(btn)
                tr.appendChild(td)
            } else {
                let td = document.createElement("td")
                td.innerText = data[i][columnNameSeq[j-1]]  // data[i][columnNameSeq[j-1]]
                tr.appendChild(td)
            }

        }
        tbody.appendChild(tr)
    }

    const btns = document.querySelectorAll("button.buy")
    btns.forEach(btn => {btn.addEventListener("click", ClickBuy)})
});

// #optDisTable > table > tbody > tr:nth-child(53) > td:nth-child(6)

const ClickBuy = (e) => { 
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
        token: "wait real token to be applied",
        target: target,
        act: "buy",
        month: optDis.date,
        cp: cp,
        number: Number(input.value),
        cost: Number(cost.innerText),
    }
    console.log(carton)

    input.value = ""

    let option = {
		headers: {"Content-Type": "application/json"},
		method: "POST",
		body: JSON.stringify(carton)
	};

    fetch('/api/1.0/user/buyParts', option)
    .then(response => {
        let message = response.json();
        return message;
    })
    .then(result => {
        if (result.msg == 'success') {
            alert("購買成功")
        } else {
            alert("餘額不足")
        }
    })
    
}


const updateUserPartsnDisplay = () => {

    


}