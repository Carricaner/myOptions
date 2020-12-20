// ---------- DOM ---------- 
// for SignOut
const signout = document.querySelector('#navbarResponsive > ul > li:nth-child(4) > a')

// Personal information
const emailString = document.querySelector('#email')
const registerTimeString = document.querySelector('#registerTime')

// for Rolling Number
const moneyLeft = document.querySelector('#moneyLeft')
const totalProfit = document.querySelector('#totalProfit')
const highProfitString = document.querySelector('#highProfit')
const averageProfitString = document.querySelector('#averageProfit')
const winRateString = document.querySelector('#winRate')
const tradeTimesString = document.querySelector('#tradeTimes')
const secs = 500

// for Popovers
const fluidbadge = document.querySelector('#fluidbadge')
const totalBenefitbadge = document.querySelector('#totalBenefitbadge')
const returnbadge = document.querySelector('#returnbadge')
const winRatebadge = document.querySelector('#winRatebadge')
const tooltip = document.querySelectorAll('#tooltip');


// ---------- functions ----------
// Rolling Number 
const countToNumber = function (element, number, suffix, duration) {
    $({count: parseInt(element.text().split("+")[0].replace(/\,/g, ''))}).animate({count: number}, {
      duration: duration ? duration : 1000,
      easing: 'swing', 
      step: function (now) {
        element.text((Math.floor(now) + suffix).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      },
      complete: function () {
        countingFromZero = false;
      }
    });
}
// fetchPack
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



// ---------- Listeners ----------
// for SignOut
signout.addEventListener("click", ()=>{
    localStorage.removeItem("Authorization")
    swal({
        title: "登出成功",
        icon: "success",
        button: "確認"
    })
    .then(() => {
        window.location.href = `${protocol}//${domain}` + "/index.html"
    })
})



// ---------- Execution ----------
// Identify User
checkTokenWhileWindowLoad()
.then(result => {
  const { msg } = result

  if (msg == 'valid') {
    return fetchPack('api/1.0/profile/getUserInfo', 'POST', body = { userId })
  } else if (msg == 'expire') {
    swal({
        title: "登入逾期",
        text: "請重新登入",
        icon: "warning",
        button: "確認"
    })
    .then(result => {
        window.location.href = `${protocol}//${domain}` + "/signin.html"
    })
  } else {
    swal({
        title: "未能辨別使用者",
        text: "請先登入",
        icon: "warning",
        button: "確認"
    })
    .then(result => {
        window.location.href = `${protocol}//${domain}` + "/signin.html"
    })
  }
})
.then(result => {
  emailString.textContent = `Email: ${result[0].email}`
  const created_at = result[0].created_at.split('T')[0]
  registerTimeString.textContent = `註冊日期: ${created_at}`
  return Promise.all(
    [
      fetchPack('api/1.0/user/showUserMoneyLeftnTotalprofit', 'POST', body = { userId }),
      fetchPack('api/1.0/profile/analyzeUserHistoricParts', 'POST', body = { userId })
    ]
  )
})
.then(result => {
  const referArray = [
    result[0].moneyLeft,
    result[0].totalprofit,
    result[1].highest,
    result[1].averageProfit,
    result[1].winRate,
    result[1].tradeTimes,
  ]

  const DOMArray = [
    moneyLeft,
    totalProfit,
    highProfitString,
    averageProfitString,
    winRateString,
    tradeTimesString,
  ]
  // Number rolling Animation
  const animationArray = [
    $('#moneyLeft'),
    $('#totalProfit'),
    $('#highProfit'),
    $('#averageProfit'),
    $('#winRate'),
    $('#tradeTimes'),
  ]

  const animateData = (animationArray, referArray, secs) => {
    for (let i = 0; i < animationArray.length; i++) {
      if ( i == 4 ) {
        countToNumber(animationArray[i], referArray[i]*100, ' %', secs)
      } else {
        countToNumber(animationArray[i], referArray[i], '', secs)
      }
    }
  }

  const changeFontColorByValue = (referArray, DOMArray) => {
    for (let i = 0; i < referArray.length; i++) {
      if (![4,5].includes(i)) {
        if (referArray[i] > 0) {
          DOMArray[i].style.color='blue'
        } else if (referArray[i] < 0) {
          DOMArray[i].style.color='red'
        } else {
          DOMArray[i].style.color='black'
        }
      }
    }
  }
  changeFontColorByValue(referArray, DOMArray)
  animateData(animationArray, referArray, secs + Math.floor(Math.random()*1600))

  // update highcharts series
  cpRate.series[0].update({ data: [{y:result[1].callTimes}, {y:result[1].putTimes}] }, false)
  userPerformance.series[0].update({data: result[1].aveUserSeries})
  userPerformance.series[1].update({data: result[1].aveOtherSeries})
  // redraw highcharts plots
  cpRate.redraw()
  userPerformance.redraw()
})


// ---------- highcharts ----------
var options4cpPie = {
  chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
  },
  exporting: {
    enabled: false,
  },
  title: {
      text: ''
  },
  tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  accessibility: {
      point: {
          valueSuffix: '%'
      }
  },
  plotOptions: {
      pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
              enabled: false
          },
          showInLegend: true
      }
  },
  series: [{
      name: '商品',
      colorByPoint: true,
      data: [
        {
          name: '買權(Call)',
          y: 0,
          sliced: false,
          selected: false,
          color: '#ef233c',
        },
        {
          name: '賣權(Put)',
          y: 0,
          color: '#a7c957',
        }
      ]
  }]
}

var options4performance = {
  chart: {
      type: 'column'
  },
  title: {
      text: ''
  },
  xAxis: {
      categories: [
        '平均每筆成交價 (新台幣元)',
        '平均每筆交易權利金 (新台幣元)'
      ],
      crosshair: true
  },
  exporting: {
    enabled: false,
  },
  yAxis: {
      min: 0,
      title: {
          text: 'NT dollar'
      }
  },
  tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>NT$ {point.y:.1f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
  },
  plotOptions: {
      column: {
          pointPadding: 0.2,
          borderWidth: 0
      }
  },
  series: [{
      name: '個人',
      data: [],
      color: '#2a9d8f'

  }, {
      name: '其他全部交易者',
      data: [],
      color: '#457b9d'

  }]
}

var cpRate = Highcharts.chart('cpRate', options4cpPie)
var userPerformance = Highcharts.chart('performance', options4performance)


//  ---------- popovers ----------
const DOMarr = [
  [fluidbadge, tooltip[0]],
  [totalBenefitbadge, tooltip[1]],
  [returnbadge, tooltip[2]],
  [winRatebadge, tooltip[3]],
]
const showEvents = ['mouseenter', 'focus'];
const hideEvents = ['mouseleave', 'blur'];

let popperInstance = null;

function create(badge, tooltip) {
  popperInstance = Popper.createPopper(
    badge, 
    tooltip,
    {
      placement: 'bottom',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    }
  );
}

function destroy() {
  if (popperInstance) {
    popperInstance.destroy();
    popperInstance = null;
  }
}

showEvents.forEach(event => {
  DOMarr.forEach(DOM => {
    DOM[0].addEventListener(event, () => {
      DOM[1].setAttribute('data-show', '');
      create(DOM[0], DOM[1]);
    });
  })
});

hideEvents.forEach(event => {
  DOMarr.forEach(DOM => {
    DOM[0].addEventListener(event, () => {
      DOM[1].removeAttribute('data-show');
      destroy();
    });
  })
});
