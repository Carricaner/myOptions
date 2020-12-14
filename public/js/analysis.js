// functions
const fetchPack = (endPoint, method, body = null) => {

    let option = {
        headers: {"Content-Type": "application/json"},
        method: method,
    }

    if (method == "POST") {
        option.body = JSON.stringify(body)
    }

    const fetching = fetch(endPoint, option)
    .then(response => {
        let message = response.json()
        return message;
    }) 

    return fetching
}


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






fetchPack('/api/1.0/analysis/getStaticBigIndex')
.then(result => {
    // update initial series
    staticBigIndex.series[0].update({ data: result.dataSeries }, false)
    // redraw plots
    staticBigIndex.redraw()
})


// Highcharts
var options4BigIndex = {
    rangeSelector: {
        selected: 1
    },
    title: {
        text: ''
    },
    plotOptions: {
        candlestick: {
            color: '#4ca64c',
            upColor: '#cc0000'
        }
    },
    series: [{
        type: 'candlestick',
        name: '大盤指數',
        data: [],
        dataGrouping: {
            units: [
                [
                    'day', // unit name
                    [1] // allowed multiples
                ],
                [
                    'month',
                    [1, 3, 6]
                ]
            ]
        }
    }],
    exporting: {
        enabled: false,
    }
}

var staticBigIndex = Highcharts.stockChart('plot1', options4BigIndex)


