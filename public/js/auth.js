// ---------- global data ----------
const domain = window.location.host
const protocol = window.location.protocol
let token = window.localStorage["Authorization"]
let userId = ""

// // ---------- check authentication ----------
// window.onload = () => {
//     if (token) {
//         fetchPack('/api/1.0/auth/checkJWT', 'POST', {token: token})
//         .then(result => {
//             if (result.msg == 'valid') {
//                 userId = result.payload.userId
//             } else {
//                 alert(result.msg)
//                 window.location.href = `${protocol}//${domain}` + "/index.html"
//             }
//         })
//     } else {
//         alert('請先登入')
//         window.location.href = `${protocol}//${domain}` + "/index.html"
//     }
// }

function checkTokenWhileWindowLoad() {
    return new Promise((resolve, reject) => {
        window.onload = () => {
            if (token) {
                return fetchPack('/api/1.0/auth/checkJWT', 'POST', {token: token})
                .then(result => {
                    if (result.msg == 'valid') {
                        userId = result.payload.userId
                        resolve({msg: 'valid'})
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
    })
}