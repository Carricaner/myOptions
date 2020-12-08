var globaloptions = {
    chart: {
        backgroundColor: {
            // linearGradient: [0, 0, 500, 500],
        },
        borderWidth: 1,
        plotBackgroundColor: '#ffffff',
        plotShadow: true,
        plotBorderWidth: 1
    }
}


var options4chart = {
    chart: {
        type: 'area'
    },
    title: {
        text: '台指期'
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
        color: '#0EAE0B',
    }]
}

var options4chart2 = {
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
        name: '大盤指數',
        data: [],
        color: '#BF0B23',
    }]
}


















