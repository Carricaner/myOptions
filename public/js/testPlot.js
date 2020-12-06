var socket = io.connect();


// ---------- socket part ----------
socket.on('futureContainer', (receiver) => {
    console.log(receiver)
    
    // update options
    chart.update({
        yAxis: {
            min: receiver.low-20,
            max: receiver.high+20,
        }
    })
    // update series
    chart.series[0].update({ data: receiver.data }, false)
    
    // redraw plots
    chart.redraw()

})

socket.on('rtOptDis', (receiver) => {
    // let { date, time, data } = receiver
    // console.log(date + ' ' + time)
    // var a = moment.tz(date + ' ' + time, "Asia/Taipei")
    // console.log(a.format())
    // console.log(a.valueOf())
    
    // console.log(data)
})

socket.on('test', (receiver) => {
    let { x, y } = receiver

})



// ---------- highcharts ----------
// global setting 
Highcharts.setOptions(globaloptions);



fetch('/api/1.0/realtime/future')
.then(response => {
    let message = response.json();
    return message;
})
.then(result => {
    
    // update initial options
    chart.update({
        yAxis: {
            min: result.futureIndex.low-20,
            max: result.futureIndex.high+20,
        }
    })

    // update initial series
    chart.series[0].update({ data: result.futureIndex.data }, false)
    
    // redraw plots
    chart.redraw()
});

var chart = new Highcharts.Chart('container', options4chart);
var chart2 = new Highcharts.Chart('container2', options4chart2);



