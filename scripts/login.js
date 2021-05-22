window.onload = (function () {
    accounts = localStorage.getItem("accounts")
    if (accounts === null || accounts === undefined)
        localStorage.setItem("accounts", JSON.stringify([]))
})
function login(username, password) {
    var form = document.getElementById("login-form");
    var credentials = JSON.parse(localStorage.getItem("accounts"))
    if (credentials === null) {
        form.innerHTML += `
        <div id="alert" class='alert'>
            <div>
                <span>
                    <i class="fa fa-exclamation-circle" ></i>
                </span>
                <span>
                    Username not found! Please Register.
                </span>
            </div>
            <button class="close-alert" onclick="closeAlert()">
                <span>
                    <i class="fa fa-times"></i>
                </span>
            </button>
        </div>
        `

    } else {
        var login = credentials.find(element => atob(element.username) === username && atob(element.password) === password);
        if (login === undefined) {
            if (!document.getElementById("alert")) {
                form.innerHTML += `
                <div id="alert" class='alert'>
                    <div>
                        <span>
                            <i class="fa fa-exclamation-circle" ></i>
                        </span>
                        <span>
                            Username or password is incorrect. Please try again!
                        </span>
                    </div>
                    <button class="close-alert" onclick="closeAlert()">
                        <span>
                            <i class="fa fa-times"></i>
                        </span>
                    </button>
                </div>
                `
            }
        } else {
            var userDetails = {
                username: btoa(username),
                password: btoa(password)
            };
            sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
            form.action = "home.html";
        }
    }
}

function registerUser() {
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    var confirmPassword = document.getElementById("confirm-password").value
    console.log()
    var accounts = JSON.parse(localStorage.getItem("accounts"))
    var form = document.getElementById("login-form");
    if (accounts !== null && accounts !== undefined) {
        flag = false;
        for (var i = 0; i < accounts.length; i++) {
            if (atob(accounts[i].username) === username) {
                form.innerHTML += `
                <div id="alert" class='alert'>
                    <div>
                        <span>
                            <i class="fa fa-exclamation-circle" ></i>
                        </span>
                        <span>
                            Username already exists. Try something else.
                        </span>
                    </div>
                    <button class="close-alert" onclick="closeAlert()">
                        <span>
                            <i class="fa fa-times"></i>
                        </span>
                    </button>
                </div>
                `
                flag = true;
                break;
            }
        }
        if (!flag) {
            console.log(flag)
            if (password !== confirmPassword) {
                form.innerHTML += `
                    <div id="alert" class='alert'>
                        <div>
                            <span>
                                <i class="fa fa-exclamation-circle" ></i>
                            </span>
                            <span>
                                Passwords do not match.
                            </span>
                        </div>
                        <button class="close-alert" onclick="closeAlert()">
                            <span>
                                <i class="fa fa-times"></i>
                            </span>
                        </button>
                    </div>
                    `

            } else {
                console.log("indise else")
                var newUser = {
                    username: btoa(username),
                    password: btoa(password)
                }
                accounts.push(newUser);
                localStorage.setItem("accounts", JSON.stringify(accounts))
                window.location.pathname = "/"
            }
        }
    }
}

function closeAlert() {
    var alert = document.getElementById("alert");
    alert.remove();
}