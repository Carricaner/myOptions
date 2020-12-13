// DOM
const nowTarget = document.querySelector('body > div > div:nth-child(5) > div.col-lg-12.text-center > table > tbody > tr > td:nth-child(4)')

// 頁內轉跳動畫
$("#navbarResponsive > ul > li:nth-child(1) > a").bind("click touch",function(){
    $('html,body').animate({scrollTop: ($($(this).attr('href')).offset().top -90 )},300);
});
$("#carouselExampleIndicators > div > div:nth-child(2) > div > a").bind("click touch",function(){
    $('html,body').animate({scrollTop: ($($(this).attr('href')).offset().top -90 )},300);
});

// Highchart
var options4plot1 = {
    chart: {
        type: 'area'
    },
    title: {
        text: '加權指數 v.s. 損益'
    },
    xAxis: {
        title: { 
            text: '加權指數',
        },
    },
    yAxis: {
        title: {
            text: '損益'
        },
        // plotLines: [{
        //     color: '#0d00ff',
        //     width: 2,
        //     value: 0,
        // }],
    },
    series: [{
        name: '這是你的損益',
        data: [],
    }],
    exporting: {
        enabled: false,
    }
}

var plot1 = new Highcharts.Chart('plot1', options4plot1);


// button listener
const buys = document.querySelectorAll('td.buy')
buys.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const numberOfCell = e.path[0].cellIndex + 1
        const numberOfRow = e.path[1].rowIndex
        const prefix = `body > div > div:nth-child(5) > div:nth-child(2) > table > tbody > `
        const target = Number(document.querySelector(prefix + `tr:nth-child(${numberOfRow}) > td.table-active`).textContent)
        const cp = Number(document.querySelector(prefix + `tr:nth-child(${numberOfRow}) > td:nth-child(${numberOfCell})`).textContent) 
        let newSeries = []
        let balance
        if (numberOfCell == '1') {
            for (let i = 13500; i < 14201; i += 5) {
                balance = target + cp
                let bracket = [i]
                if (i <= target) {
                    bracket.push(-50*cp)
                } else {
                    bracket.push(-50*cp + (i - target) * 50)
                }
                newSeries.push(bracket)
            }
            // update options
            plot1.update({
                xAxis: {
                    plotLines: [{
                        color: '#dc3545',
                        width: 1,
                        value: balance,
                        dashStyle: 'Dash',
                        label: {
                            text: `損益兩平點: ${balance}`,
                            style: {
                                color: '#dc3545',
                                fontWeight: 'bold'
                            },
                            verticalAlign: 'top',
                            x: 10,
                        },
                    },
                    {
                        color: '#002aff',
                        width: 1.5,
                        value: Number(nowTarget.textContent),
                        label: {
                            text: `目前履約價: ${nowTarget.textContent}`,
                            style: {
                                color: 'blue',
                                fontWeight: 'bold',
                            },
                            verticalAlign: 'top',
                            x: -20,
                        },
                    }],
                },
            })
            // update series
            plot1.series[0].update({ data: newSeries, color: '#dc3545'}, false)
            // redraw plots
            plot1.redraw()

        } else {
            for (let i = 13500; i < 14201; i += 5) {
                balance = target - cp
                let bracket = [i]
                if (i >= target) {
                    bracket.push(-50*cp)
                } else {
                    bracket.push(-50*cp + (target - i) * 50)
                }
                newSeries.push(bracket)
            }
            // update options
            plot1.update({
                xAxis: {
                    plotLines: [{
                        color: '#28a745',
                        width: 1,
                        value: balance,
                        dashStyle: 'Dash',
                        label: {
                            text: `損益兩平點: ${balance}`,
                            style: {
                                color: '#28a745',
                                fontWeight: 'bold'
                            },
                            verticalAlign: 'top',
                            x: -20,
                        },
                    },
                    {
                        color: 'blue',
                        width: 1.5,
                        value: Number(nowTarget.textContent),
                        label: {
                            text: `目前履約價: ${nowTarget.textContent}`,
                            style: {
                                color: 'blue',
                                fontWeight: 'bold',
                            },
                            verticalAlign: 'top',
                            x: 10,
                        },
                    }],
                },
            })
            // update series
            plot1.series[0].update({ data: newSeries, color: '#28a745'}, false)
            // redraw plots
            plot1.redraw()
        }
    })
})