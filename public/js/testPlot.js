var socket = io.connect();


// ---------- socket part ----------
socket.on('rtBigIndex', (receiver) => {
    let { date, time, data } = receiver
    // console.log(date)
    // console.log(time)
    // console.log(data)
})

socket.on('rtOptDis', (receiver) => {
    let { date, time, data } = receiver
    console.log(date + ' ' + time)
    var a = moment.tz(date + ' ' + time, "Asia/Taipei")
    console.log(a.format())
    console.log(a.valueOf())
    
    // console.log(data)
})

socket.on('test', (receiver) => {
    let { x, y } = receiver

    chart.series[0].update({
        data: [
            [time1, Math.random()*15],
            ]
      }, false)
      chart.redraw()
})



// highcharts
// set global setting 
Highcharts.setOptions({
    chart: {
        backgroundColor: {
            linearGradient: [0, 0, 500, 500],
            stops: [
                [0, 'rgb(255, 255, 255)'],
                [1, 'rgb(240, 240, 255)']
            ]
        },
        borderWidth: 2,
        plotBackgroundColor: 'rgba(255, 255, 255, .9)',
        plotShadow: true,
        plotBorderWidth: 1
    }
});



let time1 = 1607072008827 + 28800000



var chart = new Highcharts.Chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: '大盤指數'
    },
    // time: {
    //     timezone: 'Asia/Taipei'
    // },
    xAxis: {
        title: { 
            text: '點數',
        },
        type: 'datetime',
        dateTimeLabelFormats: {
            // month: '%e. %b',
            // year: '%b',
            // day: '%e. %b',
            minute: '%H:%M',
        },
    },
    yAxis: {
        title: {
            text: '時間'
        }
    },
    series: [{
        name: 'Jane',
        data: [[time1,1]]
    }, {
        name: 'John',
        data: [[time1,5]],
        color: '#BF0B23',
    }]
});

console.log(
    'Current time in New York',
    chart.time.dateFormat('%Y-%m-%d %H:%M:%S', Date.now())
);








