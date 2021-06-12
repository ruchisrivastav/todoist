const BASE_URL = "https://todoist-be.herokuapp.com/"
// const BASE_URL = "http://localhost:5000/"

function login(username, password) {
    var form = document.getElementById("login-form");
    var loader = document.getElementById("loader")
    loader.style.display = "flex"
    fetch(BASE_URL + "login?username=" + username + "&password=" + password, { method: "GET", headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" } })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                username = { username: data.username }
                sessionStorage.setItem("userDetails", JSON.stringify(username))
                loader.style.display = "none"
                window.location.pathname = "/todoist-FE/home.html";
            } else if (data.status === 400) {
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
        }).catch(err => {
            console.error(err)
        })
}

function registerUser() {
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    var confirmPassword = document.getElementById("confirm-password").value
    var loader = document.getElementById("loader")
    console.log(loader)

    var form = document.getElementById("login-form");
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
        var responseBody = {
            username: username,
            password: password
        }
        loader.style.display = "flex"
        fetch(BASE_URL + "register", {
            method: "POST",
            headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
            body: JSON.stringify(responseBody)
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.status === 201) {
                    loader.style.display = "none"
                    window.location.pathname = "/todoist-FE"
                } else {
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
                }
            })
    }
}

function closeAlert() {
    var alert = document.getElementById("alert");
    alert.remove();
}
