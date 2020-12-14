// 頁內轉跳動畫
$("#navbarResponsive > ul > li:nth-child(1) > a").bind("click touch",function(){
    $('html,body').animate({scrollTop: ($($(this).attr('href')).offset().top -90 )},300);
});
$("#carouselExampleIndicators > div > div:nth-child(2) > div > a").bind("click touch",function(){
    $('html,body').animate({scrollTop: ($($(this).attr('href')).offset().top -90 )},300);
});


// DOM
const nowTarget = document.querySelector('body > div > div:nth-child(5) > div.col-lg-12.text-center > table > tbody > tr > td:nth-child(4)')


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

// Highchart
// chart globle srtting
// var globaloptions = {
//     chart: {
//         backgroundColor: {
//             // linearGradient: [0, 0, 500, 500],
//         },
//         borderWidth: 1,
//         plotBackgroundColor: '#ffffff',
//         plotShadow: true,
//         plotBorderWidth: 1
//     }
// }
// Highcharts.setOptions(globaloptions);

var options4bigIndex = {
    chart: {
        type: 'area'
    },
    title:{
        text:''
    },
    xAxis: {
        title: { 
            text: '時間',
        },
        type: 'datetime',
    },
    yAxis: {
        title: {
            text: '點數'
        },
        // min: 14150,
    },
    series: [{
        name: '大盤指數',
        data: [],
        color: '#0066ff',
    }],
    exporting: {
        enabled: false,
    }
}

var options4future = {
    chart: {
        type: 'area'
    },
    title:{
        text:''
    },
    xAxis: {
        title: { 
            text: '時間',
        },
        type: 'datetime',
    },
    yAxis: {
        title: {
            text: '點數'
        },
        // min: 14150,
    },
    series: [{
        name: '台指期',
        data: [],
        color: '#ff6600',
    }],
    exporting: {
        enabled: false,
    }
}

var bigIndex = new Highcharts.Chart('bigIndex', options4bigIndex);
var future = new Highcharts.Chart('future', options4future);

fetchPack('/api/1.0/realtime/getIndex', 'GET')
.then(result => {
    // update initial options
    bigIndex.update({
        yAxis: {
            min: result.bigIndex.low-20,
            max: result.bigIndex.high+20,
        }
    })
    future.update({
        yAxis: {
            min: result.futureIndex.low-20,
            max: result.futureIndex.high+20,
        }
    })
    // update initial series
    bigIndex.series[0].update({ data: result.bigIndex.data }, false)
    future.series[0].update({ data: result.futureIndex.data }, false)
    // redraw plots
    bigIndex.redraw()
    future.redraw()
});


// ---------- socket part ----------
var socket = io.connect();
socket.on('bigIndexContainer', (receiver) => {    
    // update options
    bigIndex.update({
        yAxis: {
            min: receiver.low-20,
            max: receiver.high+20,
        }
    })
    // update series
    bigIndex.series[0].update({ data: receiver.data }, false)
    // redraw plots
    bigIndex.redraw()
})


socket.on('futureContainer', (receiver) => {
    // update options
    future.update({
        yAxis: {
            min: receiver.low-20,
            max: receiver.high+20,
        }
    })
    // update series
    future.series[0].update({ data: receiver.data }, false)
    // redraw plots
    future.redraw()
})