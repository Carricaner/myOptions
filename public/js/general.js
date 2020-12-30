/*
The js file contains general used variables, functions and etc.
*/


// ==================== [ Variables ] ====================
// << window >>
const domain = window.location.host;
const protocol = window.location.protocol;


// << User >>
let token = window.localStorage["Authorization"];
let userId = "";



// ==================== [ Functions ] ====================
// << fetch >>
const fetchPack = (endPoint, method, body = null) => {
	let option = {
		headers: {"Content-Type": "application/json"},
		method: method,
	};
	if (method == "POST") {
		option.body = JSON.stringify(body);
	}
	const fetching = fetch(endPoint, option)
		.then(response => {
			let message = response.json();
			return message;
		}); 
	return fetching;
};


// << User Authentication >>
const checkTokenWhileWindowLoad = (token) => {
	return new Promise((resolve, reject) => {
		window.onload = () => {
			if (token) {
				return fetchPack("/api/1.0/auth/checkJWT", "POST", {token: token})
					.then(result => {
						if (result.msg == "valid") {
							userId = result.payload.userId;
						}
						resolve({msg: result.msg});
					});
			} else {
				resolve({msg: "empty"});
			}
		};
	});
}


// << Inner-paged href# Animation >>
const applyInnerHrefAnimationListener = (selector, distance2top, secs) => {
	$(selector).bind("click touch", function () {
		$("html,body").animate({scrollTop: ($($(this).attr("href")).offset().top - distance2top)}, secs);
	});
}


// << Rolling number animation >>
const applyRollingNumber = (DOMelement, number, prefix, suffix, duration) => {
	$({count: parseInt(DOMelement.text().split("+")[0].replace(/\,/g, ""))}).animate({count: number}, {
		duration: duration ? duration : 1000,
		easing: "swing", 
		step: function (now) {
			DOMelement.text(prefix + (Math.floor(now) + suffix).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
		},
		complete: function () {
			countingFromZero = false;
		}
	});
};


// Frozen table head
const applyFrozenTablehead = (tableheadSelector) => {
	const $th = $(tableheadSelector).find("thead th");
	$(tableheadSelector).on("scroll", function() {
		$th.css("transform", "translateY("+ this.scrollTop +"px)");
	});
}


// Flash background => The css which has .flashOnce should be involved in the HTML containing the desired DOM.  
const applyFlashBackground = (DOM, secs) => {
	DOM.classList.add("flashOnce");
	setTimeout(() => {
		DOM.classList.remove("flashOnce");
	},
	secs);
};


// ==================== [ Socket ] ====================
const socket = io.connect();