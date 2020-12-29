// ---------- global data ----------
const domain = window.location.host;
const protocol = window.location.protocol;
let token = window.localStorage["Authorization"];
let userId = "";

// ---------- check authentication ----------
function checkTokenWhileWindowLoad() {
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

