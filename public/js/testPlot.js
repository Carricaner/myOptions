var socket = io.connect();

// ---------- global data ----------
const domain = window.location.host
const protocol = window.location.protocol
let token = window.localStorage["Authorization"]
let userId = ""


// ---------- fetchPack ----------
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
window.onload = () => {
    if (token) {
        fetchPack('/api/1.0/auth/checkJWT', 'POST', {token: token})
        .then(result => {
            if (result.msg == 'valid') {
                userId = result.payload.userId
            } else {
                alert(result.msg)
                window.location.href = `${protocol}//${domain}` + "/signin.html"
            }
        })
    } else {
        alert('請先登入')
        window.location.href = `${protocol}//${domain}` + "/signin.html"
    }
}


// ---------- socket part ----------
socket.on('bigIndexContainer', (receiver) => {    
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


socket.on('futureContainer', (receiver) => {
    // update options
    chart2.update({
        yAxis: {
            min: receiver.low-20,
            max: receiver.high+20,
        }
    })
    // update series
    chart2.series[0].update({ data: receiver.data }, false)
    
    // redraw plots
    chart2.redraw()
})



// ---------- highcharts ----------
// global setting 
Highcharts.setOptions(globaloptions);


fetch('/api/1.0/realtime/getIndex')
.then(response => {
    let message = response.json();
    return message;
})
.then(result => {
    
    // update initial options
    chart.update({
        yAxis: {
            min: result.bigIndex.low-20,
            max: result.bigIndex.high+20,
        }
    })
    chart2.update({
        yAxis: {
            min: result.futureIndex.low-20,
            max: result.futureIndex.high+20,
        }
    })
    // update initial series
    chart.series[0].update({ data: result.bigIndex.data }, false)
    chart2.series[0].update({ data: result.futureIndex.data }, false)
    
    // redraw plots
    chart.redraw()
    chart2.redraw()

});



var chart = new Highcharts.Chart('container', options4chart2);
var chart2 = new Highcharts.Chart('container2', options4chart);




