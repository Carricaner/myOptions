// let access_token = window.localStorage["Authorization"];
const domain = window.location.host;
const protocol = window.location.protocol;


const signUpEmailInput = document.querySelector("#sigup > input.email")
const signUpPasswordInput = document.querySelector("#sigup > input.password")

const signInEmailInput = document.querySelector("#sigin > input.email")
const signInPasswordInput = document.querySelector("#sigin > input.password")

const signUpBtn = document.querySelector("#sigup > button")
const signInBtn = document.querySelector("#sigin > button")

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


signUpBtn.addEventListener("click", () => {
    let emailString = signUpEmailInput.value
    let passwordString = signUpPasswordInput.value

    if (!isValidEmailAddress(emailString)) {
        alert("[ Invalid Email ] Please key in another email address.")
    }else if (passwordString == '') {
        alert("[ Invalid Pssword ] Password should not be empty.")
    }else {
        let checkInput = {
            email: emailString,
            password:passwordString
        }

        fetchPack("/api/1.0/user/signUp", "POST", checkInput)
        .then(result => {
            if (result.msg == 'success') {
                window.localStorage["Authorization"] = 'Bearer ' + result.token
                signUpEmailInput.value = ""
                signUpPasswordInput.value = ""
                alert("Signup success.")
                window.location.href = `${protocol}//${domain}` + "/testPlot.html"
            } else {
                alert("Email is already registered.")
            }
        })
    }
})

signInBtn.addEventListener("click", () => {
    let emailString = signInEmailInput.value
    let passwordString = signInPasswordInput.value
    
    if (!isValidEmailAddress(emailString)) {
        alert("[ Invalid Email ] Please key in a proper email address.")
    }else if (passwordString == '') {
        alert("[ Invalid Pssword ] Password should not be empty.")
    }else {
        let checkInput = {
            email: emailString,
            password:passwordString
        }

        fetchPack("/api/1.0/user/signIn", "POST", checkInput)
        .then(result => {
            if (result.msg == 'success') {
                window.localStorage["Authorization"] = 'Bearer ' + result.token
                signInEmailInput.value = ""
                signInPasswordInput.value = ""
                alert("SignIn success.")
                window.location.href = `${protocol}//${domain}` + "/testPlot.html"
            } else if (result.msg == 'wrongPassword') {
                alert("[ Invalid Password ] Password is wrong.")
            } else if (result.msg == 'invalidEmail') {
                alert("[ Invalid Email ] Email is wrong.")
            }
        })
    }
})




const isValidEmailAddress = (string) => {
    let length = string.length
    if(string.indexOf("@") == -1 || string.indexOf("@") == 0 || string.indexOf("@") == length-1){
        return false
    }else{
        return true
    }
}


