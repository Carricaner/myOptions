const domain = window.location.host;
const protocol = window.location.protocol;

// global
const signUpEmailInput = document.querySelector("#sigup > div:nth-child(2) > input");
const signUpPasswordInput = document.querySelector("#sigup > div:nth-child(3) > input");

const signInEmailInput = document.querySelector("#sigin > div:nth-child(2) > input");
const signInPasswordInput = document.querySelector("#sigin > div:nth-child(3) > input");

const signUpBtn = document.querySelector("#sigup > button");
const signInBtn = document.querySelector("#sigin > button");



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


signUpBtn.addEventListener("click", () => {
	let emailString = signUpEmailInput.value;
	let passwordString = signUpPasswordInput.value;

	if (!isValidEmailAddress(emailString)) {
		swal({
			title: "Invalid Email",
			text: "請輸入正確電子郵件格式",
			icon: "error",
		}); 
	} else if (!checkVal(passwordString)) {
		swal({
			title: "Invalid Password",
			text: "密碼需為英文字母或數字組合",
			icon: "error",
		});
	}else if (passwordString == "") {
		swal({
			title: "Invalid Password",
			text: "密碼不可以為空白",
			icon: "error",
		});
	}else {
		let checkInput = {
			email: emailString,
			password:passwordString
		};

		fetchPack("/api/1.0/user/signUp", "POST", checkInput)
			.then(result => {
				if (result.msg == "success") {
					window.localStorage["Authorization"] = "Bearer " + result.token;
					signUpEmailInput.value = "";
					signUpPasswordInput.value = "";
					swal({
						title: "Success",
						text: "註冊成功",
						icon: "success",
					})
						.then(result => {
							window.location.href = `${protocol}//${domain}` + "/index.html";
						});
				} else {
					swal({
						title: "Invalid Email",
						text: "此電子郵件已經被註冊過，請選其他電子郵件註冊",
						icon: "error",
					});
				}
			});
	}
});


signInBtn.addEventListener("click", () => {
	let emailString = signInEmailInput.value;
	let passwordString = signInPasswordInput.value;
    
	if (!isValidEmailAddress(emailString)) {
		swal({
			title: "Invalid Email",
			text: "請輸入正確格式電子郵件",
			icon: "error",
		});
	}else if (passwordString == "") {
		swal({
			title: "Invalid Password",
			text: "密碼不可以為空白",
			icon: "error",
		});
	}else {
		let checkInput = {
			email: emailString,
			password:passwordString
		};

		fetchPack("/api/1.0/user/signIn", "POST", checkInput)
			.then(result => {
				if (result.msg == "success") {
					window.localStorage["Authorization"] = "Bearer " + result.token;
					signInEmailInput.value = "";
					signInPasswordInput.value = "";
					swal({
						title: "Success",
						text: "登入成功",
						icon: "success",
					})
						.then(result => {
							window.location.href = `${protocol}//${domain}` + "/index.html";
						});
				} else if (result.msg == "wrongPassword") {
					swal({
						title: "Invalid Password",
						text: "密碼錯誤",
						icon: "error",
					});
				} else if (result.msg == "invalidEmail") {
					swal({
						title: "Invalid Email",
						text: "此電子郵件未註冊",
						icon: "error",
					});
				}
			});
	}
});


const isValidEmailAddress = (string) => {
	let length = string.length;
	if(string.indexOf("@") == -1 || string.indexOf("@") == 0 || string.indexOf("@") == length-1){
		return false;
	}else{
		return true;
	}
};


const checkVal = (str) => {
	var regExp = /^[\d|a-zA-Z]+$/;
	if (regExp.test(str))
		return true;
	else
		return false;
};


//  ---------- popovers ----------
// for Popovers
const userInfo = document.querySelector("#userInfo");
const tooltip = document.querySelectorAll("#tooltip");

const DOMarr = [
	[userInfo, tooltip[0]],
];

const showEvents = ["mouseenter", "focus"];
const hideEvents = ["mouseleave", "blur"];

let popperInstance = null;

function create(badge, tooltip) {
	popperInstance = Popper.createPopper(
		badge, 
		tooltip,
		{
			placement: "bottom",
			modifiers: [
				{
					name: "offset",
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
			DOM[1].setAttribute("data-show", "");
			create(DOM[0], DOM[1]);
		});
	});
});

hideEvents.forEach(event => {
	DOMarr.forEach(DOM => {
		DOM[0].addEventListener(event, () => {
			DOM[1].removeAttribute("data-show");
			destroy();
		});
	});
});

