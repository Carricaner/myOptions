var globaloptions = {
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
}


var options4chart = {
    chart: {
        type: 'area'
    },
    title: {
        text: '大盤指數'
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
        name: 'Night Future Index',
        data: [],
        color: '#BF0B23',
    }]
}

var options4chart2 = {
    chart: {
        type: 'spline'
    },
    title: {
        text: '測試'
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
        min: 14150,
    },
    series: [{
        name: 'Night Future Index',
        data: [[12123123121231, 14170]],
        color: '#BF0B23',
    }]
}


















