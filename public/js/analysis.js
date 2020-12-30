// user authentication
checkTokenWhileWindowLoad(token)
	.then(result => {
		const { msg } = result;
		const navSignIn = document.querySelector("#navbarResponsive > ul > li:nth-child(4) > a");

		if (msg == "valid") {
			navSignIn.textContent = `個人頁面`;
			navSignIn.className = "btn btn-success";
			navSignIn.href = "profile.html";
			return fetchPack("/api/1.0/realtime/getIndex", "GET");
		} else if (msg == "expire") {
			swal({
				title: "登入逾期",
				text: "請重新登入",
				icon: "warning",
				button: "確認"
			})
				.then(result => {
					window.location.href = `${protocol}//${domain}` + "/signin.html";
				});
		} else {
			swal({
				title: "未能辨別使用者",
				text: "請先登入",
				icon: "warning",
				button: "確認"
			})
				.then(result => {
					window.location.href = `${protocol}//${domain}` + "/signin.html";
				});
		}
	});


fetchPack("/api/1.0/analysis/getStaticBigIndex")
	.then(result => {

		// update series
		staticBigIndex.series[0].update({ data: result.dataSeries }, false);

		// redraw plots
		staticBigIndex.redraw();
	});

fetchPack("/api/1.0/analysis/getStaticOptDis")
	.then(result => {

		// update options
		categories4OptDis = result.targetArray;
		staticOptDis.update({
			xAxis:[
				{categories: categories4OptDis},
				{categories: categories4OptDis}
			]
		});

		// update series
		staticOptDis.series[0].update({ data: result.callArray }, false);
		staticOptDis.series[1].update({ data: result.putArray }, false);

		// redraw plots
		staticOptDis.redraw();
	});

fetchPack("/api/1.0/analysis/getStaticBigguyLeft")
	.then(result => {

		// update options
		staticBigguyLeft.update({
			xAxis:{categories: result.dateArray},
		});
		staticBigguyCost.update({
			xAxis:{categories: result.dateArray},
		});

		// update series
		staticBigguyLeft.series[0].update({ data: result.foreignArray }, false);
		staticBigguyLeft.series[1].update({ data: result.selfArray }, false);
		staticBigguyLeft.series[2].update({ data: result.throwArray }, false);
		staticBigguyCost.series[0].update({ data: result.foreignCostArray }, false);
		staticBigguyCost.series[1].update({ data: result.selfCostArray }, false);
		staticBigguyCost.series[2].update({ data: result.throwCostArray }, false);

		// redraw plots
		staticBigguyLeft.redraw();
		staticBigguyCost.redraw();
	});

// Highcharts
var options4BigIndex = {
	rangeSelector: {
		selected: 1
	},
	title: {
		text: ""
	},
	plotOptions: {
		candlestick: {
			color: "#6a994e",
			upColor: "#ba2d0b"
		}
	},
	series: [{
		type: "candlestick",
		name: "大盤指數",
		data: [],
		dataGrouping: {
			units: [
				[
					"day", // unit name
					[1] // allowed multiples
				],
				[
					"month",
					[1, 3]
				]
			]
		}
	}],
	exporting: {
		enabled: false,
	}
};

var categories4OptDis = [];
var options4OptDis = {
	navigator: {
		enabled: false
	},
	rangeSelector : {
		enabled: false,
	},
	scrollbar: {
		enabled: false,
	},
	exporting: {
		enabled: false,
	},
	chart: {
		type: "bar"
	},
	title: {
		text: ""
	},
	accessibility: {
		point: {
			valueDescriptionFormat: "{index}. cp {xDescription}, {value}%."
		}
	},
	xAxis: [
		{
			categories: categories4OptDis,
			reversed: false,
			labels: {
				step: 2
			},
			accessibility: {
				description: "cp (call)"
			},
		},
		{ // mirror axis on right side
			opposite: true,
			reversed: false,
			categories: categories4OptDis,
			linkedTo: 0,
			labels: {
				step: 2
			},
			accessibility: {
				description: "cp (put)"
			},
		}
	],
	yAxis: {
		title: {
			text: null
		},
		labels: {
			formatter: function () {
				return Math.abs(this.value);
			}
		},
		accessibility: {
			description: "units left",

			// rangeDescription: 'Range: 0 to 5%'
		},
	},
	plotOptions: {
		series: {
			stacking: "normal",
		}
	},
	tooltip: {
		formatter: function () {
			return "<b>" + "履約價:" + this.point.category + "  " +  this.series.name + "</b><br/>" +
                "留倉口數:" + Highcharts.numberFormat(Math.abs(this.point.y), 1) + "(口)";
		}
	},
	series: [
		{
			name: "Call(買權)",
			data: [],
			color: "#ba2d0b"
		},
		{
			name: "Put(賣權)",
			data: [],
			color: "#6a994e",
		}
	]
};


var options4BigguyLeft = {
	chart: {
		type: "column"
	},
	title: {
		text: ""
	},
	exporting: {
		enabled: false,
	},
	xAxis: {
		categories: [],
		crosshair: true
	},
	yAxis: {
		title: {
			text: "期貨留倉口數(口)"
		}
	},
	tooltip: {
		headerFormat: "<span style=\"font-size:10px\">{point.key}</span><table>",
		pointFormat: "<tr><td style=\"color:{series.color};padding:0\">{series.name}: </td>" +
            "<td style=\"padding:0\"><b>{point.y:.1f} 口</b></td></tr>",
		footerFormat: "</table>",
		shared: true,
		useHTML: true
	},
	plotOptions: {
		column: {
			pointPadding: 0.2,
			borderWidth: 0
		}
	},
	credits: {
		enabled: false
	},
	series: [
		{
			name: "外資",
			data: [],
			color: "#23395b",
		},
		{
			name: "自營商",
			data: [],
			color: "#406e8e",
		},
		{
			name: "投信",
			data: [],
			color: "#8ea8c3",
		},
	]
};

var options4BigguyCost = {
	chart: {
		type: "column"
	},
	title: {
		text: ""
	},
	exporting: {
		enabled: false,
	},
	xAxis: {
		categories: [],
		crosshair: true
	},
	yAxis: {
		title: {
			text: "期貨留倉平均點數"
		}
	},
	tooltip: {
		headerFormat: "<span style=\"font-size:10px\">{point.key}</span><table>",
		pointFormat: "<tr><td style=\"color:{series.color};padding:0\">{series.name}: </td>" +
            "<td style=\"padding:0\"><b>{point.y:.1f} </b></td></tr>",
		footerFormat: "</table>",
		shared: true,
		useHTML: true
	},
	plotOptions: {
		column: {
			pointPadding: 0.2,
			borderWidth: 0
		}
	},
	credits: {
		enabled: false
	},
	series: [
		{
			name: "外資",
			data: [],
			color: "#23395b",
		},
		{
			name: "自營商",
			data: [],
			color: "#406e8e",
		},
		{
			name: "投信",
			data: [],
			color: "#8ea8c3",
		},
	]
};

var staticBigIndex = Highcharts.stockChart("plot1", options4BigIndex);

var staticOptDis = Highcharts.chart("plot2", options4OptDis);

var staticBigguyLeft = Highcharts.chart("plot3", options4BigguyLeft);

var staticBigguyCost = Highcharts.chart("plot4", options4BigguyCost);



// inner href anamation
const bigIndexSelector = "body > div > ul > li:nth-child(1) > a"
const optDisSelector = "body > div > ul > li:nth-child(2) > a"
const bigguyUnitSelector = "body > div > ul > li:nth-child(3) > a"
const bigguyCostSelector = "body > div > ul > li:nth-child(4) > a"

applyInnerHrefAnimationListener(bigIndexSelector, 120, 300)
applyInnerHrefAnimationListener(optDisSelector, 120, 400)
applyInnerHrefAnimationListener(bigguyUnitSelector, 120, 600)
applyInnerHrefAnimationListener(bigguyCostSelector, 120, 700)
